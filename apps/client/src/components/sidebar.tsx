import { GlobalLoadingIndicator } from '@/components/global-loading-indicator'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { HomeIcon, LucideIcon, ScrollIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/icon'

type SidebarLink = {
  icon: LucideIcon
  name: string
  to: string
}

const links: SidebarLink[] = [
  {
    icon: HomeIcon,
    name: 'home',
    to: '/',
  },
  {
    icon: ScrollIcon,
    name: 'events',
    to: '/events',
  },
]

export const Sidebar = () => {
  return (
    <aside className='flex max-w-[56px] flex-col overflow-hidden border-r-[1px] pb-2 transition-all duration-500 hover:max-w-40 max-sm:max-w-[48px]'>
      <nav>
        <ul>
          {links.map(({ to, icon, name }) => (
            <li key={to}>
              <Button variant='link'>
                <Link to={to} className='flex items-end gap-4'>
                  <Icon icon={icon} />
                  <span>{name}</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        className='mt-auto'
        initial={{ width: '0px', height: '0px' }}
        animate={{ width: '36px', height: '36px' }}
      >
        <div className='mt-auto'>
          <GlobalLoadingIndicator />
        </div>
      </motion.div>
    </aside>
  )
}
