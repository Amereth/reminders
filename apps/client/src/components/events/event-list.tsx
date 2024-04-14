import { useDeleteEventMutation } from '@/hooks/api/events'
import { EventCard } from './EventCard'
import { Event } from '@reminders/schemas'

type EventListProps = {
  events: Event[]
}

export const EventList = ({ events }: EventListProps) => {
  const { mutate: deleteEvent } = useDeleteEventMutation()

  return (
    <div className='mt-4 grid min-h-0 grow auto-rows-min grid-cols-1 gap-4 overflow-auto pb-4 pr-4 lg:grid-cols-2 xl:grid-cols-3'>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onDelete={() => deleteEvent(event.id)}
        />
      ))}
    </div>
  )
}
