import { CreateEventBody } from '@/hooks/api/events'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@lib/utils'
import { insertEventSchema } from '@reminders/schemas'
import { Button } from '@ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Textarea } from '@ui/textarea'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LabelsSelector } from './labels-selector'
import { sanitizeValues } from './utils/sanitize-values'
import { DateTimePicker } from '@/components/date-time-picker'
import { isError } from 'remeda'

const formModel = insertEventSchema.pick({ description: true }).extend({
  date: z.date().min(new Date()),
  labels: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .optional(),
})

export type FormModel = z.infer<typeof formModel>

export type EventFormProps = {
  formVisible: boolean
  onSubmit: (data: CreateEventBody) => Promise<Error>
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

  const onSubmit = form.handleSubmit(async (formValues) => {
    const resp = await _onSubmit(sanitizeValues(formValues))

    if (isError(resp)) return

    form.reset()
    onClose()
  })

  if (!formVisible) return null

  return (
    <Form {...form}>
      <form className={cn(className, 'space-y-4')} onSubmit={onSubmit}>
        <DevTool control={form.control} />

        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel className='pb-2'>due date</FormLabel>
              <DateTimePicker className='w-full' {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className='mt-4'>
          <LabelsSelector />
        </div>

        <div className='!mt-8 flex gap-4'>
          <Button type='submit' variant='outline-success'>
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
