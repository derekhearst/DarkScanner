import { $ } from 'bun'
const tesseractPath = 'C:\\Program Files\\Tesseract-OCR'

const imagePath = 'tests/test2.jpg'

const startTime = Date.now()
const res = await $`"${tesseractPath}\\tesseract.exe" ${imagePath} stdout`.text()
const endTime = Date.now()
console.log(res)

console.log(`Time: ${endTime - startTime}ms`)
