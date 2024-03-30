import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { useQueryClient } from '@tanstack/react-query'
import { Event, InsertEvent } from '@reminders/schemas'
import { eventsQueryKey } from './useEventsQuery'
import { toast } from 'sonner'

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation<
    Event[],
    Pick<InsertEvent, 'description' | 'dueDate'>,
    Event[]
  >(
    {
      mutationKey: [`/events`],
      onMutate: async (event) => {
        await queryClient.cancelQueries({ queryKey: eventsQueryKey })

        const previousEvents = queryClient.getQueryData<Event[]>(eventsQueryKey)

        queryClient.setQueryData<Event[]>(eventsQueryKey, (old = []) => [
          ...old,
          {
            id: 'temporary',
            ...event,
            createdAt: new Date(),
          } as Event,
        ])

        return previousEvents
      },

      onSuccess(data, _variables, context) {
        toast.success('event created')

        queryClient.setQueryData(eventsQueryKey, [...data, ...context])
      },

      onError: (error, _, context) => {
        toast.error(error.message)
        queryClient.setQueryData(eventsQueryKey, context)
      },
    },
    { method: 'POST' },
  )
}
