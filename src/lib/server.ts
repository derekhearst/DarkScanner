const storageFolder = process.env.APPDATA + '/darkscanner/'

export type Fix = {
	id: number
	from: string
	to: string
}

export type Item = {
	id: number
	name: string
}

export type Rarity = {
	id: number
	name: string
}

export type Enchantment = {
	id: number
	name: string
}

export async function getItemPrice(item: Item, rarity: Rarity, enchantments: Enchantment[]) {
	const res = await fetch(
		`https://darkscanner.dev/api/item/${item.id}/price?rarity=${rarity.id}&enchantments=${enchantments.map((e) => e.id).join(',')}`,
		{
			method: 'GET',
			headers: {
				Authorization: 'Basic ' + token,
			},
		}
	)
	const price = await res.json()
	return price
}

export async function logFailure(text: string) {
	const res = await fetch('https://darkscanner.dev/api/failure', {
		method: 'POST',
		body: text,
		headers: {
			Authorization: 'Basic ' + token,
		},
	})
	return res
}

async function getItems(token: string) {
	const file = Bun.file(storageFolder + 'items.json')
	if (!(await file.exists())) {
		const res = await fetch('https://darkscanner.dev/api/item', {
			method: 'GET',
			headers: {
				Authorization: 'Basic ' + token,
			},
		})
		const items = (await res.json()) as Item[]
		const data = {
			date: Date.now(),
			items: items,
		}
		Bun.write(file, JSON.stringify(data))
		return items
	}
	const data = await file.json()
	return data.items as Item[]
}

export async function getRarities(token: string) {
	const file = Bun.file(storageFolder + 'rarities.json')
	if (!(await file.exists())) {
		const res = await fetch('https://darkscanner.dev/api/rarity', {
			method: 'GET',
			headers: {
				Authorization: 'Basic ' + token,
			},
		})
		const rarities = (await res.json()) as Rarity[]
		const data = {
			date: Date.now(),
			rarities: rarities,
		}
		Bun.write(file, JSON.stringify(data))
		return rarities
	}
	const data = await file.json()

	return data.rarities as Rarity[]
}

export async function getEnchantments(token: string) {
	const file = Bun.file(storageFolder + 'enchantments.json')
	if (!(await file.exists())) {
		const res = await fetch('https://darkscanner.dev/api/enchantment', {
			method: 'GET',
			headers: {
				Authorization: 'Basic ' + token,
			},
		})
		const enchantments = (await res.json()) as Enchantment[]
		const data = {
			date: Date.now(),
			enchantments: enchantments,
		}
		Bun.write(file, JSON.stringify(data))
		return enchantments
	}
	const data = await file.json()
	return data.enchantments as Enchantment[]
}

export async function getFixes(token: string) {
	const file = Bun.file(storageFolder + 'fixes.json')
	if (!(await file.exists())) {
		const res = await fetch('https://darkscanner.dev/api/fix', {
			method: 'GET',
			headers: {
				Authorization: 'Basic ' + token,
			},
		})
		const fixes = (await res.json()) as Fix[]
		const data = {
			date: Date.now(),
			fixes: fixes,
		}
		Bun.write(file, JSON.stringify(data))
		return fixes
	}
	const data = await file.json()
	return data.fixes as Fix[]
}

export async function getToken() {
	const file = Bun.file(storageFolder + 'token.json')
	if (!(await file.exists())) {
		const res = await fetch('https://darkscanner.dev/api/token', {
			method: 'GET',
		})
		const token = await res.text()
		const data = {
			date: Date.now(),
			Authorization: 'Basic ' + token,
		}
		console.log(token)
		Bun.write(file, JSON.stringify(data))
		return token
	}
	const data = await file.json()
	return data.token as string
}
const token = await getToken()
console.log(token)

export const items = await getItems(token)
export const rarities = await getRarities(token)
export const enchantments = await getEnchantments(token)
export const fixes = await getFixes(token)
