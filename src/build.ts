Bun.build({
	entrypoints: ['src/index.ts', 'src/marketplace.ts', 'src/lib/mouse.worker.ts'],
	outdir: 'dist',
	target: 'bun',
})
