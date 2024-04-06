import { PenIcon, TrashIcon } from 'lucide-react'
import { Event, Label } from '@reminders/schemas'
import { Button } from '@ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@ui/card'
import { format } from 'date-fns'
import { weekday_date_time } from '@reminders/date'
import { EventLabel } from './EventLabel'
import { Divider } from '../Divider'

type EventCardProps = {
  event: Event
  onDelete: () => void
}

export const EventCard = ({ event, onDelete }: EventCardProps) => (
  <Card className='bg-slate-800 max-sm:p-2' key={event.id}>
    <CardHeader>
      <div className='flex flex-row items-end'>
        {event.dueDate && (
          <div className='mb-2 text-sm tracking-wider'>
            {format(event.dueDate, weekday_date_time)}
          </div>
        )}

        <Button size='icon' variant='link' className='ml-auto'>
          <PenIcon strokeWidth={1.5} />
        </Button>

        <Button
          size='icon'
          variant='link'
          className='hover:text-destructive'
          onClick={onDelete}
        >
          <TrashIcon strokeWidth={1.5} />
        </Button>
      </div>

      <Divider position='horizontal' />
    </CardHeader>

    <CardContent className='!pt-0'>
      <p>{event.description}</p>
    </CardContent>

    <EventLabels labels={event.labels} />
  </Card>
)

const EventLabels = ({ labels }: { labels: Label[] }) => {
  if (labels.length === 0) return null

  return (
    <CardFooter className='flex-col items-start gap-2'>
      <Divider position='horizontal' />

      <div className='flex gap-2 md:gap-4'>
        {labels.map((label) => (
          <EventLabel key={label.id} label={label} />
        ))}
      </div>
    </CardFooter>
  )
}
