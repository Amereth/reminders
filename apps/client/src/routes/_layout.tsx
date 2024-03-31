import { PageHeader } from '@/components/page-header/PageHeader'
import { Button } from '@/components/ui/button'
import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { HomeIcon, ScrollIcon } from 'lucide-react'

const links = [
  {
    Icon: HomeIcon,
    name: 'home',
    to: '/',
  },
  {
    Icon: ScrollIcon,
    name: 'events',
    to: '/events',
  },
]

export const LayoutComponent = () => {
  return (
    <>
      <PageHeader />

      <main className='flex h-full gap-4 pl-0'>
        <nav className='flex max-w-[56px] flex-col overflow-hidden border-r-[1px] transition-all duration-500 hover:max-w-40'>
          <ul>
            {links.map(({ to, Icon, name }) => (
              <li key={to}>
                <Button variant='link'>
                  <Link to={to} className='flex items-end gap-4'>
                    <Icon strokeWidth={1.5} />
                    <span>{name}</span>
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
