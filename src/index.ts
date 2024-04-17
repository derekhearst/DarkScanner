import { ocrImage } from './ocr'
import { parseAll } from './parser'
import { captureImage, captureImageAroundCursor } from './screenshot'

const mouseWorker = new Worker(new URL('mouse.worker.ts', import.meta.url).href)
mouseWorker.onmessage = async (event) => {
	const data = event.data as { x: number; y: number }
	const newImage = await captureImage()
	const ocrText = await ocrImage(newImage)
	const parsedData = parseAll(ocrText)
	console.log(parsedData)
}
