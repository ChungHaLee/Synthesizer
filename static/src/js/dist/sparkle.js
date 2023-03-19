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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"bgColor\": () => (/* binding */ bgColor),\n/* harmony export */   \"objColor1\": () => (/* binding */ objColor1),\n/* harmony export */   \"objColor2\": () => (/* binding */ objColor2)\n/* harmony export */ });\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\nconst objColor2SaveButton = document.getElementById('objectColor2SaveButton');\n\nvar bgColor, objColor1, objColor2\nvar bgColorArr, objColor1Arr, objColor2Arr\n\n\nfunction rgbToHex([r, g, b]) {\n  return \"#\" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);\n}\n\n\ndocument.querySelector('#backgroundColor').addEventListener('click', e => {\n  Coloris({\n    themeMode: 'light',\n    alpha: true,\n    formatToggle: false\n  });\n\n});\n\n\n\ndocument.querySelector('#objectColor1').addEventListener('click', e => {\n  Coloris({\n    themeMode: 'light',\n    alpha: true,\n    formatToggle: false\n  });\n\n});\n\n\ndocument.querySelector('#objectColor2').addEventListener('click', e => {\n  Coloris({\n    themeMode: 'light',\n    alpha: true,\n    formatToggle: false\n  });\n\n});\n\n\nfunction colortoList(colorpick){\n  let colors = colorpick.replace('rgb(', '').replace(')', '')\n  let colorArr = colors.split(',')\n  return colorArr\n}\n\n\nbgColorSaveButton.addEventListener('click', function (){\n    bgColor = document.getElementsByClassName('clr-field')[0].style.color\n    bgColorArr = colortoList(bgColor);\n    bgColor = rgbToHex(bgColorArr);\n    \n})\n\n\nobjColor1SaveButton.addEventListener('click', function (){\n    objColor1 = document.getElementsByClassName('clr-field')[1].style.color\n    objColor1Arr = colortoList(objColor1);\n    objColor1 = rgbToHex(objColor1Arr);\n})\n\n\nobjColor2SaveButton.addEventListener('click', function(){\n    objColor2 = document.getElementsByClassName('clr-field')[2].style.color\n    objColor2Arr = colortoList(objColor2);\n    objColor2 = rgbToHex(objColor2Arr);\n})\n\n\n\n\n\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/colorpicker.js?");

/***/ }),

