import { cn } from '@/lib/utils'

type DividerProps = {
  position: 'vertical' | 'horizontal'
  className?: string
}

export const Divider = ({ position, className }: DividerProps) => {
  return (
    <div
      className={cn(
        'bg-border',
        {
          'h-[1px] w-full': position === 'horizontal',
          'w-[1px]': position === 'vertical',
        },
        className,
      )}
    />
  )
}
