import { EventCard } from '@components/events/EventCard'
import { EventForm } from '@components/events/EventForm'
import { useDeleteEventMutation } from '@api/events/useDeleteEventMutation'
import { eventsQueryOptions, useEventsQuery } from '@api/events/useEventsQuery'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@ui/button'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useCreateEventMutation } from '@api/events/useCreateEventMutation'
import { queryClient } from '@/lib/query'

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
        className='rounded-full'
        onClick={() => setFormVisible((v) => !v)}
      >
        <PlusIcon />
      </Button>

      <EventForm
        formVisible={formVisible}
        className='mt-4'
        onSubmit={(data) => {
          createEvent(data)
          setFormVisible(false)
        }}
      />

      <div className='mt-4 grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        {data?.map((event) => (
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
  component: EventsList,
  loader: () => queryClient.ensureQueryData(eventsQueryOptions),
})
