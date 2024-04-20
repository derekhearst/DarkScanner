import type { ParsedData } from './parser'

export function prettifyData(data: ParsedData) {
	if (data.item) {
		return `${data.rarity?.name} ${data.item.name} ${data.enchantments.map((e) => e.name).join(' ')}`
	}
}
