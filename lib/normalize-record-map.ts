import { type ExtendedRecordMap } from 'notion-types'

// notion-client 7.7.3 sometimes returns records double-wrapped as
// `{ value: { value: block } }` instead of `{ value: block }`. Flatten that so
// downstream consumers (react-notion-x, notion-utils, getAllPagesInSpace) see
// the expected shape.
export function normalizeRecordMap(
  recordMap: ExtendedRecordMap
): ExtendedRecordMap {
  const tables = [
    'block',
    'collection',
    'collection_view',
    'notion_user',
    'space'
  ] as const

  for (const table of tables) {
    const records = (recordMap as any)[table]
    if (!records) continue
    for (const id of Object.keys(records)) {
      const entry = records[id]
      if (entry?.value?.value && typeof entry.value.value === 'object') {
        records[id] = { ...entry, value: entry.value.value }
      }
    }
  }

  return recordMap
}
