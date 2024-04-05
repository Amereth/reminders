import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { useQueryClient } from '@tanstack/react-query'
import { Event } from '@reminders/schemas'
import { toast } from 'sonner'
import keys from '@keys'

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation<Event, Event['id'], Event[]>(
    {
      mutationKey: keys.events,
      onMutate: async (eventId) => {
        await queryClient.cancelQueries({ queryKey: keys.events })

        const previousEvents = queryClient.getQueryData<Event[]>(keys.events)

        queryClient.setQueryData<Event[]>(keys.events, (old = []) => {
          const index = old.findIndex((event) => event.id === eventId)

          if (index === -1) return old

          return old.toSpliced(index, 1)
        })

        return previousEvents
      },

      onError: (error, _, context) => {
        toast.error(error.message)
        queryClient.setQueryData(keys.events, context)
      },
    },
    { method: 'DELETE' },
  )
}
