import { createFileRoute } from '@tanstack/react-router'

const HomeComponent = () => {
  return <div> welcome page </div>
}

export const Route = createFileRoute('/')({
  component: HomeComponent,
})
