import { useAuthMutation } from '@/hooks/use-auth-mutation'
import { useQueryClient } from '@tanstack/react-query'
import { Event } from '@reminders/schemas'
import { toast } from 'sonner'
import keys from '@query-keys'

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient()

  return useAuthMutation<Event, Event['id'], Event[]>(
    {
      mutationKey: keys.events.base(),
      onMutate: async (eventId) => {
        await queryClient.cancelQueries({ queryKey: keys.events.base() })

        const previousEvents = queryClient.getQueryData<Event[]>(
          keys.events.base(),
        )

        queryClient.setQueryData<Event[]>(keys.events.base(), (old = []) => {
          const index = old.findIndex((event) => event.id === eventId)

          if (index === -1) return old

          return old.toSpliced(index, 1)
        })

        return previousEvents
      },

      onError: (error, _, context) => {
        toast.error(error.message)
        queryClient.setQueryData(keys.events.base(), context)
      },
    },
    { method: 'DELETE' },
  )
}
