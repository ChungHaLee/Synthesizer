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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"bgColor\": () => (/* binding */ bgColor),\n/* harmony export */   \"objColor1\": () => (/* binding */ objColor1),\n/* harmony export */   \"setBgColor\": () => (/* binding */ setBgColor),\n/* harmony export */   \"setObjColor1\": () => (/* binding */ setObjColor1)\n/* harmony export */ });\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\n\n// 변수명 정의\nvar bgColor, objColor1\n\n\n\nvar bgColorArr, objColor1Arr\n\nobjColor1 = '#FFFFFF'\nbgColor = '#FFFFFF'\n\n\n\n\nfunction rgbToHex([r, g, b]) {\n  return \"#\" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);\n}\n\n\ndocument.querySelector('#backgroundColor').addEventListener('click', e => {\n  Coloris({\n    themeMode: 'light',\n    alpha: true,\n    formatToggle: false\n  });\n\n});\n\n\n\ndocument.querySelector('#objectColor1').addEventListener('click', e => {\n  Coloris({\n    themeMode: 'light',\n    alpha: true,\n    formatToggle: false\n  });\n\n});\n\n\n\n\n\nfunction setBgColor(color){\n  bgColor = color\n}\nfunction setObjColor1(color){\n  objColor1 = color\n}\n\n\n\nfunction colortoList(colorpick){\n  let colors = colorpick.replace('rgb(', '').replace(')', '')\n  let colorArr = colors.split(',')\n  return colorArr\n}\n\n\nbgColorSaveButton.addEventListener('click', function (){\n    bgColor = document.getElementsByClassName('clr-field')[0].style.color\n    bgColorArr = colortoList(bgColor);\n    bgColor = rgbToHex(bgColorArr);\n    \n})\n\n\nobjColor1SaveButton.addEventListener('click', function (){\n    objColor1 = document.getElementsByClassName('clr-field')[1].style.color\n    objColor1Arr = colortoList(objColor1);\n    objColor1 = rgbToHex(objColor1Arr);\n\n})\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/colorpicker.js?");

/***/ }),

/***/ "./src/js/vantaassistive.js":
/*!**********************************!*\
  !*** ./src/js/vantaassistive.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"sizefinal\": () => (/* binding */ sizefinal),\n/* harmony export */   \"speedfinal\": () => (/* binding */ speedfinal),\n/* harmony export */   \"zoomfinal\": () => (/* binding */ zoomfinal)\n/* harmony export */ });\nconst speedSaveButton = document.getElementById('speedSaveButton')\nconst zoomSaveButton = document.getElementById('zoomSaveButton')\nconst sizeSaveButton = document.getElementById('sizeSaveButton')\n\n\n\nlet speedvalue, speedfinal;\nlet sizevalue, sizefinal;\nlet zoomvalue, zoomfinal;\n\n\n\nfunction getSpeed()  {\n   speedvalue = Number(document.getElementById('speedID').value);\n   return speedvalue\n}\n\n\nfunction getZoom() {\n    zoomvalue = Number(document.getElementById('zoomID').value);\n    return zoomvalue\n}\n\n\n\nfunction getSize()  {\n    sizevalue = Number(document.getElementById('sizeID').value);\n    return sizevalue\n }\n\n\n\n\n\nspeedSaveButton.addEventListener('click', function(){\n    speedfinal = getSpeed();\n})\n\n\nzoomSaveButton.addEventListener('click', function(){\n    zoomfinal = getZoom();\n})\n\n\nsizeSaveButton.addEventListener('click', function(){\n    sizefinal = getSize();\n})\n\n\n\n\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/vantaassistive.js?");

/***/ }),

