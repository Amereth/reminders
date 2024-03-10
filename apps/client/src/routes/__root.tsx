import { PageHeader } from '@/components/page-header/PageHeader'
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { useEventsApi } from '@/hooks/api/useEventsApi'
import { createRootRoute } from '@tanstack/react-router'

const RootComponent = () => {
  const { data } = useEventsApi()

  return (
    <>
      <PageHeader />

      <main className='grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4'>
        {data?.map((event) => (
          <Card className='max-sm:p-2' key={event.id}>
            <CardHeader>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{event.description}</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        ))}
      </main>
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
