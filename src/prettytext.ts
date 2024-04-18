import { rarities } from './constants'
import type { ParsedData } from './parser'

export function prettifyData(data: ParsedData) {
	if (data.weapon) {
		return `${data.rarity} ${data.weapon} : ${data.attributes.length} attributes, ${data.enchantments.length} enchantments`
	}
	if (data.armor) {
		return `${data.rarity} ${data.armor} : ${data.attributes.length} attributes, ${data.enchantments.length} enchantments`
	}
	if (data.accessory) {
		return `${data.rarity} ${data.accessory} : ${data.attributes.length} attributes, ${data.enchantments.length} enchantments`
	}
	if (data.item) {
		return `${data.rarity} ${data.item} `
	}
	if (data.treasure && data.rarity) {
		const rarityIndex = rarities.indexOf(data.rarity)
		const value = data.treasure.values[rarityIndex]
		const pps = value / data.treasure.size
		return `${data.rarity} ${data.treasure.name} : ${value} value, ${pps.toFixed(2)} pps`
	}
	if (data.questItem) {
		const pps = data.questItem.price / data.questItem.size
		return `${data.questItem.rarity} ${data.questItem} : ${data.questItem.price} value, ${pps.toFixed(2)} pps`
	}
}
