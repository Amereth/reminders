import { PageHeader } from '@/components/page-header/PageHeader'
import { Button } from '@/components/ui/button'
import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { HomeIcon, ScrollIcon } from 'lucide-react'

const links = [
  {
    Icon: HomeIcon,
    to: '/',
  },
  {
    Icon: ScrollIcon,
    to: '/events',
  },
]

export const LayoutComponent = () => {
  return (
    <>
      <PageHeader />

      <main className='flex h-full gap-4'>
        <nav className='flex flex-col border-r-[1px]'>
          <ul>
            {links.map(({ to, Icon }) => (
              <li>
                <Button
                  variant='link'
                  className='hover:text-primary text-slate-300'
                >
                  <Link to={to}>
                    <Icon />
                  </Link>
                </Button>
              </li>
            ))}
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
