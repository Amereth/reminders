import { useSupabase } from '@hooks/useSupabase'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { isUndefined } from '@utils/isUndefined'
import { LoaderCircleIcon } from 'lucide-react'
import { RouterContext } from 'src/App'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from '@ui/button'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const RootComponent = () => {
  const { session } = useSupabase()

  if (isUndefined(session))
    return (
      <div className='grid h-full place-content-center'>
        <LoaderCircleIcon size={50} className='animate-spin' />
      </div>
    )

  return (
    <>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <div>
                There was an error!{' '}
                <Button onClick={() => resetErrorBoundary()}>Try again</Button>
                <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
              </div>
            )}
            onReset={reset}
          >
            <Outlet />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <TanStackRouterDevtools position='bottom-left' />
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent() {
    return <div>Not found on root</div>
  },
})
