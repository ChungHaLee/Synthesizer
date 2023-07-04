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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"bgColor\": () => (/* binding */ bgColor),\n/* harmony export */   \"objColor1\": () => (/* binding */ objColor1),\n/* harmony export */   \"setBgColor\": () => (/* binding */ setBgColor),\n/* harmony export */   \"setObjColor1\": () => (/* binding */ setObjColor1)\n/* harmony export */ });\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\r\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\r\n\r\n\r\nvar bgColor, objColor1\r\nvar bgColorArr, objColor1Arr\r\n\r\nobjColor1 = '#FFFFFF'\r\nbgColor = '#FFFFFF'\r\n\r\n\r\n\r\n\r\nfunction rgbToHex([r, g, b]) {\r\n  return \"#\" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);\r\n}\r\n\r\n\r\ndocument.querySelector('#backgroundColor').addEventListener('click', e => {\r\n  Coloris({\r\n    themeMode: 'light',\r\n    alpha: true,\r\n    formatToggle: false\r\n  });\r\n\r\n});\r\n\r\n\r\n\r\ndocument.querySelector('#objectColor1').addEventListener('click', e => {\r\n  Coloris({\r\n    themeMode: 'light',\r\n    alpha: true,\r\n    formatToggle: false\r\n  });\r\n\r\n});\r\n\r\n\r\n\r\n\r\n\r\nfunction setBgColor(color){\r\n  bgColor = color\r\n}\r\nfunction setObjColor1(color){\r\n  objColor1 = color\r\n}\r\n\r\n\r\n\r\nfunction colortoList(colorpick){\r\n  let colors = colorpick.replace('rgb(', '').replace(')', '')\r\n  let colorArr = colors.split(',')\r\n  return colorArr\r\n}\r\n\r\n\r\nbgColorSaveButton.addEventListener('click', function (){\r\n    bgColor = document.getElementsByClassName('clr-field')[0].style.color\r\n    bgColorArr = colortoList(bgColor);\r\n    bgColor = rgbToHex(bgColorArr);\r\n    \r\n})\r\n\r\n\r\nobjColor1SaveButton.addEventListener('click', function (){\r\n    objColor1 = document.getElementsByClassName('clr-field')[1].style.color\r\n    objColor1Arr = colortoList(objColor1);\r\n    objColor1 = rgbToHex(objColor1Arr);\r\n\r\n})\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/colorpicker.js?");

/***/ }),

