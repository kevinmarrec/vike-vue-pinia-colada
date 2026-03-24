import type { KnipConfig } from 'knip'

export default {
  entry: [
    '*.config.ts',
    'src/integration/*.ts',
  ],
} satisfies KnipConfig
