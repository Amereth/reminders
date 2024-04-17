import { useAuthMutation } from '@/hooks/use-auth-mutation'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { Event } from '@reminders/schemas'
import { toast } from 'sonner'
import keys from '@query-keys'
import { Paginated } from '@reminders/utils'

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient()

  return useAuthMutation<Event, Event['id'], InfiniteData<Paginated<Event[]>>>(
    { getRequestUrl: (variables) => keys.events.withId(variables).url },

    {
      onMutate: async (eventId) => {
        await queryClient.cancelQueries({
          queryKey: keys.events.paginated.key,
        })

        const previous = queryClient.getQueryData<
          InfiniteData<Paginated<Event[]>>
        >(keys.events.paginated.key)

        queryClient.setQueryData<InfiniteData<Paginated<Event[]>>>(
          keys.events.paginated.key,
          (old) => {
            if (!old) return

            const next: InfiniteData<Paginated<Event[]>> = {
              ...old,
              pages: old.pages.map((page) => {
                const eventToDelete = page.data.find(
                  (event) => event.id === eventId,
                )
                if (!eventToDelete) return page

                return {
                  ...page,
                  data: page.data.filter((event) => event.id !== eventId),
                }
              }),
            }
            return next
          },
        )

        return previous
      },

      onError: (error, _, context) => {
        toast.error(error.message)
        queryClient.setQueryData(keys.events.base.key, context)
      },
    },

    { method: 'DELETE' },
  )
}
