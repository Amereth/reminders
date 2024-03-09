import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from '@/src/lib/db'

const migrateDB = async () => {
  console.log('migration started')

  await migrate(db, { migrationsFolder: 'migrations' })

  console.log('migration finished')

  process.exit(0)
}

migrateDB()
