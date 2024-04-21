import { dlopen, FFIType } from 'bun:ffi'
const DEBUG = false
const user32 = dlopen('user32.dll', {
	GetAsyncKeyState: {
		args: [FFIType.int],
		returns: FFIType.int,
	},
	GetCursorPos: {
		args: [FFIType.ptr],
		returns: FFIType.bool,
	},
	mouse_event: {
		args: [FFIType.int, FFIType.int, FFIType.int, FFIType.int, FFIType.int],
		returns: FFIType.void,
	},
	SetCursorPos: {
		args: [FFIType.int, FFIType.int],
		returns: FFIType.bool,
	},
})

export function getMousePosition() {
	const point = Buffer.alloc(8)
	user32.symbols.GetCursorPos(point)
	return { x: point.readInt32LE(0), y: point.readInt32LE(4) }
}

export async function clickMouse() {
	if (DEBUG) console.log('Clicking mouse')
	await new Promise((resolve) => setTimeout(resolve, 10))
	// dwFlags: 0x0002 = MOUSEEVENTF_LEFTDOWN
	user32.symbols.mouse_event(0x0002, 0, 0, 0, 0)
	await new Promise((resolve) => setTimeout(resolve, 10))
	// dwFlags: 0x0004 = MOUSEEVENTF_LEFTUP
	user32.symbols.mouse_event(0x0004, 0, 0, 0, 0)
}

export async function moveMouse(x: number, y: number) {
	if (DEBUG) console.log('Moving mouse to:', x, y)
	const success = user32.symbols.SetCursorPos(x, y)
	if (!success) {
		throw new Error('Failed to move mouse')
	}
}
export async function waitForMiddleMouse() {
	await new Promise((resolve) => {
		setTimeout(() => {
			const keyState = user32.symbols.GetAsyncKeyState(0x04)
			if (keyState !== 0) {
				resolve(undefined)
			} else {
				waitForMiddleMouse().then(resolve)
			}
		}, 100)
	})
}
