/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/colorpicker.js":
/*!*******************************!*\
  !*** ./src/js/colorpicker.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"bgColor\": () => (/* binding */ bgColor),\n/* harmony export */   \"objColor1\": () => (/* binding */ objColor1),\n/* harmony export */   \"objColor2\": () => (/* binding */ objColor2)\n/* harmony export */ });\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\r\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\r\nconst objColor2SaveButton = document.getElementById('objectColor2SaveButton');\r\n\r\nvar bgColor, objColor1, objColor2\r\nvar bgColorArr, objColor1Arr, objColor2Arr\r\n\r\n\r\nfunction rgbToHex([r, g, b]) {\r\n  return \"#\" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);\r\n}\r\n\r\n\r\ndocument.querySelector('#backgroundColor').addEventListener('click', e => {\r\n  Coloris({\r\n    themeMode: 'light',\r\n    alpha: true,\r\n    formatToggle: false\r\n  });\r\n\r\n});\r\n\r\n\r\n\r\ndocument.querySelector('#objectColor1').addEventListener('click', e => {\r\n  Coloris({\r\n    themeMode: 'light',\r\n    alpha: true,\r\n    formatToggle: false\r\n  });\r\n\r\n});\r\n\r\n\r\ndocument.querySelector('#objectColor2').addEventListener('click', e => {\r\n  Coloris({\r\n    themeMode: 'light',\r\n    alpha: true,\r\n    formatToggle: false\r\n  });\r\n\r\n});\r\n\r\n\r\nfunction colortoList(colorpick){\r\n  let colors = colorpick.replace('rgb(', '').replace(')', '')\r\n  let colorArr = colors.split(',')\r\n  return colorArr\r\n}\r\n\r\n\r\nbgColorSaveButton.addEventListener('click', function (){\r\n    bgColor = document.getElementsByClassName('clr-field')[0].style.color\r\n    bgColorArr = colortoList(bgColor);\r\n    bgColor = rgbToHex(bgColorArr);\r\n    \r\n})\r\n\r\n\r\nobjColor1SaveButton.addEventListener('click', function (){\r\n    objColor1 = document.getElementsByClassName('clr-field')[1].style.color\r\n    objColor1Arr = colortoList(objColor1);\r\n    objColor1 = rgbToHex(objColor1Arr);\r\n})\r\n\r\n\r\nobjColor2SaveButton.addEventListener('click', function(){\r\n    objColor2 = document.getElementsByClassName('clr-field')[2].style.color\r\n    objColor2Arr = colortoList(objColor2);\r\n    objColor2 = rgbToHex(objColor2Arr);\r\n})\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/colorpicker.js?");

/***/ }),

