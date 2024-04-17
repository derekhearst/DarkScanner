import { Screenshots } from 'node-screenshots'
import { readdir, rm } from 'node:fs/promises'

const captureer = Screenshots.fromPoint(0, 0)

export async function captureImage() {
	const startTime = Date.now()
	const image = await captureer?.capture()
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
	const allScreens = Screenshots.all()
	const screenToUse = allScreens.find((screen) => {
		return screen.x <= x && x <= screen.x + screen.width && screen.y <= y && y <= screen.y + screen.height
	})
	if (!screenToUse) throw new Error('Failed to find screen')
	console.log(screenToUse.x, screenToUse.y, screenToUse.width, screenToUse.height)

	const size = 200
	const xPos = x - size / 2
	const yPos = y - size / 2
	console.log('Capturing area:', x, y, size, size)
	const capturedImage = await screenToUse?.captureArea(xPos, yPos, size, size)
	if (!capturedImage) throw new Error('Failed to capture image')
	const timeToString = new Date().getTime().toString()
	const imageName = timeToString + '.png'
	const path = 'captures/' + imageName
	await Bun.write(path, capturedImage)
	console.log('Image saved to:', path, 'Time:', Date.now() - startTime)
	deleteOtherCaptures(imageName)
	return path
}

async function deleteOtherCaptures(fileToKeep: string) {
	const files = await readdir('captures')
	console.log('Deleting', files.length, 'captures')
	for (const file of files) {
		if (file !== fileToKeep) {
			await rm('captures/' + file)
		}
	}
}
