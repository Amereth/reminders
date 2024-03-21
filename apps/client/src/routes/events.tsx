import { useEventsQuery } from '@/hooks/api/events/useEventsQuery'
import { createFileRoute } from '@tanstack/react-router'
import { EventCard } from '@/components/events/EventCard'
import { useDeleteEventMutation } from '@/hooks/api/events/useDeleteEventMutation'

const EventsList = () => {
  const { data } = useEventsQuery()
  const { mutate } = useDeleteEventMutation()

  return (
    <div className='grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {data?.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onDelete={() => mutate(event.id)}
        />
      ))}
    </div>
  )
}

export const Route = createFileRoute('/events')({
  component: EventsList,
})
