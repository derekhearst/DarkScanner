import { ocrImage } from './lib/ocr'
import { parseItemDetails } from './lib/parser'
import { captureItemDetails } from './lib/screenshot'
import './lib/mouse.worker'
import { getMousePosition } from './lib/user32'
import { getItemPrice, logFailure } from './lib/server'
export const DEBUG = true
const mouseWorker = new Worker(new URL('lib/mouse.worker.ts', import.meta.url).href)
mouseWorker.onmessage = async () => {
	const position = getMousePosition()
	const newImage = await captureItemDetails(position.x)
	const ocrText = await ocrImage(newImage)
	const data = parseItemDetails(ocrText)
	if (data.item && data.rarity && data.enchantments) {
		const itemPrice = await getItemPrice(data.item, data.rarity, data.enchantments)
		console.log(data.rarity.name, data.item.name, itemPrice)
	} else {
		await logFailure(ocrText)
		console.log('Error parsing data', ocrText)
	}
}
