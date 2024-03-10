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
    <div className='grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4'>
      {data?.map((event) => (
        <Card className='max-sm:p-2'>
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
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
