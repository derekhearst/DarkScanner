import { DEBUG } from '.'
import { accessories, armor, enchantments, items, questItems, rarities, slots, treasures, weapons } from './constants'

export function parseAll(text: string) {
	const startParse = Date.now()
	const weapon = parseWeapon(text)
	const armor = parseArmor(text)
	const accessory = parseAccessory(text)
	const item = parseItem(text)
	const treasure = parseTreasure(text)
	const questItem = parseQuestItems(text)

	const rarity = parseRarity(text)
	const slot = parseSlot(text)
	const attributes = parseAttributes(text)
	const enchantments = parseEnchantments(text)

	const data = {
		weapon,
		armor,
		accessory,
		item,
		treasure,
		questItem,
		rarity,
		slot,
		attributes,
		enchantments,
	}
	if (DEBUG) console.log('Parse Time:', Date.now() - startParse)
	return data
}
export type ParsedData = ReturnType<typeof parseAll>

export function parseRarity(text: string) {
	const rarityRegex = new RegExp(rarities.join('|'), 'i')
	const rarityMatch = text.match(rarityRegex)
	if (!rarityMatch) return
	return rarityMatch[0]
}

export function parseWeapon(text: string) {
	const weaponRegex = new RegExp(weapons.join('|'), 'i')
	const weaponMatch = text.match(weaponRegex)
	if (!weaponMatch) return
	return weaponMatch[0]
}

export function parseArmor(text: string) {
	const armorRegex = new RegExp(armor.join('|'), 'i')
	const armorMatch = text.match(armorRegex)
	if (!armorMatch) return
	return armorMatch[0]
}
export function parseAccessory(text: string) {
	const accessoryRegex = new RegExp(accessories.join('|'), 'i')
	const accessoryMatch = text.match(accessoryRegex)
	if (!accessoryMatch) return
	return accessoryMatch[0]
}

export function parseItem(text: string) {
	const itemRegex = new RegExp(items.join('|'), 'i')
	const itemMatch = text.match(itemRegex)
	if (!itemMatch) return
	return itemMatch[0]
}

export function parseTreasure(text: string) {
	const items = treasures.map((item) => item.name)
	const treasureRegex = new RegExp(items.join('|'), 'i')
	const treasureMatch = text.match(treasureRegex)
	if (!treasureMatch) return
	return treasures.find((treasure) => treasure.name === treasureMatch[0])
}

export function parseQuestItems(text: string) {
	const items = questItems.map((item) => item.name)
	const questItemRegex = new RegExp(items.join('|'), 'i')
	const questItemMatch = text.match(questItemRegex)
	if (!questItemMatch) return
	return questItems.find((item) => item.name === questItemMatch[0])
}

export function parseSlot(text: string) {
	const slotRegex = new RegExp(slots.join('|'), '')
	const slotMatch = text.match(slotRegex)
	if (!slotMatch) return
	return slotMatch[0]
}

export function parseAttributes(text: string) {
	const attributeRegex = new RegExp(`(${enchantments.join('|')}) (-|\\+)?\\d+%?(.\\d+%)?`, 'ig')
	const justNumberRegex = /(-|\+)?\d+%?(.\d+%)?/
	const justNameRegex = /([a-zA-Z ]+)/
	const attributeMatches = text.matchAll(attributeRegex)

	return Array.from(attributeMatches, (match) => {
		const number = match[0].match(justNumberRegex)
		const name = match[0].match(justNameRegex)
		return {
			name: name ? name[0].trim() : '',
			value: parseFloat(number ? number[0] : '0'),
		}
	})
}

export function parseEnchantments(text: string) {
	const enchantmentRegex = new RegExp(`(-|\\+)?\\d+%?(.\\d+%)? (${enchantments.join('|')})`, 'ig')
	const justNumberRegex = /(-|\+)?\d+%?(.\d+%)?/
	const justNameRegex = /([a-zA-Z ]+)/
	const enchantmentMatches = text.matchAll(enchantmentRegex)
	return Array.from(enchantmentMatches, (match) => {
		const number = match[0].match(justNumberRegex)
		const name = match[0].match(justNameRegex)
		return {
			name: name ? name[0].trim() : '',
			value: parseFloat(number ? number[0] : '0'),
		}
	})
}
