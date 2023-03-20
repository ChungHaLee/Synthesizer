/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/starfield.js":
/*!*****************************!*\
  !*** ./src/js/starfield.js ***!
  \*****************************/
/***/ (() => {

eval("// import { bgColor, objColor1, objColor2 } from './colorpicker'\r\n\r\n\r\n// const bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\r\n// const objColor1SaveButton = document.getElementById('objectColor1SaveButton');\r\n// const objColor2SaveButton = document.getElementById('objectColor2SaveButton');\r\n\r\n\r\n\r\n// const canvas = document.getElementById('starfield-canvas');\r\n// const c = canvas.getContext('2d');\r\n// canvas.width = window.innerWidth; //screen width\r\n// canvas.height = window.innerHeight; //screem height\r\n\r\n\r\n\r\n// // on mouse scroll changes speed and color\r\n// // 이 부분 수정하기\r\n\r\n\r\n// function starField_faster(){\r\n\r\n//   bgColorSaveButton.addEventListener('click', function (){\r\n//     c.fillStyle = bgColor\r\n//   })\r\n  \r\n  \r\n//   objColor1SaveButton.addEventListener('click', function () {\r\n//     c.strokeStyle= objColor1\r\n//   })\r\n  \r\n//   speed = 0.5;\r\n\r\n// }\r\n\r\n// // function starField_plain(){\r\n// //   bgColorSaveButton.addEventListener('click', function (){\r\n// //     c.fillStyle = objColor2\r\n// //   })\r\n  \r\n  \r\n// //   objColor2SaveButton.addEventListener('click', function () {\r\n// //     c.strokeStyle= bgColor\r\n// //   })\r\n\r\n// //   speed *= 0.2;\r\n// // }\r\n\r\n// // function starField_slower(){\r\n// //     c.fillStyle = \"#27187e\";\r\n// //     c.strokeStyle = '#ff8600';\r\n// //     speed *= 0.5;\r\n// // }\r\n\r\n\r\n// // window.addEventListener('wheel', (event) => {\r\n// //     c.strokeStyle = 'rgb('+Math.random()*255+', '+Math.random()*255+', '+Math.random()*255+')';\r\n// //     if (event.deltaY < 0) speed *= 1.1;\r\n// //     else speed *= 0.9;\r\n// //     if (speed < 0.01) speed = 0.01;\r\n// //     else if (speed > 0.1) speed = 0.1;\r\n// //   });\r\n\r\n// class Star {\r\n//   constructor() {\r\n//     //initializing\r\n//     this.x = Math.random()*canvas.width-canvas.width/6;  //random x\r\n//     this.y = Math.random()*canvas.height-canvas.height/6; //random y\r\n//     this.px, this.py;\r\n//     this.z = Math.random()*3; //random z    \r\n//   }\r\n  \r\n//   update() {\r\n//     //stores previous x, y and z and generates new coordinates    \r\n//     this.px = this.x;\r\n//     this.py = this.y;\r\n//     this.z += speed;\r\n//     this.x += this.x*(speed*0.2)*this.z;\r\n//     this.y += this.y*(speed*0.2)*this.z;\r\n//     if (this.x > canvas.width/2+50 || this.x < -canvas.width/2-50 ||\r\n//         this.y > canvas.height/2+50 || this.y < -canvas.height/2-50) {\r\n//       this.x = Math.random()*canvas.width-canvas.width/2;\r\n//       this.y = Math.random()*canvas.height-canvas.height/2;\r\n//       this.px = this.x;\r\n//       this.py = this.y;\r\n//       this.z = 0;\r\n//     }\r\n//   }\r\n  \r\n//   //draws line from x,y to px,py\r\n//   show() {    \r\n//     c.lineWidth = this.z;\r\n//     c.beginPath();\r\n//     c.moveTo(this.x, this.y);\r\n//     c.lineTo(this.px, this.py);\r\n//     c.stroke();\r\n//   }\r\n// }\r\n\r\n// let speed = 0.04;\r\n// let stars = [];\r\n\r\n// //create 1500 stars (objects)\r\n// for (let i = 0; i < 1500; i++) stars.push(new Star());\r\n\r\n// c.fillStyle = 'rgba(0, 0, 0, 0.1)';\r\n// c.strokeStyle = 'rgb('+Math.random()*255+', '+Math.random()*255+', '+Math.random()*255+')';\r\n\r\n// c.translate(canvas.width/2, canvas.height/2);\r\n\r\n// function draw() {\r\n//   //create rectangle\r\n//   c.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);\r\n//   for (let s of stars) {\r\n//     s.update();\r\n//     s.show();\r\n//   }\r\n//   //infinte call to draw\r\n//   requestAnimationFrame(draw);\r\n// }\r\n\r\n\r\n\r\n// export { starField_faster, draw }\n\n//# sourceURL=webpack://Synthesizer/./src/js/starfield.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/starfield.js"]();
/******/ 	
/******/ })()
;