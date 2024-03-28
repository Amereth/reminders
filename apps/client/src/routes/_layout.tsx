import { PageHeader } from '@/components/page-header/PageHeader'
import { Button } from '@/components/ui/button'
import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const LayoutComponent = () => {
  return (
    <>
      <PageHeader />

      <main className='flex h-full gap-4'>
        <nav className='flex flex-col border-r-[1px]'>
          <ul>
            <li>
              <Button variant='link' className='text-slate-300'>
                <Link to='/events'>events</Link>
              </Button>
            </li>
          </ul>
        </nav>

        <div className='grow'>
          <Outlet />
        </div>
      </main>
    </>
  )
}

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
  beforeLoad: ({ context }) => {
    if (!context.session) throw redirect({ to: '/login' })
  },
})
