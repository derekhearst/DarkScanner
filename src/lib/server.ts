import { date } from 'drizzle-orm/mysql-core'

const storageFolder = process.env.APPDATA + '/darkscanner/'
const itemsFile = Bun.file(storageFolder + 'items.json')
const raritiesFile = Bun.file(storageFolder + 'rarities.json')
const enchantmentsFile = Bun.file(storageFolder + 'enchantments.json')
const fixesFile = Bun.file(storageFolder + 'fixes.json')

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
		`http://localhost:5173/api/item/${item.id}/price?rarity=${rarity.id}&enchantments=${enchantments.map((e) => e.id).join(',')}`,
		{
			method: 'GET',
		}
	)
	const price = await res.json()
	return price
}

async function getItems() {
	const file = Bun.file(storageFolder + 'items.json')
	if (!(await file.exists())) {
		const res = await fetch('http://localhost:5173/api/item', {
			method: 'GET',
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

export async function getRarities() {
	const file = Bun.file(storageFolder + 'rarities.json')
	if (!(await file.exists())) {
		const res = await fetch('http://localhost:5173/api/rarity', {
			method: 'GET',
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

export async function getEnchantments() {
	const file = Bun.file(storageFolder + 'enchantments.json')
	if (!(await file.exists())) {
		const res = await fetch('http://localhost:5173/api/enchantment', {
			method: 'GET',
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

export async function getFixes() {
	const file = Bun.file(storageFolder + 'fixes.json')
	if (!(await file.exists())) {
		const res = await fetch('http://localhost:5173/api/fix', {
			method: 'GET',
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

export const items = await getItems()
export const rarities = await getRarities()
export const enchantments = await getEnchantments()
export const fixes = await getFixes()
