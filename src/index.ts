import { ocrImage } from './lib/ocr'
import { parseItemDetails } from './lib/parser'
import { captureItemDetails } from './lib/screenshot'
import './lib/mouse.worker'
import { prettifyData } from './lib/prettytext'
import { getMousePosition } from './lib/user32'
export const DEBUG = true
const mouseWorker = new Worker(new URL('lib/mouse.worker.ts', import.meta.url).href)
mouseWorker.onmessage = async (event) => {
	const position = getMousePosition()
	const newImage = await captureItemDetails(position.x, position.y)
	const ocrText = await ocrImage(newImage)
	const parsedData = parseItemDetails(ocrText)
	console.log(prettifyData(parsedData))
}
