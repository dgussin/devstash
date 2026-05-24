import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

try {
  process.loadEnvFile('.env.local')
} catch {
  // .env.local not present (CI, production, etc.)
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

// Fixed IDs so upsert is safe to run multiple times.
// NULL userId rows don't trigger the @@unique([userId, name]) constraint in Postgres.
const SYSTEM_TYPES = [
  { id: 'system_snippet', name: 'Snippet', icon: 'Code',       color: '#3b82f6' },
  { id: 'system_prompt',  name: 'Prompt',  icon: 'Sparkles',   color: '#8b5cf6' },
  { id: 'system_command', name: 'Command', icon: 'Terminal',   color: '#f97316' },
  { id: 'system_note',    name: 'Note',    icon: 'StickyNote', color: '#fde047' },
  { id: 'system_link',    name: 'Link',    icon: 'Link',       color: '#10b981' },
  { id: 'system_file',    name: 'File',    icon: 'File',       color: '#6b7280' },
  { id: 'system_image',   name: 'Image',   icon: 'Image',      color: '#ec4899' },
]

async function seed() {
  for (const type of SYSTEM_TYPES) {
    await prisma.itemType.upsert({
      where: { id: type.id },
      update: { name: type.name, icon: type.icon, color: type.color },
      create: { id: type.id, name: type.name, icon: type.icon, color: type.color, isSystem: true },
    })
  }
  console.log(`Seeded ${SYSTEM_TYPES.length} system item types.`)
}

seed()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
