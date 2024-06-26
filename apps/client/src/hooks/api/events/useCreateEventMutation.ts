import { useAuthMutation } from '@/hooks/use-auth-mutation'
import { Event, InsertEventWithUid } from '@reminders/schemas'
import keys from '@query-keys'
import { useQueryClient } from '@tanstack/react-query'

export type CreateEventBody = Pick<
  InsertEventWithUid,
  'description' | 'dueDate' | 'labels'
>

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient()

  return useAuthMutation<Event, CreateEventBody, Event[]>(
    { getRequestUrl: () => keys.events.base.url },

    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: keys.events.base.key })
      },
    },

    { method: 'POST' },
  )
}
