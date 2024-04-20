import { env } from 'bun'

const key = env.API_KEY

if (!key) throw new Error('No API key found')

await fetch('http://localhost:5173/api/import', {
	method: 'POST',
	headers: {
		'x-api-key': key,
	},
})
