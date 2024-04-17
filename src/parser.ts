import { armor, enchantments, questItems, rarities, slots, treasureRarities, treasures, weapons } from './constants'

export function parseAll(text: string) {
	const startParse = Date.now()
	const rarity = parseRarity(text)
	const weapon = parseWeapon(text)
	const damage = parseDamage(text)

	const armor = parseArmor(text)
	const armorRating = parseArmorRating(text)

	const treasure = parseTreasure(text)
	const treasureRarity = parseTreasureRarity(text)

	const questItem = parseQuestItems(text)

	const moveSpeed = parseMovementSpeed(text)
	const slot = parseSlot(text)
	const attributes = parseAttributes(text)
	const enchantments = parseEnchantments(text)

	const data = {
		weapon,
		armor,
		damage,
		moveSpeed,
		rarity,
		treasure,
		treasureRarity,
		questItem,
		slot,
		attributes,
		armorRating,
		enchantments,
	}
	console.log('Parse Time:', Date.now() - startParse)
	return data
}

export function parseRarity(text: string) {
	const rarityRegex = new RegExp(rarities.join('|'), 'i')
	const rarityMatch = text.match(rarityRegex)
	if (!rarityMatch) return
	return rarityMatch[0]
}

export function parseTreasureRarity(text: string) {
	const treasureRarityRegex = new RegExp(treasureRarities.join('|'), 'i')
	const treasureRarityMatch = text.match(treasureRarityRegex)
	if (!treasureRarityMatch) return
	return treasureRarityMatch[0]
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

export function parseSlot(text: string) {
	const slotRegex = new RegExp(slots.join('|'), '')
	const slotMatch = text.match(slotRegex)
	if (!slotMatch) return
	return slotMatch[0]
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

export function parseDamage(allText: string) {
	let regex = /Weapon Damage (\d+)/i
	let numberRegex = /\d+/
	let textMatch = allText.match(regex)
	if (textMatch) {
		let numberMatch = textMatch[0].match(numberRegex)
		if (numberMatch) return parseInt(numberMatch[0])
	}
}

export function parseMovementSpeed(allText: string) {
	const regex = /Move Speed:? -?(\d+)/i
	const numberRegex = /-?\d+/
	const textMatch = allText.match(regex)
	if (textMatch) {
		const numberMatch = textMatch[0].match(numberRegex)
		if (numberMatch) return parseInt(numberMatch[0], 10)
	}
}

export function parseAttributes(text: string) {
	const attributeRegex = new RegExp(`(${enchantments.join('|')}) \\d+`, 'ig')
	const justNumberRegex = /\d+/
	const justNameRegex = /([a-zA-Z ]+)/
	const attributeMatches = text.matchAll(attributeRegex)

	return Array.from(attributeMatches, (match) => {
		const number = match[0].match(justNumberRegex)
		const name = match[0].match(justNameRegex)
		return {
			name: name ? name[0].trim() : '',
			value: parseInt(number ? number[0] : '0'),
		}
	})
}

export function parseEnchantments(text: string) {
	const enchantmentRegex = new RegExp(`\\+?\\d+%? (${enchantments.join('|')})`, 'ig')
	const justNumberRegex = /\d+/
	const justNameRegex = /([a-zA-Z ]+)/
	const enchantmentMatches = text.matchAll(enchantmentRegex)
	return Array.from(enchantmentMatches, (match) => {
		const number = match[0].match(justNumberRegex)
		const name = match[0].match(justNameRegex)
		return {
			name: name ? name[0].trim() : '',
			value: parseInt(number ? number[0] : '0'),
		}
	})
}

export function parseArmorRating(text: string) {
	const armorRatingRegex = /Armor Rating (\d+)/i
	const armorRatingMatch = text.match(armorRatingRegex)
	if (armorRatingMatch) return parseInt(armorRatingMatch[1])
}
