import { EventCard, EventForm } from '@components/events'
import {
  eventsQueryOptions,
  useEventsQuery,
  useDeleteEventMutation,
  useCreateEventMutation,
} from '@api/events'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@ui/button'
import { PlusIcon, MinusIcon } from 'lucide-react'
import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Loader } from '@/components/Loader'

const EventsList = () => {
  const { data } = useEventsQuery()

  const { mutate: createEvent } = useCreateEventMutation()
  const { mutate: deleteEvent } = useDeleteEventMutation()

  const [formVisible, setFormVisible] = useState(false)

  const [parent] = useAutoAnimate()

  return (
    <main ref={parent} className='flex grow flex-col pr-0'>
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

      <div className='mt-4 grid min-h-0 grow auto-rows-min grid-cols-1 gap-4 overflow-auto pb-4 pr-4 lg:grid-cols-2 xl:grid-cols-3'>
        {data.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={() => deleteEvent(event.id)}
          />
        ))}
      </div>
    </main>
  )
}

export const Route = createFileRoute('/_layout/events')({
  pendingComponent: Loader,
  component: EventsList,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(eventsQueryOptions()),
})
