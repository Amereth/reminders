import { useDeleteEventMutation } from '@/hooks/api/events'
import { EventCard } from './EventCard'
import { Event } from '@reminders/schemas'
import { Button } from '../ui/button'
import { Icon } from '../icon'
import { ArrowDownToLine } from 'lucide-react'
import { Loader } from '../Loader'

type EventListProps = LoadMoreProps & {
  events: Event[]
}

export const EventList = ({ events, ...loadMoreProps }: EventListProps) => {
  const { mutate: deleteEvent } = useDeleteEventMutation()

  return (
    <div className='grid min-h-0 grow auto-rows-min grid-cols-1 gap-4 overflow-auto pb-4 pr-4 pt-4 lg:grid-cols-2 xl:grid-cols-3'>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onDelete={() => deleteEvent(event.id)}
        />
      ))}

      <LoadMore {...loadMoreProps} />
    </div>
  )
}

type LoadMoreProps = {
  fetchNextPage: (() => void) | undefined
  isFetching: boolean
}

const LoadMore = ({ fetchNextPage, isFetching }: LoadMoreProps) => {
  if (!fetchNextPage) return null

  if (isFetching) return <Loader />

  return (
    <Button
      size='icon'
      variant='outline'
      className='mx-auto rounded-full'
      onClick={fetchNextPage}
    >
      <Icon icon={ArrowDownToLine} />
    </Button>
  )
}
