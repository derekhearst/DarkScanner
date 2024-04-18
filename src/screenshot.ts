import { Screenshots } from 'node-screenshots'
import { readdir, rm } from 'node:fs/promises'
import { DEBUG } from '.'

const capturer = Screenshots.fromPoint(0, 0)

export async function captureImage() {
	const startTime = Date.now()
	const image = await capturer?.capture()
	if (!image) throw new Error('Failed to capture image')
	const timeToString = new Date().getTime().toString()
	const imageName = timeToString + '.png'
	const path = 'captures/' + imageName
	await Bun.write(path, image)
	console.log('Image saved to:', path, 'Time:', Date.now() - startTime)
	deleteOtherCaptures(imageName)
	return path
}

export async function captureImageAroundCursor(x: number, y: number) {
	const startTime = Date.now()
	if (!capturer) throw new Error('Failed to create capturer')

	const screenHeight = capturer.height

	const height = screenHeight
	const width = 800

	const xPos = x - width / 2
	if (DEBUG) console.log('Capturing area:', xPos, 0, width, height)

	const capturedImage = await capturer?.captureArea(xPos, 0, width, height)
	if (!capturedImage) throw new Error('Failed to capture image')
	const timeToString = new Date().getTime().toString()
	const imageName = 'test' + '.png'
	const path = 'captures/' + imageName
	await Bun.write(path, capturedImage)
	if (DEBUG) console.log('Image saved to:', path, 'Time:', Date.now() - startTime)

	deleteOtherCaptures(imageName)
	return path
}

async function deleteOtherCaptures(fileToKeep: string) {
	const files = await readdir('captures')
	if (DEBUG) console.log('Deleting', files.length, 'captures')
	for (const file of files) {
		if (file !== fileToKeep) {
			await rm('captures/' + file)
		}
	}
}