/***/ "./src/js/vantavisual.js":
/*!*******************************!*\
  !*** ./src/js/vantavisual.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _colorpicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorpicker */ \"./src/js/colorpicker.js\");\n\r\n\r\n\r\nlet cloud, fog, blur, halo, cells, dots;\r\n\r\nlet cloudButton = document.getElementById('thema_clouds')\r\nlet blurButton = document.getElementById('thema_blur')\r\nlet fogButton = document.getElementById('thema_fog')\r\nlet haloButton = document.getElementById('thema_halo')\r\nlet cellsButton = document.getElementById('thema_cells')\r\nlet noneButton = document.getElementById('thema_none')\r\n\r\n\r\n\r\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\r\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\r\n\r\n\r\n\r\ncloudButton.addEventListener('click', cloudfunc)\r\nblurButton.addEventListener('click', blurfunc)\r\nfogButton.addEventListener('click', fogfunc)\r\nhaloButton.addEventListener('click', halofunc)\r\ncellsButton.addEventListener('click', cellsfunc)\r\nnoneButton.addEventListener('click', nonefunc)\r\n\r\ncloud = VANTA.CLOUDS({\r\n  el: \"#shape-canvas\",\r\n  minHeight: 580.00,\r\n  minWidth: 960.00,\r\n  mouseControls: false,\r\n  touchControls: false,\r\n  gyroControls: false,\r\n  skyColor: 0x63b4d2,\r\n  cloudColor: 0xadbedc,\r\n  cloudShadowColor: 0x18354a,\r\n  sunColor: 0xf79622,\r\n  sunGlareColor: 0xfa6331,\r\n  sunlightColor: 0xfc9c3e\r\n})\r\n\r\nblur = VANTA.FOG({\r\n  el: \"#shape-canvas\",\r\n  mouseControls: false,\r\n  touchControls: false,\r\n  gyroControls: false,\r\n  minHeight: 580.00,\r\n  minWidth: 960.00,\r\n  highlightColor: 0xffffff,\r\n\r\n  midtoneColor: '#fac4c4',\r\n  lowlightColor: '#fac4c4',\r\n  baseColor: '#8828ff',\r\n  blurFactor: 0.90,\r\n  speed: 2.50,\r\n  zoom: 1.60\r\n})\r\n\r\nfog = VANTA.FOG({    \r\n  el: \"#shape-canvas\",\r\n  mouseControls: false,\r\n  touchControls: false,\r\n  gyroControls: false,\r\n  minHeight: 580.00,\r\n  minWidth: 960.00,\r\n  highlightColor: 0xb63277,\r\n  midtoneColor: '#0084ff',\r\n  lowlightColor: '#0084ff',\r\n  baseColor: '#e3d842',\r\n  blurFactor: 0.27,\r\n  speed: 2.20,\r\n  zoom: 1.90\r\n})\r\n\r\nhalo = VANTA.HALO({\r\n  el: \"#shape-canvas\",\r\n  mouseControls: false,\r\n  touchControls: false,\r\n  gyroControls: false,\r\n  minHeight: 580.00,\r\n  minWidth: 960.00,\r\n  baseColor: 0x458258,\r\n  backgroundColor: 0x123126,\r\n  amplitudeFactor: 1.10,\r\n  size: 3.00\r\n})\r\n\r\ncells = VANTA.CELLS({\r\n  el: \"#shape-canvas\",\r\n  mouseControls: false,\r\n  touchControls: false,\r\n  gyroControls: false,\r\n  minHeight: 580.00,\r\n  minWidth: 960.00,\r\n  scale: 1.00,\r\n  color1: 0xb6ebeb,\r\n  color2: 0xecd3fa,\r\n  size: 5.00,\r\n  speed: 3\r\n})\r\n\r\n\r\ndots = VANTA.DOTS({\r\n  el: \"#shape-canvas\",\r\n  mouseControls: false,\r\n  touchControls: false,\r\n  gyroControls: false,\r\n  minHeight: 580.00,\r\n  minWidth: 960.00,\r\n  scale: 1.00,\r\n  color: 0x0,\r\n  color2: 0x0,\r\n  backgroundColor: 0x0,\r\n  size: 0.50,\r\n  spacing: 5.00,\r\n  showLines: false\r\n})\r\n\r\n\r\n\r\n\r\n\r\nfunction cloudfunc(){\r\n  cloud = VANTA.CLOUDS({\r\n    el: \"#shape-canvas\",\r\n    minHeight: 580.00,\r\n    minWidth: 960.00,\r\n    mouseControls: false,\r\n    touchControls: false,\r\n    gyroControls: false,\r\n    skyColor: 0x63b4d2,\r\n    cloudColor: 0xadbedc,\r\n    cloudShadowColor: 0x18354a,\r\n    sunColor: 0xf79622,\r\n    sunGlareColor: 0xfa6331,\r\n    sunlightColor: 0xfc9c3e\r\n  })\r\n\r\n  blur.destroy();\r\n  fog.destroy();\r\n  halo.destroy();\r\n  cells.destroy();\r\n  dots.destroy();\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nfunction blurfunc(){\r\n  blur = VANTA.FOG({\r\n    el: \"#shape-canvas\",\r\n    mouseControls: false,\r\n    touchControls: false,\r\n    gyroControls: false,\r\n    minHeight: 580.00,\r\n    minWidth: 960.00,\r\n    highlightColor: 0xffffff,\r\n\r\n    midtoneColor: '#fac4c4',\r\n    lowlightColor: '#fac4c4',\r\n    baseColor: '#8828ff',\r\n    blurFactor: 0.90,\r\n    speed: 2.50,\r\n    zoom: 1.60\r\n  })\r\n\r\n  cloud.destroy();\r\n  fog.destroy();\r\n  halo.destroy();\r\n  cells.destroy();\r\n  dots.destroy();\r\n}\r\n\r\n\r\n\r\nfunction fogfunc(){\r\n  fog = VANTA.FOG({    \r\n    el: \"#shape-canvas\",\r\n    mouseControls: false,\r\n    touchControls: false,\r\n    gyroControls: false,\r\n    minHeight: 580.00,\r\n    minWidth: 960.00,\r\n    highlightColor: 0xb63277,\r\n    midtoneColor: '#0084ff',\r\n    lowlightColor: '#0084ff',\r\n    baseColor: '#e3d842',\r\n    blurFactor: 0.27,\r\n    speed: 2.20,\r\n    zoom: 1.90\r\n  })\r\n\r\n  blur.destroy();\r\n  cloud.destroy();\r\n  halo.destroy();\r\n  cells.destroy();\r\n  dots.destroy();\r\n\r\n}\r\n\r\n\r\nfunction halofunc(){\r\n  halo = VANTA.HALO({\r\n    el: \"#shape-canvas\",\r\n    mouseControls: false,\r\n    touchControls: false,\r\n    gyroControls: false,\r\n    minHeight: 580.00,\r\n    minWidth: 960.00,\r\n    baseColor: 0x458258,\r\n    backgroundColor: 0x123126,\r\n    amplitudeFactor: 1.10,\r\n    size: 3.00\r\n  })\r\n\r\n  blur.destroy();\r\n  fog.destroy();\r\n  cloud.destroy();\r\n  cells.destroy();\r\n  dots.destroy();\r\n}\r\n\r\n\r\nfunction cellsfunc(){\r\n  cells = VANTA.CELLS({\r\n    el: \"#shape-canvas\",\r\n    mouseControls: false,\r\n    touchControls: false,\r\n    gyroControls: false,\r\n    minHeight: 580.00,\r\n    minWidth: 960.00,\r\n    scale: 1.00,\r\n    color1: 0xb6ebeb,\r\n    color2: 0xecd3fa,\r\n    size: 5.00,\r\n    speed: 3\r\n  })\r\n\r\n  blur.destroy();\r\n  fog.destroy();\r\n  halo.destroy();\r\n  cloud.destroy();\r\n  dots.destroy();\r\n}\r\n\r\n\r\nfunction nonefunc(){\r\n  dots = VANTA.DOTS({\r\n    el: \"#shape-canvas\",\r\n    mouseControls: false,\r\n    touchControls: false,\r\n    gyroControls: false,\r\n    minHeight: 580.00,\r\n    minWidth: 960.00,\r\n    scale: 1.00,\r\n    color: 0x0,\r\n    color2: 0x0,\r\n    backgroundColor: 0x0,\r\n    size: 0.50,\r\n    spacing: 5.00,\r\n    showLines: false\r\n  })\r\n\r\n  blur.destroy();\r\n  fog.destroy();\r\n  halo.destroy();\r\n  cells.destroy();\r\n  cloud.destroy();\r\n}\r\n\r\n\r\n\r\n\r\n\r\nbgColorSaveButton.addEventListener('click', function(){\r\n  cloud.setOptions({\r\n    cloudColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\r\n  });\r\n\r\n  blur.setOptions({\r\n    midtoneColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor,\r\n    lowlightColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\r\n  });\r\n\r\n  fog.setOptions({\r\n    midtoneColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor,\r\n    lowlightColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\r\n\r\n  })\r\n\r\n  halo.setOptions({\r\n    backgroundColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\r\n  })\r\n\r\n  cells.setOptions({\r\n    color1: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\r\n  })\r\n\r\n})\r\n\r\n\r\n\r\n\r\n\r\n\r\nobjColor1SaveButton.addEventListener('click', function(){\r\n  cloud.setOptions({\r\n    skyColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1,\r\n    cloudShadowColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\r\n  });\r\n\r\n  blur.setOptions({\r\n    baseColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\r\n  });\r\n\r\n  fog.setOptions({\r\n    baseColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\r\n  })\r\n\r\n  halo.setOptions({\r\n    baseColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\r\n  })\r\n\r\n  cells.setOptions({\r\n    color2: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\r\n  })\r\n\r\n})\r\n\r\n\r\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/vantavisual.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/vantavisual.js");
/******/ 	
/******/ })()
;