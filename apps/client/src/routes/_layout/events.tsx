import { eventsQueryOptions, useEventsQuery } from '@api/events'
import { createFileRoute } from '@tanstack/react-router'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Loader } from '@/components/Loader'
import { EventList } from '@/components/events/event-list'
import { Controls } from '@/components/events/controls'

const EventsList = () => {
  const [parent] = useAutoAnimate()

  const {
    data: { pages },
  } = useEventsQuery()

  return (
    <main ref={parent} className='grow pr-0 leading-none'>
      <Controls />

      <EventList events={pages.flatMap((p) => p.data)} />
    </main>
  )
}

export const Route = createFileRoute('/_layout/events')({
  pendingComponent: Loader,
  component: EventsList,
  loader: async ({ context }) => {
    const { queryClient } = context

    const data =
      queryClient.getQueryData(eventsQueryOptions().queryKey) ??
      (await queryClient.fetchInfiniteQuery(eventsQueryOptions()))

    return { data }
  },
})
