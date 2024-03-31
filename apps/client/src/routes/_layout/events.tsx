import { EventCard, EventForm } from '@components/events'
import {
  eventsQueryOptions,
  useEventsQuery,
  useDeleteEventMutation,
  useCreateEventMutation,
} from '@api/events'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@ui/button'
import { PlusIcon } from 'lucide-react'
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
    <div ref={parent}>
      <Button
        size='icon'
        variant='outline'
        onClick={() => setFormVisible((v) => !v)}
      >
        <PlusIcon strokeWidth={1.5} />
      </Button>

      <EventForm
        formVisible={formVisible}
        className='mt-4'
        onSubmit={(data) => {
          createEvent(data)
          setFormVisible(false)
        }}
      />

      <div className='mt-2 grid auto-rows-min grid-cols-1 gap-2 md:mt-4 md:gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        {data.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={() => deleteEvent(event.id)}
          />
        ))}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_layout/events')({
  pendingComponent: Loader,
  component: EventsList,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(eventsQueryOptions),
})
