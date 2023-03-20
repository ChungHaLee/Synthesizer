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

/***/ "./src/js/vanta.js":
/*!*************************!*\
  !*** ./src/js/vanta.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _colorpicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorpicker */ \"./src/js/colorpicker.js\");\n\r\n\r\n\r\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\r\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\r\nconst objColor2SaveButton = document.getElementById('objectColor2SaveButton');\r\n\r\n\r\n\r\n\r\n// let birds = VANTA.BIRDS({\r\n//     el: \"#vanta-background\",\r\n//     mouseControls: true,\r\n//     touchControls: true,\r\n//     gyroControls: false,\r\n//     minHeight: 600.00,\r\n//     minWidth: 600.00,\r\n//     scale: 1.00,\r\n//     backgroundColor: '#4539ed',\r\n//     color1: '#ed3939',\r\n//     color2: '#ffffff',\r\n//     scaleMobile: 1.00,\r\n//     colorMode: \"lerpGradient\",\r\n//     birdSize: 1.60,\r\n//     speedLimit: 7.00,\r\n//     separation: 1.00,\r\n//     alignment: 100.00,\r\n//     cohesion: 1.00\r\n// })\r\n\r\n\r\n\r\n\r\n\r\n// // 세이브하면 바꿔주기\r\n// bgColorSaveButton.addEventListener('click', function (){\r\n\r\n//     // birds.setOptions({\r\n//     //     backgroundColor: bgColor\r\n//     // })\r\n//     let birds = VANTA.BIRDS({\r\n//         el: \"#vanta-background\",\r\n//         mouseControls: true,\r\n//         touchControls: true,\r\n//         gyroControls: false,\r\n//         minHeight: 600.00,\r\n//         minWidth: 600.00,\r\n//         scale: 1.00,\r\n//         backgroundColor: bgColor,\r\n//         color1: objColor1,\r\n//         color2: objColor2,\r\n//         scaleMobile: 1.00,\r\n//         colorMode: \"lerpGradient\",\r\n//         birdSize: 1.60,\r\n//         speedLimit: 7.00,\r\n//         separation: 1.00,\r\n//         alignment: 100.00,\r\n//         cohesion: 1.00\r\n//     })\r\n\r\n\r\n// })\r\n\r\n\r\n// objColor1SaveButton.addEventListener('click', function () {\r\n\r\n//     // birds.setOptions({\r\n//     //     color1: objColor1\r\n//     // })\r\n//     birds = VANTA.BIRDS({\r\n//         el: \"#vanta-background\",\r\n//         mouseControls: true,\r\n//         touchControls: true,\r\n//         gyroControls: false,\r\n//         minHeight: 600.00,\r\n//         minWidth: 600.00,\r\n//         scale: 1.00,\r\n//         backgroundColor: bgColor,\r\n//         color1: objColor1,\r\n//         color2: objColor2,\r\n//         scaleMobile: 1.00,\r\n//         colorMode: \"lerpGradient\",\r\n//         birdSize: 1.60,\r\n//         speedLimit: 7.00,\r\n//         separation: 1.00,\r\n//         alignment: 100.00,\r\n//         cohesion: 1.00\r\n//     })\r\n \r\n    \r\n// })\r\n\r\n\r\n\r\n// objColor2SaveButton.addEventListener('click', function () {\r\n\r\n//     // birds.setOptions({\r\n//     //     color2: objColor2\r\n//     // })\r\n\r\n//     birds = VANTA.BIRDS({\r\n//         el: \"#vanta-background\",\r\n//         mouseControls: true,\r\n//         touchControls: true,\r\n//         gyroControls: false,\r\n//         minHeight: 600.00,\r\n//         minWidth: 600.00,\r\n//         scale: 1.00,\r\n//         backgroundColor: bgColor,\r\n//         color1: objColor1,\r\n//         color2: objColor2,\r\n//         scaleMobile: 1.00,\r\n//         colorMode: \"lerpGradient\",\r\n//         birdSize: 1.60,\r\n//         speedLimit: 7.00,\r\n//         separation: 1.00,\r\n//         alignment: 100.00,\r\n//         cohesion: 1.00\r\n//     })\r\n \r\n// })\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/vanta.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/vanta.js");
/******/ 	
/******/ })()
;