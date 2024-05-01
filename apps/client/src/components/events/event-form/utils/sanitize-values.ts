import { CreateEventBody } from '@/hooks/api/events'
import { FormModel } from '../event-form'
import { insertEventSchema } from '@reminders/schemas'

export const sanitizeValues = (values: FormModel): CreateEventBody => {
  console.log('sanitizeValues ~ values:', values)
  const dueDate = values.date.toISOString()

  const labels = values.labels?.map((label) => label.value)

  return insertEventSchema.parse({
    description: values.description,
    dueDate,
    labels,
  })
}
