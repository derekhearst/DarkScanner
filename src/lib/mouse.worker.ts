import { dlopen, FFIType } from 'bun:ffi'
declare var self: Worker

const user32 = dlopen('user32.dll', {
	GetAsyncKeyState: {
		args: [FFIType.int],
		returns: FFIType.int,
	},
})

let isMessageSent = false
let timeoutId: number | null = null

setInterval(() => {
	const keyState = user32.symbols.GetAsyncKeyState(0x04)
	if (keyState == 0) return
	if (!isMessageSent) {
		postMessage(true)
		isMessageSent = true
		// Clear the flag after a delay
		// @ts-expect-error some typing issues with umber
		timeoutId = setTimeout(() => {
			isMessageSent = false
		}, 200) // Adjust the delay as needed
	}
}, 50)
