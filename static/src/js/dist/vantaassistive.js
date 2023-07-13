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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"sizefinal\": () => (/* binding */ sizefinal),\n/* harmony export */   \"speedfinal\": () => (/* binding */ speedfinal),\n/* harmony export */   \"velocityfinal\": () => (/* binding */ velocityfinal),\n/* harmony export */   \"zoomfinal\": () => (/* binding */ zoomfinal)\n/* harmony export */ });\nconst speedSaveButton = document.getElementById('speedSaveButton')\r\nconst zoomSaveButton = document.getElementById('zoomSaveButton')\r\nconst sizeSaveButton = document.getElementById('sizeSaveButton')\r\nconst velocitySaveButton = document.getElementById('velocitySaveButton')\r\n\r\n\r\n\r\nlet speedvalue, speedfinal;\r\nlet sizevalue, sizefinal;\r\nlet zoomvalue, zoomfinal;\r\nlet velocityvalue, velocityfinal; \r\n\r\n\r\n\r\nfunction getSpeed()  {\r\n   speedvalue = Number(document.getElementById('speedID').value);\r\n   return speedvalue\r\n}\r\n\r\n\r\nfunction getZoom() {\r\n    zoomvalue = Number(document.getElementById('zoomID').value);\r\n    return zoomvalue\r\n}\r\n\r\n\r\n\r\nfunction getSize()  {\r\n    sizevalue = Number(document.getElementById('sizeID').value);\r\n    return sizevalue\r\n }\r\n\r\n\r\n function getVelocity() {\r\n    velocityvalue = Number(document.getElementById('velocityID').value);\r\n    return velocityvalue\r\n }\r\n\r\n\r\n\r\n\r\nspeedSaveButton.addEventListener('click', function(){\r\n    speedfinal = getSpeed();\r\n})\r\n\r\n\r\nzoomSaveButton.addEventListener('click', function(){\r\n    zoomfinal = getZoom();\r\n})\r\n\r\n\r\nsizeSaveButton.addEventListener('click', function(){\r\n    sizefinal = getSize();\r\n})\r\n\r\n\r\nvelocitySaveButton.addEventListener('click', function(){\r\n    velocityfinal = getVelocity();\r\n})\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/vantaassistive.js?");

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