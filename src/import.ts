import { env } from 'bun'

const key = env.API_KEY

if (!key) throw new Error('No API key found')

await fetch('https://darkscanner.dev/api/import', {
	method: 'POST',
	headers: {
		'x-api-key': key,
	},
})
