import { enchantments, fixes, items, rarities, type Enchantment } from './server'

const DEBUG = false
export function parseItemDetails(text: string) {
	fixes.forEach((name) => (text = text.replaceAll(name.from, name.to)))

	const startParse = Date.now()
	const item = parseItem(text)
	const rarity = parseRarity(text)
	const enchantments = parseEnchantments(text)

	const data = {
		item,
		rarity,
		enchantments,
	}
	if (DEBUG) console.log('Parse Time:', Date.now() - startParse)
	return data
}
export type ParsedData = ReturnType<typeof parseItemDetails>

export function parseRarity(text: string) {
	const rarityRegex = new RegExp(rarities.map((r) => r.name).join('|'), 'i')
	const rarityMatch = text.match(rarityRegex)
	if (!rarityMatch) return
	const rarity = rarities.find((r) => r.name.toLocaleLowerCase() == rarityMatch[0].toLowerCase())
	return rarity
}

export function parseItem(text: string) {
	const itemRegex = new RegExp(items.map((i) => i.name).join('|'), 'i')
	const itemMatch = text.match(itemRegex)
	if (!itemMatch) return
	const item = items.find((i) => i.name.toLocaleLowerCase() == itemMatch[0].toLowerCase())
	return item
}

export function parseEnchantments(text: string) {
	const regex = new RegExp(enchantments.map((e) => e.name).join('|'), 'i')
	const matches = text.matchAll(regex)
	const matchArray = Array.from(matches)
	const foundEnchantments: Enchantment[] = []
	for (const match of matchArray) {
		const enchantment = enchantments.find((e) => e.name.toLocaleLowerCase() == match[0].toLowerCase())
		if (!enchantment) continue
		foundEnchantments.push(enchantment)
	}

	// #region old Code
	// const enchantmentRegex = new RegExp(
	// 	`(-+|\\++|~+)?\\d+%?(.\\d+%)? (${enchantments.map((e) => e.name).join('|')})`,
	// 	'ig'
	// )
	// const justNumberRegex = /(-|\+)?\d+%?(.\d+%)?/
	// const enchantmentMatches = text.matchAll(enchantmentRegex)
	// const allEnchantments = Array.from(enchantmentMatches, (match) => {
	// 	const number = match[0].match(justNumberRegex)
	// 	const name = match[0].match(justNameRegex)

	// 	if (!name) return
	// 	if (!number) return
	// 	const enchantment = enchantments.find((e) => e.name.toLocaleLowerCase() == name[0].toLowerCase())
	// 	return {
	// 		enchantment: enchantment,
	// 		value: parseFloat(number[0]),
	// 	}
	// })
	// #endregion
	return foundEnchantments
}

export function parsePrice(text: string) {
	const priceRegex = /\d+(,|\.)?\d+/
	const priceMatch = text.match(priceRegex)
	if (!priceMatch) return
	const priceWithoutCommas = priceMatch[0].replace(/,/g, '')
	return parseInt(priceWithoutCommas)
}
