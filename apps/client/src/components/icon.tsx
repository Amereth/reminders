import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

type IconProps = {
  className?: string
  icon: LucideIcon
}

export const Icon = ({ icon: IconComponent, className }: IconProps) => {
  return (
    <>
      <IconComponent
        size={20}
        strokeWidth={1.5}
        className={cn(className, 'sm:hidden')}
      />

      <IconComponent
        size={24}
        strokeWidth={1.5}
        className={cn(className, 'max-sm:hidden')}
      />
    </>
  )
}