/***/ "./src/js/sparkle.js":
/*!***************************!*\
  !*** ./src/js/sparkle.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"sparkling\": () => (/* binding */ sparkling),\n/* harmony export */   \"startFauxClicking\": () => (/* binding */ startFauxClicking)\n/* harmony export */ });\n/* harmony import */ var _colorpicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorpicker */ \"./src/js/colorpicker.js\");\n\r\n\r\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\r\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\r\nconst objColor2SaveButton = document.getElementById('objectColor2SaveButton');\r\n\r\n\r\nvar c = document.getElementById(\"sparkle-canvas\");\r\nc.width = 600;\r\nc.height = 600;\r\n\r\nvar ctx = c.getContext(\"2d\");\r\nvar cH;\r\nvar cW;\r\nvar bgColors = \"#FFFFFF\";\r\nvar animations = [];\r\nvar circles = [];\r\n\r\n\r\n\r\nvar colorPicker = (function() {\r\n  var colors = ['#808080', '#000000', '#ffffff'];\r\n  \r\n  bgColorSaveButton.addEventListener('click', function (){\r\n    colors[0] = _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\r\n  })\r\n\r\n  \r\n  objColor1SaveButton.addEventListener('click', function () {\r\n    colors[1] = _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\r\n  })\r\n  \r\n  \r\n  \r\n  objColor2SaveButton.addEventListener('click', function () {\r\n    colors[2] = _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor2\r\n  })\r\n\r\n\r\n  var index = 0;\r\n  function next() {\r\n    index = index++ < colors.length-1 ? index : 0;\r\n    return colors[index];\r\n  }\r\n  function current() {\r\n    return colors[index]\r\n  }\r\n  return {\r\n    next: next,\r\n    current: current\r\n  }\r\n})();\r\n\r\n\r\n\r\n\r\nfunction removeAnimation(animation) {\r\n  var index = animations.indexOf(animation);\r\n  if (index > -1) animations.splice(index, 1);\r\n}\r\n\r\n\r\n\r\n\r\nfunction calcPageFillRadius(x, y) {\r\n  var l = Math.max(x - 0, cW - x);\r\n  var h = Math.max(y - 0, cH - y);\r\n  return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));\r\n}\r\n\r\n\r\n\r\n\r\nfunction addClickListeners() {\r\n  document.addEventListener(\"touchstart\", handleEvent);\r\n  document.addEventListener(\"mousedown\", handleEvent);\r\n};\r\n\r\n\r\n\r\n\r\n\r\nfunction handleEvent(e) {\r\n    if (e.touches) { \r\n      e.preventDefault();\r\n      e = e.touches[0];\r\n    }\r\n    var currentColor = colorPicker.current();\r\n    var nextColor = colorPicker.next();\r\n    var targetR = calcPageFillRadius(e.pageX, e.pageY);\r\n    var rippleSize = Math.min(200, (cW * .4));\r\n    var minCoverDuration = 750;\r\n    \r\n    var pageFill = new Circle({\r\n      x: e.pageX,\r\n      y: e.pageY,\r\n      r: 0,\r\n      fill: nextColor\r\n    });\r\n    var fillAnimation = anime({\r\n      targets: pageFill,\r\n      r: targetR,\r\n      duration:  Math.max(targetR / 2 , minCoverDuration ),\r\n      easing: \"easeOutQuart\",\r\n      complete: function(){\r\n        bgColors = pageFill.fill;\r\n        removeAnimation(fillAnimation);\r\n      }\r\n    });\r\n    \r\n    var ripple = new Circle({\r\n      x: e.pageX,\r\n      y: e.pageY,\r\n      r: 0,\r\n      fill: currentColor,\r\n      stroke: {\r\n        width: 3,\r\n        color: currentColor\r\n      },\r\n      opacity: 1\r\n    });\r\n    var rippleAnimation = anime({\r\n      targets: ripple,\r\n      r: rippleSize,\r\n      opacity: 0,\r\n      easing: \"easeOutExpo\",\r\n      duration: 900,\r\n      complete: removeAnimation\r\n    });\r\n    \r\n    var particles = [];\r\n    for (var i=0; i<32; i++) {\r\n      var particle = new Circle({\r\n        x: e.pageX,\r\n        y: e.pageY,\r\n        fill: currentColor,\r\n        r: anime.random(24, 48)\r\n      })\r\n      particles.push(particle);\r\n    }\r\n    var particlesAnimation = anime({\r\n      targets: particles,\r\n      x: function(particle){\r\n        return particle.x + anime.random(rippleSize, -rippleSize);\r\n      },\r\n      y: function(particle){\r\n        return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);\r\n      },\r\n      r: 0,\r\n      easing: \"easeOutExpo\",\r\n      duration: anime.random(1000,1300),\r\n      complete: removeAnimation\r\n    });\r\n    animations.push(fillAnimation, rippleAnimation, particlesAnimation);\r\n}\r\n\r\n\r\n\r\n\r\nfunction extend(a, b){\r\n  for(var key in b) {\r\n    if(b.hasOwnProperty(key)) {\r\n      a[key] = b[key];\r\n    }\r\n  }\r\n  return a;\r\n}\r\n\r\n\r\n\r\n\r\nvar Circle = function(opts) {\r\n  extend(this, opts);\r\n}\r\n\r\n\r\n\r\n\r\nCircle.prototype.draw = function() {\r\n  ctx.globalAlpha = this.opacity || 1;\r\n  ctx.beginPath();\r\n  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);\r\n  if (this.stroke) {\r\n    ctx.strokeStyle = this.stroke.color;\r\n    ctx.lineWidth = this.stroke.width;\r\n    ctx.stroke();\r\n  }\r\n  if (this.fill) {\r\n    ctx.fillStyle = this.fill;\r\n    ctx.fill();\r\n  }\r\n  ctx.closePath();\r\n  ctx.globalAlpha = 1;\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nvar resizeCanvas = function() {\r\n  cW = window.innerWidth;\r\n  cH = window.innerHeight;\r\n  c.width = cW * devicePixelRatio;\r\n  c.height = cH * devicePixelRatio;\r\n  ctx.scale(devicePixelRatio, devicePixelRatio);\r\n};\r\n\r\n\r\n\r\n\r\n(function init() {\r\n  resizeCanvas();\r\n  if (window.CP) {\r\n    // CodePen's loop detection was causin' problems\r\n    // and I have no idea why, so...\r\n    window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 10000; \r\n  }\r\n  window.addEventListener(\"resize\", resizeCanvas);\r\n  addClickListeners();\r\n  if (!!window.location.pathname.match(/fullcpgrid/)){\r\n    // startFauxClicking();\r\n  }\r\n//   handleInactiveUser();\r\n})();\r\n\r\n\r\n\r\n\r\nfunction handleInactiveUser() {\r\n//   var inactive = setTimeout(function(){\r\n//     fauxClick(cW/2, cH/2);\r\n//   }, 2000);\r\n  \r\n  function clearInactiveTimeout() {\r\n    // clearTimeout(inactive);\r\n    document.removeEventListener(\"mousedown\", clearInactiveTimeout);\r\n    document.removeEventListener(\"touchstart\", clearInactiveTimeout);\r\n  }\r\n  \r\n  document.addEventListener(\"mousedown\", clearInactiveTimeout);\r\n  document.addEventListener(\"touchstart\", clearInactiveTimeout);\r\n}\r\n\r\n\r\n\r\n\r\nfunction startFauxClicking() {\r\n    fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));\r\n    console.log(cW, cH)\r\n  //   setTimeout(function(){\r\n  //     fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));\r\n  //     startFauxClicking(); \r\n  //   }, anime.random(1000, 2000));\r\n\r\n}\r\n\r\n\r\n\r\nfunction fauxClick(x, y) {\r\n  var fauxClick = new Event(\"mousedown\");\r\n  fauxClick.pageX = x;\r\n  fauxClick.pageY = y;\r\n  document.dispatchEvent(fauxClick);\r\n}\r\n\r\n\r\n\r\nfunction synthesize_Click(note){\r\n  var fauxClick2 = new Event(\"mousedown\");\r\n  let note_x = 0;\r\n  let note_y = 0;\r\n  fauxClick2.pageX = note_x;\r\n  fauxClick2.pageY = note_y;\r\n  document.dispatchEvent(fauxClick2);\r\n}\r\n\r\n\r\n\r\n\r\nfunction sparkling(){\r\n \r\n    var animate = anime({\r\n        duration: Infinity,\r\n        update: function() {\r\n            ctx.fillStyle = bgColors;\r\n            ctx.fillRect(0, 0, cW, cH);\r\n            animations.forEach(function(anim) {\r\n            anim.animatables.forEach(function(animatable) {\r\n                animatable.target.draw();\r\n            });\r\n            });\r\n        }\r\n    })\r\n\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/sparkle.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/sparkle.js");
/******/ 	
/******/ })()
;