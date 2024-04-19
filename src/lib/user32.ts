import { dlopen, FFIType, CString } from 'bun:ffi'
const DEBUG = false
const user32 = dlopen('user32.dll', {
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

	FindWindowA: {
		// lpClassName: LPCSTR | null, lpWindowName: LPCSTR | null
		args: [FFIType.cstring, FFIType.cstring],
		returns: FFIType.int,
	},
	GetForegroundWindow: {
		args: [],
		returns: FFIType.int,
	},
	GetWindowTextA: {
		args: [FFIType.int, FFIType.cstring, FFIType.int],
		returns: FFIType.int,
	},

	SetForegroundWindow: {
		args: [FFIType.int],
		returns: FFIType.bool,
	},

	GetAsyncKeyState: {
		args: [FFIType.int],
		returns: FFIType.int,
	},
})

const point = Buffer.alloc(8)
export function getMousePosition() {
	user32.symbols.GetCursorPos(point)
	return { x: point.readInt32LE(0), y: point.readInt32LE(4) }
}

export async function clickMouse(x?: number, y?: number) {
	if (x && y) {
		await moveMouse(x, y)
	}
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
