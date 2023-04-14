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

/***/ "./src/js/Share.js":
/*!*************************!*\
  !*** ./src/js/Share.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SyntheysizerEvents\": () => (/* binding */ SyntheysizerEvents),\n/* harmony export */   \"dial_set\": () => (/* binding */ dial_set),\n/* harmony export */   \"note_set\": () => (/* binding */ note_set),\n/* harmony export */   \"pad_set\": () => (/* binding */ pad_set)\n/* harmony export */ });\n//공용 변수 관리를 위해 만든 코드\r\n\r\nconst SyntheysizerEvents = window;\r\n\r\nconst note_set = {\r\n  pitch: 0,\r\n  note: 0,\r\n  value: 0\r\n};\r\n\r\nconst pad_set = {\r\n  id: 0,\r\n};\r\n\r\nconst dial_set = {\r\n  value: [[0.0, 0.0, 0.0, 0.0],  //순서대로 [[11, 12, 13, 14],\r\n          [0.0, 0.0, 0.0, 0.0]]   //순서대로  [21, 22, 23, 24]]\r\n}; \n\n//# sourceURL=webpack://Synthesizer/./src/js/Share.js?");

/***/ }),

/***/ "./src/js/SheetMusic.js":
/*!******************************!*\
  !*** ./src/js/SheetMusic.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Share_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Share.js */ \"./src/js/Share.js\");\n\r\n\r\n_Share_js__WEBPACK_IMPORTED_MODULE_0__.SyntheysizerEvents.addEventListener('noteInput', function (e){\r\n  // console.log(\"In Circle note: \", e.detail.note);  //범위가 C0~C10입니다.\r\n  console.log(\"In SheetMusic note: \", e.detail.pitch, 'noteInput'); //범위가 0~127입니다.\r\n\r\n  // console.log(\"In Circle note: \", e.detail.value); //범위가 0~127입니다.\r\n})\r\n_Share_js__WEBPACK_IMPORTED_MODULE_0__.SyntheysizerEvents.addEventListener('noteRelease', function (e){\r\n  // console.log(\"In Circle note: \", e.detail.note);  //범위가 C0~C10입니다.\r\n  console.log(\"In SheetMusic note: \", e.detail.pitch, 'noteRelease'); //범위가 0~127입니다.\r\n\r\n  // console.log(\"In Circle note: \", e.detail.value); //범위가 0~127입니다.\r\n})\r\n\r\n_Share_js__WEBPACK_IMPORTED_MODULE_0__.SyntheysizerEvents.addEventListener('padInput', function (e){\r\n  console.log(\"In SheetMusic Pad id: \", e.detail.id); //그냥 패드 id입니다. 0~7로 8개가 표시됩니다.\r\n})\r\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/SheetMusic.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/SheetMusic.js");
/******/ 	
/******/ })()
;