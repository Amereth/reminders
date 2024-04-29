import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TimePicker } from './time-picker/time-picker'

export type DateTimePickerProps = {
  value: Date
  onChange: (date: Date | undefined) => void
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  className,
}: DateTimePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {value ? format(value, 'PPP HH:mm:ss') : <span>pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={onChange}
          initialFocus
        />
        <div className='border-border border-t p-3'>
          <TimePicker setDate={onChange} date={value} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
