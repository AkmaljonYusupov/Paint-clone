// global o`zgaruvchilar (verable)
const canvas = document.querySelector('canvas'),
	toolBtns = document.querySelectorAll('.tool'),
	fillColor = document.querySelector('#fill-color'),
	sizeSlider = document.querySelector('#size-slider'),
	colorBtns = document.querySelectorAll('.colors .option'),
	colorPicker = document.querySelector('#color-picker'),
	clearCanvasBtn = document.querySelector('.clear-canvas'),
	saveImageBtn = document.querySelector('.save-img')

// o`zgaruvchi (verable with default value)
let ctx = canvas.getContext('2d'),
	isDrawing = false,
	brushWidth = 5,
	selectedTool = 'brush',
	selectedColor = 'black',
	prevMouseX,
	prevMouseY,
	snapshot
// set canvas background (orqa foni rangi)
const setCannvasBackground = () => {
	ctx.fillStyle = '#fff'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = selectedColor
}

// eni va bo`yi (set canvas width and height)
window.addEventListener('load', () => {
	canvas.width = canvas.offsetWidth
	canvas.height = canvas.offsetHeight
	setCannvasBackground()
})
// start drawing
const startDraw = e => {
	isDrawing = true
	prevMouseX = e.offsetX
	prevMouseY = e.offsetY
	ctx.beginPath()
	ctx.lineWidth = brushWidth
	ctx.strokeStyle = selectedColor
	ctx.fillStyle = selectedColor
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}
// To`rtburchak
const drawRectangle = e => {
	if (!fillColor.checked) {
		ctx.strokeRect(
			e.offsetX,
			e.offsetY,
			prevMouseX - e.offsetX,
			prevMouseY - e.offsetY
		)
	} else {
		ctx.fillRect(
			e.offsetX,
			e.offsetY,
			prevMouseX - e.offsetX,
			prevMouseY - e.offsetY
		)
	}
}
// draw circle (aylana)
const drawCircle = e => {
	ctx.beginPath()
	const radius =
		Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) +
		Math.pow(prevMouseY - e.offsetY, 2)
	ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)

	fillColor.checked ? ctx.fill() : ctx.stroke()
}
// Draw Triangle (uchburchak)
const drawTriangle = e => {
	ctx.beginPath()
	ctx.moveTo(prevMouseX, prevMouseY)
	ctx.lineTo(e.offsetX, e.offsetY)
	ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)

	fillColor.checked ? ctx.fill() : ctx.stroke()
	ctx.closePath()
	ctx.stroke()
}
//Draw Liner (to`g`ri chiziq)
const drawLiner = e => {
	ctx.beginPath()
	ctx.moveTo(prevMouseX, prevMouseY)
	ctx.lineTo(e.offsetX, e.offsetY)
	ctx.stroke()
}

// drawing
const drawing = e => {
	if (!isDrawing) return
	ctx.putImageData(snapshot, 0, 0)
	switch (selectedTool) {
		case 'brush':
			ctx.lineTo(e.offsetX, e.offsetY)
			ctx.stroke()
			break
		case 'rectangle':
			drawRectangle(e)
			break
		case 'circle':
			drawCircle(e)
			break
		case 'triangle':
			drawTriangle(e)
			break
		case 'liner':
			drawLiner(e)
			break
		case 'eraser':
			ctx.strokeStyle = '#fff'
			ctx.lineTo(e.offsetX, e.offsetY)
			ctx.stroke()
			break
		default:
			break
	}
}

// tools btn and  set to verables selected tool
toolBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelector('.options .active').classList.remove('active')
		btn.classList.add('active')
		selectedTool = btn.id
	})
})
// change brush with
sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value))

// set color to shapes
colorBtns.forEach(btn => {
	btn.addEventListener('click', e => {
		document.querySelector('.options .selected').classList.remove('selected')
		btn.classList.add('selected')
		const bgColor = window
			.getComputedStyle(btn)
			.getPropertyValue('background-color')
		selectedColor = bgColor
	})
})

// set color from color picker (color picker bilan ishlash)
colorPicker.addEventListener('change', () => {
	colorPicker.parentElement.style.background = colorPicker.value
	colorPicker.parentElement.click()
})

// (o`chirish tugmasi)  clear canvas button
clearCanvasBtn.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	setCannvasBackground()
})
// save like image our paint (chizilgan rasmni saqlash)
saveImageBtn.addEventListener('click', () => {
	const link = document.createElement('a')
	link.download = `Coder.ac Paint ${Date.now()}.jpg`
	link.href = canvas.toDataURL()
	link.click()
})
// stop drawing
const stopDraw = () => {
	isDrawing = false
}

canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', stopDraw)
