import { Screenshots } from 'node-screenshots'
import sharp from 'sharp'
const DEBUG = false

export async function captureItemDetails(x: number) {
	let capturer = Screenshots.fromPoint(0, 0)

	const startTime = Date.now()
	if (!capturer) throw new Error('Failed to create capturer')

	const screenHeight = capturer.height
	const screenWidth = capturer.width

	// Params to change
	const height = screenHeight
	const yPos = capturer.y
	let width = 400
	let xPos = x + 20
	if (xPos + width > screenWidth) {
		xPos = screenWidth - width
		width *= 2
	}

	if (DEBUG) console.log('Capturing area:', xPos, yPos, width, height)
	const capturedImage = await capturer?.captureArea(xPos, yPos, width, height)
	if (!capturedImage) throw new Error('Failed to capture image')
	const imageName = 'item' + '.png'
	const path = 'captures/' + imageName
	await Bun.write(path, capturedImage)
	if (DEBUG) {
		console.log('Image saved to:', path, 'Time:', Date.now() - startTime)
	}

	capturer = null
	return path
}

export async function capturePrice(x: number, y: number) {
	const startTime = Date.now()
	let capturer = Screenshots.fromPoint(0, 0)

	// Params to change
	const height = 40
	const width = 130

	const xPos = x
	const yPos = y - 20

	if (DEBUG) console.log('Capturing area:', xPos, yPos, width, height)
	const capturedImage = await capturer?.captureArea(xPos, yPos, width, height)
	const captureSize = await sharp(capturedImage).metadata()
	const captureWidth = captureSize?.width
	if (!captureWidth) throw new Error('Failed to get capture width')
	const duplicatedImage = await sharp(capturedImage)
		.extend({ top: 0, bottom: 0, left: captureWidth * 5, right: captureWidth * 5 })
		.composite([
			{ input: capturedImage, top: 0, left: captureWidth },
			{ input: capturedImage, top: 0, left: captureWidth * 2 },
			{ input: capturedImage, top: 0, left: captureWidth * 3 },
			{ input: capturedImage, top: 0, left: captureWidth * 4 },
		])
		.toBuffer()

	if (!duplicatedImage) throw new Error('Failed to extend image')
	const imageName = 'price' + '.png'
	const path = 'captures/' + imageName
	await Bun.write(path, duplicatedImage)
	if (DEBUG) {
		console.log('Image saved to:', path, 'Time:', Date.now() - startTime)
	}
	capturer = null
	return path
}
