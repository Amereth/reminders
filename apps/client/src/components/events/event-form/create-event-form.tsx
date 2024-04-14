import { useCreateEventMutation } from '@/hooks/api/events'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { EventForm } from './event-form'
import { Button } from '@/components/ui/button'

export const CreateEventForm = () => {
  const { mutate: createEvent } = useCreateEventMutation()

  const [formVisible, setFormVisible] = useState(false)

  return (
    <>
      <div className='shrink-0 pr-4'>
        <Button
          size='icon'
          variant='outline'
          onClick={() => setFormVisible((v) => !v)}
        >
          {formVisible ? (
            <MinusIcon strokeWidth={1.5} />
          ) : (
            <PlusIcon strokeWidth={1.5} />
          )}
        </Button>
      </div>

      <EventForm
        formVisible={formVisible}
        className='mt-4'
        onSubmit={createEvent}
        onClose={() => setFormVisible(false)}
      />
    </>
  )
}