/***/ "./src/js/vantavisual.js":
/*!*******************************!*\
  !*** ./src/js/vantavisual.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _colorpicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorpicker */ \"./src/js/colorpicker.js\");\n/* harmony import */ var _vantaassistive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vantaassistive */ \"./src/js/vantaassistive.js\");\n\n\n\n\n\n// 테마별 변수명 정의\nlet cloud, fog, blur, halo, cells, dots;\n\n\n\n\nlet cloudButton = document.getElementById('thema_clouds')\nlet blurButton = document.getElementById('thema_blur')\nlet fogButton = document.getElementById('thema_fog')\nlet haloButton = document.getElementById('thema_halo')\nlet cellsButton = document.getElementById('thema_cells')\nlet noneButton = document.getElementById('thema_none')\n\n\n\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\nconst speedSaveButton =document.getElementById('speedSaveButton');\nconst zoomSaveButton =document.getElementById('zoomSaveButton');\nconst sizeSaveButton = document.getElementById('sizeSaveButton');\n\n\n\ncloudButton.addEventListener('click', cloudfunc)\nblurButton.addEventListener('click', blurfunc)\nfogButton.addEventListener('click', fogfunc)\nhaloButton.addEventListener('click', halofunc)\ncellsButton.addEventListener('click', cellsfunc)\nnoneButton.addEventListener('click', nonefunc)\n\n\n\n\n\ncloud = VANTA.CLOUDS({\n  el: \"#shape-canvas\",\n  minHeight: 580.00,\n  minWidth: 960.00,\n  mouseControls: false,\n  touchControls: false,\n  gyroControls: false,\n  skyColor: 0x63b4d2,\n  cloudColor: 0xadbedc,\n  cloudShadowColor: 0x18354a,\n  sunColor: 0xf79622,\n  sunGlareColor: 0xfa6331,\n  sunlightColor: 0xfc9c3e\n})\n\nblur = VANTA.FOG({\n  el: \"#shape-canvas\",\n  mouseControls: false,\n  touchControls: false,\n  gyroControls: false,\n  minHeight: 580.00,\n  minWidth: 960.00,\n  highlightColor: 0xffffff,\n\n  midtoneColor: '#fac4c4',\n  lowlightColor: '#fac4c4',\n  baseColor: '#8828ff',\n  blurFactor: 0.90,\n  speed: 2.50,\n  zoom: 2.00\n})\n\nfog = VANTA.FOG({    \n  el: \"#shape-canvas\",\n  mouseControls: false,\n  touchControls: false,\n  gyroControls: false,\n  minHeight: 580.00,\n  minWidth: 960.00,\n  highlightColor: 0xb63277,\n  midtoneColor: '#0084ff',\n  lowlightColor: '#0084ff',\n  baseColor: '#e3d842',\n  blurFactor: 0.27,\n  speed: 2.20,\n  zoom: 2.00\n})\n\n\nhalo = VANTA.HALO({\n  el: \"#shape-canvas\",\n  mouseControls: false,\n  touchControls: false,\n  gyroControls: false,\n  minHeight: 580.00,\n  minWidth: 960.00,\n  baseColor: 0x458258,\n  backgroundColor: 0x123126,\n  amplitudeFactor: 1.10,\n  size: 3.00\n})\n\ncells = VANTA.CELLS({\n  el: \"#shape-canvas\",\n  mouseControls: false,\n  touchControls: false,\n  gyroControls: false,\n  minHeight: 580.00,\n  minWidth: 960.00,\n  scale: 1.00,\n  color1: 0xb6ebeb,\n  color2: 0xecd3fa,\n  size: 5.00,\n  speed: 3\n})\n\n\ndots = VANTA.DOTS({\n  el: \"#shape-canvas\",\n  mouseControls: false,\n  touchControls: false,\n  gyroControls: false,\n  minHeight: 580.00,\n  minWidth: 960.00,\n  scale: 1.00,\n  color: 0x0,\n  color2: 0x0,\n  backgroundColor: 0x0,\n  size: 0.50,\n  spacing: 5.00,\n  showLines: false\n})\n\n\n\n\n\nfunction cloudfunc(){\n  cloud = VANTA.CLOUDS({\n    el: \"#shape-canvas\",\n    minHeight: 580.00,\n    minWidth: 960.00,\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    skyColor: 0x63b4d2,\n    cloudColor: 0xadbedc,\n    cloudShadowColor: 0x18354a,\n    sunColor: 0xf79622,\n    sunGlareColor: 0xfa6331,\n    sunlightColor: 0xfc9c3e\n  })\n\n  blur.destroy();\n  fog.destroy();\n  halo.destroy();\n  cells.destroy();\n  dots.destroy();\n}\n\n\n\n\n\n\n\n\nfunction blurfunc(){\n  blur = VANTA.FOG({\n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    highlightColor: 0xffffff,\n\n    midtoneColor: '#fac4c4',\n    lowlightColor: '#fac4c4',\n    baseColor: '#8828ff',\n    blurFactor: 0.90,\n    speed: 2.50,\n    zoom: 2.00\n  })\n\n  cloud.destroy();\n  fog.destroy();\n  halo.destroy();\n  cells.destroy();\n  dots.destroy();\n}\n\n\n\nfunction fogfunc(){\n  fog = VANTA.FOG({    \n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    highlightColor: 0xb63277,\n    midtoneColor: '#0084ff',\n    lowlightColor: '#0084ff',\n    baseColor: '#e3d842',\n    blurFactor: 0.27,\n    speed: 2.50,\n    zoom: 2.00\n  })\n\n\n  blur.destroy();\n  cloud.destroy();\n  halo.destroy();\n  cells.destroy();\n  dots.destroy();\n\n}\n\n\nfunction halofunc(){\n  halo = VANTA.HALO({\n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    baseColor: 0x458258,\n    backgroundColor: 0x123126,\n    amplitudeFactor: 1.10,\n    size: 3.00\n  })\n\n  blur.destroy();\n  fog.destroy();\n  cloud.destroy();\n  cells.destroy();\n  dots.destroy();\n}\n\n\nfunction cellsfunc(){\n  cells = VANTA.CELLS({\n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    scale: 1.00,\n    color1: 0xb6ebeb,\n    color2: 0xecd3fa,\n    size: 5.00,\n    speed: 3\n  })\n\n  blur.destroy();\n  fog.destroy();\n  halo.destroy();\n  cloud.destroy();\n  dots.destroy();\n}\n\n\nfunction nonefunc(){\n  dots = VANTA.DOTS({\n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    scale: 1.00,\n    color: 0x0,\n    color2: 0x0,\n    backgroundColor: 0x0,\n    size: 0.50,\n    spacing: 5.00,\n    showLines: false\n  })\n\n  blur.destroy();\n  fog.destroy();\n  halo.destroy();\n  cells.destroy();\n  cloud.destroy();\n}\n\n\n\n\n\nbgColorSaveButton.addEventListener('click', function(){\n  cloud.setOptions({\n    cloudColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\n  });\n\n  blur.setOptions({\n    midtoneColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor,\n    lowlightColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\n  });\n\n  fog.setOptions({\n    midtoneColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor,\n    lowlightColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\n\n  })\n\n  halo.setOptions({\n    backgroundColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\n  })\n\n  cells.setOptions({\n    color1: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.bgColor\n  })\n\n})\n\n\n\n\n\n\nobjColor1SaveButton.addEventListener('click', function(){\n  cloud.setOptions({\n    skyColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1,\n    cloudShadowColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\n  });\n\n  blur.setOptions({\n    baseColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\n  });\n\n  fog.setOptions({\n    baseColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\n  })\n\n  halo.setOptions({\n    baseColor: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\n  })\n\n  cells.setOptions({\n    color2: _colorpicker__WEBPACK_IMPORTED_MODULE_0__.objColor1\n  })\n\n})\n\n\n\nspeedSaveButton.addEventListener('click', function(){\n\n blur.setOptions({\n   speed: _vantaassistive__WEBPACK_IMPORTED_MODULE_1__.speedfinal\n })\n\n fog.setOptions({\n   speed: _vantaassistive__WEBPACK_IMPORTED_MODULE_1__.speedfinal\n })\n\n\n})\n\n\n\n\nzoomSaveButton.addEventListener('click', function(){\n  blur.setOptions({\n    zoom: _vantaassistive__WEBPACK_IMPORTED_MODULE_1__.zoomfinal\n  })\n \n  fog.setOptions({\n    zoom: _vantaassistive__WEBPACK_IMPORTED_MODULE_1__.zoomfinal\n  })\n})\n\n\n\n\n\nsizeSaveButton.addEventListener('click', function(){\n\n  halo.setOptions({\n    size: _vantaassistive__WEBPACK_IMPORTED_MODULE_1__.sizefinal\n  })\n\n})\n\n\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/vantavisual.js?");

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