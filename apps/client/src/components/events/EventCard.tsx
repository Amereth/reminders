import { PenIcon, TrashIcon } from 'lucide-react'
import { Event } from '@reminders/schemas'
import { Button } from '@ui/button'
import { Card, CardHeader, CardContent } from '@ui/card'
import { format } from 'date-fns'
import { weekday_date_time } from '@reminders/date'

type EventCardProps = {
  event: Event
  onDelete: () => void
}

export const EventCard = ({ event, onDelete }: EventCardProps) => (
  <Card className='bg-slate-800 max-sm:p-2' key={event.id}>
    <CardHeader className='flex-row'>
      {event.dueDate && (
        <div className='text-sm tracking-wider'>
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
    </CardHeader>

    <CardContent>
      <p>{event.description}</p>
    </CardContent>
  </Card>
)
