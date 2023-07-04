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

/***/ "./src/js/vantavisual.js":
/*!*******************************!*\
  !*** ./src/js/vantavisual.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"cloudfunc\": () => (/* binding */ cloudfunc),\n/* harmony export */   \"fogfunc\": () => (/* binding */ fogfunc),\n/* harmony export */   \"halofunc\": () => (/* binding */ halofunc),\n/* harmony export */   \"wavesfunc\": () => (/* binding */ wavesfunc)\n/* harmony export */ });\n\n\n\nlet cloud, fog, waves, halo, cells, dots;\n\nlet cloudButton = document.getElementById('thema_clouds')\nlet wavesButton = document.getElementById('thema_waves')\nlet fogButton = document.getElementById('thema_fog')\nlet haloButton = document.getElementById('thema_halo')\nlet cellsButton = document.getElementById('thema_cells')\nlet noneButton = document.getElementById('thema_none')\n\ndots = VANTA.DOTS({\n  el: \"#shape-canvas\",\n  mouseControls: false,\n  touchControls: false,\n  gyroControls: false,\n  minHeight: 580.00,\n  minWidth: 960.00,\n  scale: 1.00,\n  color: 0x0,\n  color2: 0x0,\n  backgroundColor: 0x0,\n  size: 0.50,\n  spacing: 5.00,\n  showLines: false\n})\n\n\ncloudButton.addEventListener('click', cloudfunc)\nwavesButton.addEventListener('click', wavesfunc)\nfogButton.addEventListener('click', fogfunc)\nhaloButton.addEventListener('click', halofunc)\ncellsButton.addEventListener('click', cellsfunc)\nnoneButton.addEventListener('click', nonefunc)\n\n\n\nfunction cloudfunc(){\n  cloud = VANTA.CLOUDS({\n    el: \"#shape-canvas\",\n    minHeight: 580.00,\n    minWidth: 960.00,\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    backgroundColor: 0xc0c0c0,\n    skyColor: 0x66797f,\n    cloudColor: 0xbcbcff,\n    cloudShadowColor: 0x8e8e8e,\n    sunColor: 0xfffafa,\n    sunGlareColor: 0xff0086,\n    sunlightColor: 0xff3030,\n    speed: 1.30\n  })\n\n}\n\nfunction wavesfunc(){\n  waves = VANTA.WAVES({\n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    scale: 1.00,\n    scaleMobile: 1.00,\n    color: 0x146619\n  })\n\n}\n\nfunction fogfunc(){\n  fog = VANTA.FOG({    \n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    highlightColor: 0xb63277,\n    midtoneColor: 0xca3f68,\n    lowlightColor: 0xcd44d7,\n    blurFactor: 0.27,\n    speed: 2.20,\n    zoom: 1.90\n  })\n\n}\n\n\nfunction halofunc(){\n  halo = VANTA.HALO({\n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    baseColor: 0x1b56e6,\n    backgroundColor: 0x4e60c0\n  })\n}\n\n\nfunction cellsfunc(){\n  cells = VANTA.CELLS({\n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    scale: 1.00,\n    color1: 0xe8877b,\n    color2: 0xd99a9a,\n    size: 5.00\n  })\n}\n\n\nfunction nonefunc(){\n  dots = VANTA.DOTS({\n    el: \"#shape-canvas\",\n    mouseControls: false,\n    touchControls: false,\n    gyroControls: false,\n    minHeight: 580.00,\n    minWidth: 960.00,\n    scale: 1.00,\n    color: 0x0,\n    color2: 0x0,\n    backgroundColor: 0x0,\n    size: 0.50,\n    spacing: 5.00,\n    showLines: false\n  })\n}\n\n\n\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/vantavisual.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/vantavisual.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;