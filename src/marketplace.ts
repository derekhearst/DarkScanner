import { env } from 'bun'
import { ocrImage } from './lib/ocr'
import { parseItemDetails, parsePrice } from './lib/parser'
import { captureItemDetails, capturePrice } from './lib/screenshot'
import { clickMouse, getMousePosition, moveMouse, waitForMiddleMouse } from './lib/user32'

async function wait(time: number): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(true), time)
	})
}

console.log('Marketplace scanner started!')
console.log('Please put your mouse over the refresh button and press the middle mouse button to log the position')

await waitForMiddleMouse()
const refreshButtonPosition = getMousePosition()
console.log(
	"Please put your mouse inside the first item's static attribute diamond and press the middle mouse button to log the position"
)
await waitForMiddleMouse()
const itemPosition = getMousePosition()

console.log(
	"Please put your mouse over the first item's price diamond and press the middle mouse button to log the position"
)
await waitForMiddleMouse()
const pricePosition = getMousePosition()

const itemCount = 10

console.log("Please input the amount of pages you'd like to scan:")
let scanCount = 0
for await (const line of console) {
	scanCount = parseInt(line)
	if (isNaN(scanCount)) {
		console.log('Please input a valid number')
	} else {
		break
	}
}

console.log('Please focus the game window, and press the middle mouse button to start scanning the marketplace')
await waitForMiddleMouse()
await wait(1000)

for (let cycles = 0; cycles < scanCount; cycles++) {
	await wait(2000)
	for (let item = 0; item < itemCount; item++) {
		const itemPos = {
			x: itemPosition.x,
			y: itemPosition.y + 69 * item,
		}
		const pricePos = {
			x: pricePosition.x,
			y: pricePosition.y + 69 * item,
		}
		await moveMouse(itemPos.x, itemPos.y)
		await wait(20)
		const pricePath = await capturePrice(pricePos.x, pricePos.y)
		const itemPath = await captureItemDetails(itemPosition.x)
		const ocrPrice = await ocrImage(pricePath)
		const ocrItem = await ocrImage(itemPath)
		const parsedPrice = parsePrice(ocrPrice)
		const parsedItem = parseItemDetails(ocrItem)
		if (parsedPrice && parsedItem.item && parsedItem.rarity) {
			console.log('Item:', parsedItem.rarity.name, parsedItem.item.name, 'Price:', parsedPrice)
			const res = await fetch('https://darkscanner.dev/api/item/' + parsedItem.item.id + '/price', {
				method: 'POST',
				body: JSON.stringify({
					...parsedItem,
					price: parsedPrice,
				}),
				headers: {
					'x-api-key': env.API_KEY!,
					'Content-Type': 'application/json',
				},
			})
			if (!res.ok) {
				console.log('Failed to send data to server')
			}
		} else if (!parsedItem.item) {
			console.log('Failed to parse data', { ocrItem })
		}

		await wait(50)
	}
	await moveMouse(refreshButtonPosition.x, refreshButtonPosition.y)
	await clickMouse()
}
