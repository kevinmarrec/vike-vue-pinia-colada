import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/+config.ts',
    'src/integration/+onCreateApp.ts',
    'src/integration/+onAfterRenderHtml.ts',
    'src/integration/+onCreatePageContext.ts',
  ],
  unbundle: true,
  dts: true,
})
