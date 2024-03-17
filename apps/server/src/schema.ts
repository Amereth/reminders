export * from './features/events/events.schema'
export * from './features/users/users.schema'

import { events } from './features/events/events.schema'
import { users } from './features/users/users.schema'

export const schema = { events, users }
