import { format } from '@formkit/tempo'
import { CalendarIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TimePicker, TimePickerProps } from './time-picker/time-picker'
import { DayPickerSingleProps } from 'react-day-picker'
import { full_date_time } from '@reminders/date'
import { Icon } from './icon'

export type DateTimePickerProps = {
  value: Date
  onChange: (date: Date | undefined | null) => void
  className?: string
  calendarProps?: Omit<DayPickerSingleProps, 'selected' | 'onSelect'>
  timePickerProps?: TimePickerProps
}

export function DateTimePicker({
  value,
  onChange,
  className,
  calendarProps,
  timePickerProps,
}: DateTimePickerProps) {
  return (
    <div className='flex gap-2'>
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
            {value ? format(value, full_date_time) : <span>pick a date</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            {...calendarProps}
            selected={value}
            onSelect={onChange}
            initialFocus
          />
          <div className='border-border border-t p-3'>
            <TimePicker setDate={onChange} date={value} {...timePickerProps} />
          </div>
        </PopoverContent>
      </Popover>

      <Button size='icon' variant='ghost' onClick={() => onChange(undefined)}>
        <Icon icon={X} />
      </Button>
    </div>
  )
}
