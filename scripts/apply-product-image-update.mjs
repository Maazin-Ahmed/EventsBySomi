// Apply through Supabase's authenticated management API when this network
// cannot reach the database's IPv6 endpoint. The change and migration receipt
// commit atomically; no credentials are accepted as command-line arguments.
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const version = process.argv.find(argument => argument.startsWith('--migration-version='))?.split('=')[1] || '20261112000002'
if (!/^\d{14}$/.test(version) || version < '20261112000002') throw new Error('Invalid image migration version.')
const manifest = JSON.parse(await fs.readFile(path.join(root, 'scripts/product-storage-manifest.json'), 'utf8'))
const evidence = JSON.parse(await fs.readFile(path.join(root, 'docs/phase5.1.1-evidence/storage-verification.json'), 'utf8'))
for (const item of manifest) for (const type of ['image', 'thumbnail']) {
  if (!evidence.objects.some(object => object.id === item.id && object.type === type && object.sha256 === item[type].sha256 && object.status === 200)) throw new Error('Missing CDN verification for ' + item.id)
}
const migration = await fs.readFile(path.join(root, `supabase/migrations/${version}_product_storage_images.sql`), 'utf8')
if (!process.argv.includes('--apply')) {
  console.log(`Verified migration preflight: ${manifest.length} products, ${evidence.objects.length} verified objects. Pass --apply to update only image metadata.`)
  process.exit(0)
}
const receipt = `INSERT INTO supabase_migrations.schema_migrations(version,name,statements) VALUES ('${version}','product_storage_images',ARRAY[$phase511$${migration}$phase511$]) ON CONFLICT (version) DO NOTHING;\n`
const sql = migration.replace(/COMMIT;\s*$/, receipt + 'COMMIT;\n')
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'somia-image-update-'))
const filename = path.join(temporary, 'apply.sql')
await fs.writeFile(filename, sql, { mode: 0o600 })
try {
  const result = execFileSync('npx', ['--yes', 'supabase', 'db', 'query', '--remote=xuiohhowgpfesakxikvo', '--file', filename, '--yes'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  console.log(result)
  console.log(`Applied product image metadata and recorded migration ${version} atomically.`)
} catch (error) { throw new Error('Product image migration failed: ' + (error.stderr?.toString() || error.message)) }
finally { await fs.rm(temporary, { recursive: true, force: true }) }
