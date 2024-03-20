import { PenIcon, TrashIcon } from 'lucide-react'
import { Event } from '@schemas'
import { Button } from '../ui/button'
import { Card, CardHeader, CardContent } from '../ui/card'
import dayjs from 'dayjs'

type EventCardProps = {
  event: Event
  onDelete: () => void
}

export const EventCard = ({ event, onDelete }: EventCardProps) => (
  <Card className='bg-slate-800 text-slate-300 max-sm:p-2' key={event.id}>
    <CardHeader className='flex-row'>
      {event.dueDate && (
        <div className='text-sm tracking-wider'>
          {dayjs(event.dueDate).format('ddd, MMM D, YYYY HH:mm')}
        </div>
      )}

      <Button size='icon' variant='ghost' className='ml-auto text-slate-300'>
        <PenIcon />
      </Button>

      <Button
        size='icon'
        variant='ghost'
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
