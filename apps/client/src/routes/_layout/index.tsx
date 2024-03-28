import { createFileRoute } from '@tanstack/react-router'

const HomeComponent = () => {
  return <div> welcome page test </div>
}

export const Route = createFileRoute('/_layout/')({
  component: HomeComponent,
})
