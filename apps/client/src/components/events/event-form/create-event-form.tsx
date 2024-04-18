import { useCreateEventMutation } from '@/hooks/api/events'
import { PlusIcon } from 'lucide-react'
import { EventForm } from './event-form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { createEventFormControls, useControlsSnapshot } from '../state'

type CreateEventFormProps = {
  triggerClassName?: string
}

export const CreateEventForm = ({ triggerClassName }: CreateEventFormProps) => {
  const { mutate: createEvent } = useCreateEventMutation()
  const { createEventFormOpen } = useControlsSnapshot()

  return (
    <Sheet
      open={createEventFormOpen}
      onOpenChange={createEventFormControls.toggle}
    >
      <SheetTrigger className={triggerClassName}>
        <Button size='icon' variant='outline'>
          <PlusIcon strokeWidth={1.5} />
        </Button>
      </SheetTrigger>

      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>create new event</SheetTitle>
        </SheetHeader>

        <EventForm
          formVisible={createEventFormOpen}
          className='mt-4'
          onSubmit={createEvent}
          onClose={createEventFormControls.close}
        />
      </SheetContent>
    </Sheet>
  )
}
