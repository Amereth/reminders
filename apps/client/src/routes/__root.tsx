import { PageHeader } from '@/components/page-header/PageHeader'
import { useEventsQuery } from '@/hooks/api/useEventsQuery'
import { createRootRoute } from '@tanstack/react-router'
import { EventCard } from '@/components/events/EventCard'

const RootComponent = () => {
  const { data } = useEventsQuery()

  return (
    <>
      <PageHeader />

      <main className='grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {data?.map((event) => <EventCard key={event.id} event={event} />)}
      </main>
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
