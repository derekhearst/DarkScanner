import { dlopen, FFIType } from 'bun:ffi'

const user32 = dlopen('user32.dll', {
	GetCursorPos: {
		args: [FFIType.ptr],
		returns: FFIType.bool,
	},

	GetAsyncKeyState: {
		args: [FFIType.int],
		returns: FFIType.int,
	},
})

const cursorBuffer = Buffer.alloc(8)
let isMessageSent = false
let timeoutId = null

setInterval(() => {
	const keyState = user32.symbols.GetAsyncKeyState(0x04)
	if (keyState == 0) return
	user32.symbols.GetCursorPos(cursorBuffer)
	const cursorPosition = { x: cursorBuffer.readInt32LE(0), y: cursorBuffer.readInt32LE(4) }

	if (!isMessageSent) {
		postMessage(cursorPosition)
		isMessageSent = true

		// Clear the flag after a delay
		timeoutId = setTimeout(() => {
			isMessageSent = false
		}, 200) // Adjust the delay as needed
	}
}, 50)
