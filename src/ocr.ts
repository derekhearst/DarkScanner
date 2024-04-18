import { $ } from 'bun'
import { DEBUG } from '.'
const tesseract = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

export async function ocrImage(image: string) {
	const startOcr = Date.now()
	const text = await $`${tesseract} ${image} stdout`.text()
	if (DEBUG) console.log('OCR Time:', Date.now() - startOcr)
	return text
}
