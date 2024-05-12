import { eventsQueryOptions, useEventsQuery } from '@api/events'
import { createFileRoute } from '@tanstack/react-router'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Loader } from '@/components/Loader'
import { EventList } from '@/components/events/event-list'
import { Controls } from '@/components/events/controls'
import { last } from 'remeda'

const EventsList = () => {
  const [parent] = useAutoAnimate()

  const {
    data: { pages },
    fetchNextPage,
    isFetching,
  } = useEventsQuery()

  return (
    <main ref={parent} className='flex grow flex-col pr-0 leading-none'>
      <Controls />

      <EventList
        events={pages.flatMap((p) => p.data)}
        fetchNextPage={last(pages)?.nextOffset ? fetchNextPage : undefined}
        isFetching={isFetching}
      />
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
