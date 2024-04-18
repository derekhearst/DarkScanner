import { ocrImage } from './ocr'
import { parseAll } from './parser'
import { captureImageAroundCursor } from './screenshot'
import './mouse.worker'
import { prettifyData } from './prettytext'
export const DEBUG = false
const mouseWorker = new Worker(new URL('mouse.worker.ts', import.meta.url).href)
mouseWorker.onmessage = async (event) => {
	const data = event.data as { x: number; y: number }
	const newImage = await captureImageAroundCursor(data.x, data.y)
	const ocrText = await ocrImage(newImage)
	const parsedData = parseAll(ocrText)
	console.log(prettifyData(parsedData))
}
