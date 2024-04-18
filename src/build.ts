Bun.build({
	entrypoints: ['src/index.ts', 'src/mouse.worker.ts'],
	outdir: 'dist',
	target: 'bun',
})
