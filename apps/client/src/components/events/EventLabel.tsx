import { Label } from '@reminders/schemas'
import { Badge } from '../ui/badge'

type EventLabelProps = {
  label: Label
}

export const EventLabel = ({ label }: EventLabelProps) => {
  return <Badge variant='outline'>{label.label}</Badge>
}
