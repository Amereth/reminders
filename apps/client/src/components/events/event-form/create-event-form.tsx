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
import { Icon } from '@/components/icon'

type CreateEventFormProps = {
  triggerClassName?: string
}

export const CreateEventForm = ({ triggerClassName }: CreateEventFormProps) => {
  const { mutateAsync: createEvent } = useCreateEventMutation()
  const { isCreateEventFormOpen } = useControlsSnapshot()

  return (
    <Sheet
      open={isCreateEventFormOpen}
      onOpenChange={createEventFormControls.toggle}
    >
      <SheetTrigger className={triggerClassName} asChild>
        <Button size='icon' variant='outline'>
          <Icon icon={PlusIcon} />
        </Button>
      </SheetTrigger>

      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>create new event</SheetTitle>
        </SheetHeader>

        <EventForm
          formVisible={isCreateEventFormOpen}
          className='mt-4'
          onSubmit={createEvent}
          onClose={createEventFormControls.close}
        />
      </SheetContent>
    </Sheet>
  )
}
