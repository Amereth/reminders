import { LoaderCircleIcon } from 'lucide-react'

export const Loader = () => (
  <div className='grid h-full place-content-center'>
    <LoaderCircleIcon size={36} className='animate-spin' />
  </div>
)
