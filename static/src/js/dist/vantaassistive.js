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

/***/ "./src/js/vantaassistive.js":
/*!**********************************!*\
  !*** ./src/js/vantaassistive.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"sizefinal\": () => (/* binding */ sizefinal),\n/* harmony export */   \"speedfinal\": () => (/* binding */ speedfinal),\n/* harmony export */   \"velocityfinal\": () => (/* binding */ velocityfinal),\n/* harmony export */   \"zoomfinal\": () => (/* binding */ zoomfinal)\n/* harmony export */ });\nconst speedSaveButton = document.getElementById('speedSaveButton')\nconst zoomSaveButton = document.getElementById('zoomSaveButton')\nconst sizeSaveButton = document.getElementById('sizeSaveButton')\nconst velocitySaveButton = document.getElementById('velocitySaveButton')\n\n\n\nlet speedvalue, speedfinal;\nlet sizevalue, sizefinal;\nlet zoomvalue, zoomfinal;\nlet velocityvalue, velocityfinal; \n\n\n\nfunction getSpeed()  {\n   speedvalue = Number(document.getElementById('speedID').value);\n   return speedvalue\n}\n\n\nfunction getZoom() {\n    zoomvalue = Number(document.getElementById('zoomID').value);\n    return zoomvalue\n}\n\n\n\nfunction getSize()  {\n    sizevalue = Number(document.getElementById('sizeID').value);\n    return sizevalue\n }\n\n\n function getVelocity() {\n    velocityvalue = Number(document.getElementById('velocityID').value);\n    return velocityvalue\n }\n\n\n\n\nspeedSaveButton.addEventListener('click', function(){\n    speedfinal = getSpeed();\n})\n\n\nzoomSaveButton.addEventListener('click', function(){\n    zoomfinal = getZoom();\n})\n\n\nsizeSaveButton.addEventListener('click', function(){\n    sizefinal = getSize();\n})\n\n\nvelocitySaveButton.addEventListener('click', function(){\n    velocityfinal = getVelocity();\n})\n\n\n\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/vantaassistive.js?");

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
/******/ 	__webpack_modules__["./src/js/vantaassistive.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;