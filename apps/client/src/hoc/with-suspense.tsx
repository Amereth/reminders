import { ComponentType, Suspense } from 'react'
import { Loader } from '../components/Loader'

export const withSuspenseLoader =
  <T extends Record<string, unknown>>(Component: ComponentType<T>) =>
  (props: T) => (
    <Suspense fallback={<Loader />}>
      <Component {...(props as T)} />
    </Suspense>
  )
