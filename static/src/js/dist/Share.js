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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MusicClip\": () => (/* binding */ MusicClip),\n/* harmony export */   \"MusicClipType\": () => (/* binding */ MusicClipType),\n/* harmony export */   \"SyntheysizerEvents\": () => (/* binding */ SyntheysizerEvents),\n/* harmony export */   \"dial_set\": () => (/* binding */ dial_set),\n/* harmony export */   \"joystick_set\": () => (/* binding */ joystick_set),\n/* harmony export */   \"note_set\": () => (/* binding */ note_set),\n/* harmony export */   \"pad_set\": () => (/* binding */ pad_set)\n/* harmony export */ });\n//공용 변수 관리를 위해 만든 코드\r\n\r\nconst SyntheysizerEvents = window;\r\n\r\nconst note_set = {\r\n  pitch: 0,\r\n  note: 0,\r\n  value: 0\r\n};\r\n\r\nconst pad_set = {\r\n  id: 0,\r\n};\r\n\r\nconst dial_set = {\r\n  value: [[0.0, 0.0, 0.0, 0.0],  //순서대로 [[11, 12, 13, 14],\r\n          [0.0, 0.0, 0.0, 0.0]]   //순서대로  [21, 22, 23, 24]]\r\n}; \r\n\r\nconst joystick_set = {\r\n  value:[0, 0]\r\n};  \r\n\r\nconst MusicClipType = {\r\n  Melody: \"Melody\",\r\n  Beat: \"Beat\",\r\n  Base: \"Base\"\r\n}\r\n\r\nconst MusicNote = {\r\n  note:\"C0\",\r\n  intensity : 0.0,\r\n  start: 0.0,\r\n  end: -1.0\r\n}\r\n\r\nclass MusicClip {\r\n  constructor (Type, Clip_id, duration = 15, instrument_id = 0) {\r\n      console.log(\"music Type : \", Type, \"Clip_id\", Clip_id,  duration = 15);\r\n      this.Type = Type;\r\n      this.Clip_id = Clip_id;\r\n      this.duration = duration;\r\n      this.instrument_id = instrument_id;\r\n      if(Type==MusicClipType.Melody){\r\n        this.melodyNoteSet = [];\r\n        this.melodyTimeset = [];\r\n      }\r\n      if(Type==MusicClipType.Beat){\r\n        this.beatSet = [];\r\n        this.beatTime = [];\r\n      }\r\n  }\r\n  setType(type){\r\n    console.log(\"Set Type: \", type);\r\n    this.Type = type;\r\n  }\r\n\r\n  setNoteInput(note, time) {\r\n    if(this.Type==MusicClipType.Melody){\r\n      //console.log(\"Pitch input Time:\", pitch, time);\r\n      this.melodyNoteSet.push(note);\r\n      this.melodyTimeset.push([time, -1]);\r\n    }\r\n    else{\r\n      alert(\"This Cilp type is Melody\");\r\n    }\r\n  }\r\n  setNoteRelease(note, time) {\r\n    if(this.Type==MusicClipType.Melody){\r\n      //console.log(\"Pitch Release Time:\", pitch, time);\r\n      for (let i = this.melodyNoteSet.length - 1; i >= 0; i--) {\r\n        if (this.melodyNoteSet[i] === note) {\r\n          if(this.melodyTimeset[i][1] == -1){\r\n            this.melodyTimeset[i][1] = time;\r\n            break;\r\n          }\r\n          break;\r\n        }\r\n      }\r\n    }\r\n    else{\r\n      alert(\"This Cilp type is Melody\");\r\n    }\r\n  }\r\n  setBeatInput(pad_id, time) {\r\n    if(this.Type==MusicClipType.Beat){\r\n      //console.log(\"Beat input Time:\", pad_id, time);\r\n      this.beatSet.push(pad_id);\r\n      this.beatTime.push(time);\r\n    }\r\n    else{\r\n      alert(\"This Clip type is Beat\");\r\n    }\r\n  }\r\n  setDuration(duration){\r\n    this.duration = duration;\r\n  }\r\n  serInstrument(instrument_id){\r\n    this.instrument_id = instrument_id;\r\n  }\r\n  editNote(noteIndex, deltaTimeset){\r\n    if(this.Type==MusicClipType.Melody){\r\n      this.melodyTimeset[noteIndex][0] += deltaTimeset[0];\r\n      this.melodyTimeset[noteIndex][1] += deltaTimeset[1];\r\n    }\r\n    else{\r\n      this.beatTime[noteIndex] += deltaTimeset[0];\r\n    }\r\n  }\r\n  getCliptId(){\r\n    return this.Clip_id;\r\n  }\r\n  getClipType(){\r\n    return this.Type;\r\n  }\r\n  getNoteIndex(){\r\n    if(this.Type==MusicClipType.Melody){\r\n      return this.melodyNoteSet.length - 1;\r\n    }\r\n    else{\r\n      return this.beatSet.length - 1;\r\n    }\r\n  }\r\n  getMusicClip(){\r\n    if(this.Type==MusicClipType.Melody){\r\n      return [this.melodyNoteSet, this.melodyTimeset]\r\n    }\r\n    else{\r\n      return [this.beatSet, this.beatTime]\r\n    }\r\n  }\r\n\r\n  getcurrentNoteSet(currentTime){\r\n    if(this.Type==MusicClipType.Melody){\r\n      return [this.melodyNoteSet, this.melodyTimeset]\r\n    }\r\n    else{\r\n      return [this.beatSet, this.beatTime]\r\n    }\r\n  }\r\n\r\n\r\n}\r\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/Share.js?");

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
/******/ 	__webpack_modules__["./src/js/Share.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;