import { rarities, slots, weapons } from './items'
export function parseMovementSpeed(allText: string) {
	const regex = /Move Speed:? -?(\d+)/i
	const numberRegex = /-?\d+/
	const textMatch = allText.match(regex)
	if (textMatch) {
		const numberMatch = textMatch[0].match(numberRegex)
		if (numberMatch) return parseInt(numberMatch[0], 10)
	}
}

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
	const armorRegex = new RegExp(slots.join('|'), 'i')
	const armorMatch = text.match(armorRegex)
	if (!armorMatch) return
	return armorMatch[0]
}

// export function parseDamage(allText: string) {
// 	let regex = /Weapon Damage (\d+)/i
// 	let numberRegex = /\d+/
// 	let textMatch = allText.match(regex)
// 	if (textMatch) {
// 		let numberMatch = textMatch[0].match(numberRegex)
// 		if (numberMatch) return parseInt(numberMatch[0])
// 	}
// }
