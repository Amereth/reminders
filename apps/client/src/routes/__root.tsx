import { PageHeader } from '@/components/page-header/PageHeader'
import { useEventsQuery } from '@/hooks/api/events/useEventsQuery'
import { createRootRoute } from '@tanstack/react-router'
import { EventCard } from '@/components/events/EventCard'
import { useDeleteEventMutation } from '@/hooks/api/events/useDeleteEventMutation'

const RootComponent = () => {
  const { data } = useEventsQuery()
  const { mutate } = useDeleteEventMutation()

  return (
    <>
      <PageHeader />

      <main className='grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {data?.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={() => mutate(event.id)}
          />
        ))}
      </main>
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
