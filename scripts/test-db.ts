import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

async function main() {
  console.log('Connecting to database...\n')

  // 1. Connection check
  await prisma.$queryRaw`SELECT 1`
  console.log('✓ Connected to Neon PostgreSQL\n')

  // 2. Verify system item types
  const systemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: 'asc' },
  })
  console.log(`✓ System item types (${systemTypes.length}):`)
  for (const t of systemTypes) {
    console.log(`  ${t.icon.padEnd(12)} ${t.name.padEnd(10)} ${t.color}`)
  }

  // 3. Count all tables
  console.log()
  const [users, items, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ])
  console.log('✓ Row counts:')
  console.log(`  users=${users}  items=${items}  collections=${collections}  tags=${tags}`)
}

main()
  .catch((e) => { console.error('✗ Database test failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
