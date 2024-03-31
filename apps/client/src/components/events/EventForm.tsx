import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { z } from 'zod'
import { InsertEvent, insertEventsSchema } from '@reminders/schemas'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@lib/utils'
import { add, format } from 'date-fns'
import { weekday_date_time } from '@reminders/date'
import { Calendar } from '@ui/calendar'
import { Textarea } from '@ui/textarea'
import { Input } from '@ui/input'

const formModel = insertEventsSchema.pick({ description: true }).extend({
  date: z.date(),
  time: z.string(),
})

type FormModel = z.infer<typeof formModel>

type EventFormProps = {
  formVisible: boolean
  onSubmit: (data: Pick<InsertEvent, 'description' | 'dueDate'>) => void
  onClose: () => void
  className?: string
}

export const EventForm = ({
  formVisible,
  onSubmit: _onSubmit,
  onClose,
  className,
}: EventFormProps) => {
  const form = useForm<FormModel>({ resolver: zodResolver(formModel) })

  const onSubmit = form.handleSubmit((formValues) => {
    const hours = +formValues.time.split(':')[0]
    const minutes = +formValues.time.split(':')[1]

    const dueDate = add(formValues.date, {
      hours,
      minutes,
    }).toISOString()

    _onSubmit({ description: formValues.description, dueDate })

    form.reset()
  })

  if (!formVisible) return null

  return (
    <Form {...form}>
      <form
        className={cn(
          className,
          'rounded-xl border-[1px] border-slate-300 p-4',
        )}
        onSubmit={onSubmit}
      >
        <div className='flex items-start gap-4'>
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='pb-2'>due date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          '!mt-0 w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value && (
                          <span>{format(field.value, weekday_date_time)}</span>
                        )}
                        <CalendarIcon
                          strokeWidth={1.5}
                          className='ml-auto h-4 w-4'
                        />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='time'
            render={({ field }) => (
              <FormItem>
                <FormLabel>time</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='mt-4 flex gap-4'>
          <Button type='submit' variant='outline'>
            submit
          </Button>
          <Button
            type='reset'
            variant='outline-destructive'
            onClick={() => {
              form.reset()
              onClose()
            }}
          >
            cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
