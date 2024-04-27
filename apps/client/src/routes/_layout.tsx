import { PageHeader } from '@/components/page-header/PageHeader'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Sidebar } from '@/components/sidebar'

export const LayoutComponent = () => {
  return (
    <>
      <PageHeader />

      <div className='mt-4 flex grow items-stretch overflow-hidden pl-0'>
        <Sidebar />

        <Outlet />
      </div>
    </>
  )
}

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
  beforeLoad: ({ context }) => {
    if (!context.session) throw redirect({ to: '/login' })
  },
})
