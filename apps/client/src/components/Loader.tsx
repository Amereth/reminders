import { cn } from '@/lib/utils'
import { LoaderCircleIcon } from 'lucide-react'

type LoaderProps = {
  size?: number | string
  className?: string
}

export const Loader = ({ size = 36, className }: LoaderProps) => (
  <div className={cn('grid h-full place-content-center', className)}>
    <LoaderCircleIcon size={size} className='animate-spin' />
  </div>
)
