import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { useQueryClient } from '@tanstack/react-query'
import { Event, InsertEvent } from '@reminders/schemas'
import { toast } from 'sonner'
import keys from '@keys'

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation<
    Event[],
    Pick<InsertEvent, 'description' | 'dueDate'>,
    Event[]
  >(
    {
      mutationKey: keys.events,
      onMutate: async (event) => {
        await queryClient.cancelQueries({ queryKey: keys.events })

        const previousEvents = queryClient.getQueryData<Event[]>(keys.events)

        queryClient.setQueryData<Event[]>(keys.events, (old = []) => [
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

        queryClient.setQueryData(keys.events, [...data, ...context])
      },

      onError: (error, _, context) => {
        toast.error(error.message)
        queryClient.setQueryData(keys.events, context)
      },
    },
    { method: 'POST' },
  )
}
