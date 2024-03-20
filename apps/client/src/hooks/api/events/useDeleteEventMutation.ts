import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { useQueryClient } from '@tanstack/react-query'
import { Event } from '@schemas'
import { eventsQueryKey } from './useEventsQuery'
import { toast } from 'sonner'

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation<Event, Event['id'], Event[]>(
    {
      mutationKey: [`/events`],
      onMutate: async (eventId) => {
        await queryClient.cancelQueries({ queryKey: eventsQueryKey })

        const previousEvents = queryClient.getQueryData<Event[]>(eventsQueryKey)

        queryClient.setQueryData<Event[]>(eventsQueryKey, (old = []) => {
          const index = old.findIndex((event) => event.id === eventId)

          if (index === -1) return old

          return old.toSpliced(index, 1)
        })

        return previousEvents
      },

      onError: (error, _, context) => {
        toast.error(error.message)
        queryClient.setQueryData(eventsQueryKey, context)
      },
    },
    { method: 'DELETE' },
  )
}
