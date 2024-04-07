import { CreateEventBody } from '@/hooks/api/events'
import { FormModel } from '../event-form'
import { add } from 'date-fns'

export const sanitizeValues = (values: FormModel): CreateEventBody => {
  const hours = +values.time.split(':')[0]
  const minutes = +values.time.split(':')[1]

  const dueDate = add(values.date, {
    hours,
    minutes,
  }).toISOString()

  const labels = values.labels.map((label) => label.value)

  return { description: values.description, dueDate, labels }
}
