import { useAuthMutation } from '@/hooks/use-auth-mutation'
import { useQueryClient } from '@tanstack/react-query'
import { Event, InsertEvent } from '@reminders/schemas'
import { toast } from 'sonner'
import keys from '@query-keys'

export type CreateEventBody = Pick<
  InsertEvent,
  'description' | 'dueDate' | 'labels'
>

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient()

  return useAuthMutation<Event[], CreateEventBody, Event[]>(
    {
      mutationKey: keys.events.base(),
      onMutate: async (event) => {
        await queryClient.cancelQueries({ queryKey: keys.events.base() })

        const previousEvents = queryClient.getQueryData<Event[]>(
          keys.events.base(),
        )

        queryClient.setQueryData<Event[]>(keys.events.base(), (old = []) => [
          ...old,
          {
            ...event,
            id: 'temporary',
            createdAt: new Date(),
            labels: event.labels.map((label) => ({ id: label, label })),
          } as Event,
        ])

        return previousEvents
      },

      onSuccess(data, _variables, context) {
        toast.success('event created')

        queryClient.setQueryData(keys.events.base(), [...data, ...context])
      },

      onError: (error, _, context) => {
        toast.error(error.message)
        queryClient.setQueryData(keys.events.base(), context)
      },
    },
    { method: 'POST' },
  )
}
