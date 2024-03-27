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
  <Card className='bg-slate-700 text-slate-300 max-sm:p-2' key={event.id}>
    <CardHeader className='flex-row'>
      {event.dueDate && (
        <div className='text-sm tracking-wider'>
          {format(event.dueDate, weekday_date_time)}
        </div>
      )}

      <Button size='icon' variant='ghost' className='ml-auto text-slate-300'>
        <PenIcon />
      </Button>

      <Button
        size='icon'
        variant='ghost'
        color=''
        className='text-slate-300'
        onClick={onDelete}
      >
        <TrashIcon />
      </Button>
    </CardHeader>

    <CardContent>
      <p>{event.description}</p>
    </CardContent>
  </Card>
)
