import { createFileRoute } from '@tanstack/react-router'

const HomeComponent = () => {
  return <main> welcome page test </main>
}

export const Route = createFileRoute('/_layout/')({
  component: HomeComponent,
})
