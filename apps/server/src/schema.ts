export * from './features/events/schema'
export * from './features/users/schema'

import { events } from './features/events/schema'
import { users } from './features/users/schema'

export const schema = { events, users }
