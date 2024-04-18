import { Screenshots } from 'node-screenshots'
import { readdir, rm } from 'node:fs/promises'
import { DEBUG } from '.'

const capturer = Screenshots.fromPoint(0, 0)

export async function captureImage(x: number, y: number) {
	const startTime = Date.now()
	if (!capturer) throw new Error('Failed to create capturer')

	const screenHeight = capturer.height
	const screenWidth = capturer.width

	// Params to change
	let height = 800
	let width = 400

	let yPos = y + 20
	let xPos = x + 20
	if (xPos + width > screenWidth) {
		xPos = screenWidth - width
		width *= 2
	}
	if (yPos * 2 > screenHeight) {
		yPos = 0
		height = screenHeight
	}

	if (DEBUG) console.log('Capturing area:', xPos, yPos, width, height)
	const capturedImage = await capturer?.captureArea(xPos, yPos, width, height)
	if (!capturedImage) throw new Error('Failed to capture image')
	const imageName = 'temp' + '.png'
	const path = 'captures/' + imageName
	await Bun.write(path, capturedImage)
	if (DEBUG) console.log('Image saved to:', path, 'Time:', Date.now() - startTime)
	return path
}
