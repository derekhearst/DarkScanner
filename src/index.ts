import { ocrImage } from './lib/ocr'
import { parseItemDetails } from './lib/parser'
import { captureItemDetails } from './lib/screenshot'
import './lib/mouse.worker'
import { prettifyData } from './lib/prettytext'
import { getMousePosition } from './lib/user32'
import { getItemPrice } from './lib/server'
export const DEBUG = true
const mouseWorker = new Worker(new URL('lib/mouse.worker.ts', import.meta.url).href)
mouseWorker.onmessage = async () => {
	const position = getMousePosition()
	const newImage = await captureItemDetails(position.x)
	const ocrText = await ocrImage(newImage)
	const data = parseItemDetails(ocrText)
	if (data.item && data.rarity && data.enchantments) {
		const itemPrice = await getItemPrice(data.item, data.rarity, data.enchantments)
		console.log(data.rarity, data.item, itemPrice)
	} else {
		console.log('Error parsing data')
	}
}
