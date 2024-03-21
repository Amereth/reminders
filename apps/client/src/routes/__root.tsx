import { PageHeader } from '@/components/page-header/PageHeader'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  redirect,
} from '@tanstack/react-router'
import { RouterContext } from '@/App'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Button } from '@/components/ui/button'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { isNull } from '@/utils/isNull'
import { useSupabase } from '@/hooks/useSupabase'
import { isUndefined } from '@/utils/isUndefined'
import { LoaderCircleIcon } from 'lucide-react'

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
  beforeLoad: ({ context, location }) => {
    if (isNull(context.session)) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})