/***/ "./src/js/sparkle.js":
/*!***************************!*\
  !*** ./src/js/sparkle.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"sparkling\": () => (/* binding */ sparkling),\n/* harmony export */   \"startFauxClicking\": () => (/* binding */ startFauxClicking)\n/* harmony export */ });\n/* harmony import */ var _colorpicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorpicker */ \"./src/js/colorpicker.js\");\n\n\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\nconst objColor2SaveButton = document.getElementById('objectColor2SaveButton');\n\n\nvar c = document.getElementById(\"sparkle-canvas\");\nc.width = 600;\nc.height = 600;\n\nvar ctx = c.getContext(\"2d\");\nvar cH;\nvar cW;\nvar bgColors = \"#FFFFFF\";\nvar animations = [];\nvar circles = [];\n\n\n\nvar colorPicker = (function() {\n  var colors = ['#808080', '#000000', '#ffffff'];\n  \n  bgColorSaveButton.addEventListener('click', function (){\n    colors[0] = _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\n  })\n\n  \n  objColor1SaveButton.addEventListener('click', function () {\n    colors[1] = _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\n  })\n  \n  \n  \n  objColor2SaveButton.addEventListener('click', function () {\n    colors[2] = _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor2\n  })\n\n\n  var index = 0;\n  function next() {\n    index = index++ < colors.length-1 ? index : 0;\n    return colors[index];\n  }\n  function current() {\n    return colors[index]\n  }\n  return {\n    next: next,\n    current: current\n  }\n})();\n\n\n\n\nfunction removeAnimation(animation) {\n  var index = animations.indexOf(animation);\n  if (index > -1) animations.splice(index, 1);\n}\n\n\n\n\nfunction calcPageFillRadius(x, y) {\n  var l = Math.max(x - 0, cW - x);\n  var h = Math.max(y - 0, cH - y);\n  return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));\n}\n\n\n\n\nfunction addClickListeners() {\n  document.addEventListener(\"touchstart\", handleEvent);\n  document.addEventListener(\"mousedown\", handleEvent);\n};\n\n\n\n\n\nfunction handleEvent(e) {\n    if (e.touches) { \n      e.preventDefault();\n      e = e.touches[0];\n    }\n    var currentColor = colorPicker.current();\n    var nextColor = colorPicker.next();\n    var targetR = calcPageFillRadius(e.pageX, e.pageY);\n    var rippleSize = Math.min(200, (cW * .4));\n    var minCoverDuration = 750;\n    \n    var pageFill = new Circle({\n      x: e.pageX,\n      y: e.pageY,\n      r: 0,\n      fill: nextColor\n    });\n    var fillAnimation = anime({\n      targets: pageFill,\n      r: targetR,\n      duration:  Math.max(targetR / 2 , minCoverDuration ),\n      easing: \"easeOutQuart\",\n      complete: function(){\n        bgColors = pageFill.fill;\n        removeAnimation(fillAnimation);\n      }\n    });\n    \n    var ripple = new Circle({\n      x: e.pageX,\n      y: e.pageY,\n      r: 0,\n      fill: currentColor,\n      stroke: {\n        width: 3,\n        color: currentColor\n      },\n      opacity: 1\n    });\n    var rippleAnimation = anime({\n      targets: ripple,\n      r: rippleSize,\n      opacity: 0,\n      easing: \"easeOutExpo\",\n      duration: 900,\n      complete: removeAnimation\n    });\n    \n    var particles = [];\n    for (var i=0; i<32; i++) {\n      var particle = new Circle({\n        x: e.pageX,\n        y: e.pageY,\n        fill: currentColor,\n        r: anime.random(24, 48)\n      })\n      particles.push(particle);\n    }\n    var particlesAnimation = anime({\n      targets: particles,\n      x: function(particle){\n        return particle.x + anime.random(rippleSize, -rippleSize);\n      },\n      y: function(particle){\n        return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);\n      },\n      r: 0,\n      easing: \"easeOutExpo\",\n      duration: anime.random(1000,1300),\n      complete: removeAnimation\n    });\n    animations.push(fillAnimation, rippleAnimation, particlesAnimation);\n}\n\n\n\n\nfunction extend(a, b){\n  for(var key in b) {\n    if(b.hasOwnProperty(key)) {\n      a[key] = b[key];\n    }\n  }\n  return a;\n}\n\n\n\n\nvar Circle = function(opts) {\n  extend(this, opts);\n}\n\n\n\n\nCircle.prototype.draw = function() {\n  ctx.globalAlpha = this.opacity || 1;\n  ctx.beginPath();\n  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);\n  if (this.stroke) {\n    ctx.strokeStyle = this.stroke.color;\n    ctx.lineWidth = this.stroke.width;\n    ctx.stroke();\n  }\n  if (this.fill) {\n    ctx.fillStyle = this.fill;\n    ctx.fill();\n  }\n  ctx.closePath();\n  ctx.globalAlpha = 1;\n}\n\n\n\n\n\n\n\n\nvar resizeCanvas = function() {\n  cW = window.innerWidth;\n  cH = window.innerHeight;\n  c.width = cW * devicePixelRatio;\n  c.height = cH * devicePixelRatio;\n  ctx.scale(devicePixelRatio, devicePixelRatio);\n};\n\n\n\n\n(function init() {\n  resizeCanvas();\n  if (window.CP) {\n    // CodePen's loop detection was causin' problems\n    // and I have no idea why, so...\n    window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 10000; \n  }\n  window.addEventListener(\"resize\", resizeCanvas);\n  addClickListeners();\n  if (!!window.location.pathname.match(/fullcpgrid/)){\n    // startFauxClicking();\n  }\n//   handleInactiveUser();\n})();\n\n\n\n\nfunction handleInactiveUser() {\n//   var inactive = setTimeout(function(){\n//     fauxClick(cW/2, cH/2);\n//   }, 2000);\n  \n  function clearInactiveTimeout() {\n    // clearTimeout(inactive);\n    document.removeEventListener(\"mousedown\", clearInactiveTimeout);\n    document.removeEventListener(\"touchstart\", clearInactiveTimeout);\n  }\n  \n  document.addEventListener(\"mousedown\", clearInactiveTimeout);\n  document.addEventListener(\"touchstart\", clearInactiveTimeout);\n}\n\n\n\n\nfunction startFauxClicking() {\n    fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));\n  //   setTimeout(function(){\n  //     fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));\n  //     startFauxClicking(); \n  //   }, anime.random(1000, 2000));\n\n}\n\n\n\nfunction fauxClick(x, y) {\n  var fauxClick = new Event(\"mousedown\");\n  fauxClick.pageX = x;\n  fauxClick.pageY = y;\n  document.dispatchEvent(fauxClick);\n}\n\n\n\nfunction sparkling(){\n \n    var animate = anime({\n        duration: Infinity,\n        update: function() {\n            ctx.fillStyle = bgColors;\n            ctx.fillRect(0, 0, cW, cH);\n            animations.forEach(function(anim) {\n            anim.animatables.forEach(function(animatable) {\n                animatable.target.draw();\n            });\n            });\n        }\n    })\n\n}\n\n\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/sparkle.js?");

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