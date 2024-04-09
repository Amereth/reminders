import { useIsFetching } from '@tanstack/react-query'
import { Loader } from './Loader'

export function GlobalLoadingIndicator() {
  const isFetching = useIsFetching()

  return isFetching ? <Loader size={24} /> : null
}
