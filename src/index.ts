import { ocrImage } from './lib/ocr'
import { parseItemDetails } from './lib/parser'
import { captureItemDetails } from './lib/screenshot'
import { getMousePosition, waitForMiddleMouse } from './lib/user32'
import { getItemPrice, logFailure } from './lib/server'
export const DEBUG = true

while (true) {
	await waitForMiddleMouse()
	const position = getMousePosition()
	const newImage = await captureItemDetails(position.x)
	const ocrText = await ocrImage(newImage)
	const data = parseItemDetails(ocrText)
	if (data.item && data.rarity && data.enchantments) {
		const itemPrice = await getItemPrice(data.item, data.rarity, data.enchantments)
		console.log(data.rarity.name, data.item.name, itemPrice)
	} else {
		await logFailure(ocrText)
		console.error('Error parsing data', { ocrText })
	}
}
