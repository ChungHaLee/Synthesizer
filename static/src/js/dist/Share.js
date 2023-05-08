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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MusicClip\": () => (/* binding */ MusicClip),\n/* harmony export */   \"MusicClipType\": () => (/* binding */ MusicClipType),\n/* harmony export */   \"SyntheysizerEvents\": () => (/* binding */ SyntheysizerEvents),\n/* harmony export */   \"dial_set\": () => (/* binding */ dial_set),\n/* harmony export */   \"joystick_set\": () => (/* binding */ joystick_set),\n/* harmony export */   \"note_set\": () => (/* binding */ note_set),\n/* harmony export */   \"pad_set\": () => (/* binding */ pad_set)\n/* harmony export */ });\n//공용 변수 관리를 위해 만든 코드\n\nconst SyntheysizerEvents = window;\n\nconst note_set = {\n  pitch: 0,\n  note: 0,\n  value: 0\n};\n\nconst pad_set = {\n  id: 0,\n};\n\nconst dial_set = {\n  value: [[0.0, 0.0, 0.0, 0.0],  //순서대로 [[11, 12, 13, 14],\n          [0.0, 0.0, 0.0, 0.0]]   //순서대로  [21, 22, 23, 24]]\n}; \n\nconst joystick_set = {\n  value:[0, 0]\n};  \n\nconst MusicClipType = {\n  Melody: \"Melody\",\n  Beat: \"Beat\",\n  Base: \"Base\"\n}\n\nconst MusicNote = {\n  note:\"C0\",\n  intensity : 0.0,\n  start: 0.0,\n  end: -1.0\n}\n\nclass MusicClip {\n  constructor (Type, Clip_id, duration = 15, instrument_id = 0) {\n      console.log(\"music Type : \", Type, \"Clip_id\", Clip_id,  duration = 15);\n      this.Type = Type;\n      this.Clip_id = Clip_id;\n      this.duration = duration;\n      this.instrument_id = instrument_id;\n      if(Type==MusicClipType.Melody){\n        this.melodyNoteSet = [];\n        this.melodyTimeset = [];\n      }\n      if(Type==MusicClipType.Beat){\n        this.beatSet = [];\n        this.beatTime = [];\n      }\n  }\n  setType(type){\n    console.log(\"Set Type: \", type);\n    this.Type = type;\n  }\n\n  setNoteInput(note, time) {\n    if(this.Type==MusicClipType.Melody){\n      //console.log(\"Pitch input Time:\", pitch, time);\n      this.melodyNoteSet.push(note);\n      this.melodyTimeset.push([time, -1]);\n    }\n    else{\n      alert(\"This Cilp type is Melody\");\n    }\n  }\n  setNoteRelease(note, time) {\n    if(this.Type==MusicClipType.Melody){\n      //console.log(\"Pitch Release Time:\", pitch, time);\n      for (let i = this.melodyNoteSet.length - 1; i >= 0; i--) {\n        if (this.melodyNoteSet[i] === note) {\n          if(this.melodyTimeset[i][1] == -1){\n            this.melodyTimeset[i][1] = time;\n            break;\n          }\n          break;\n        }\n      }\n    }\n    else{\n      alert(\"This Cilp type is Melody\");\n    }\n  }\n  setBeatInput(pad_id, time) {\n    if(this.Type==MusicClipType.Beat){\n      //console.log(\"Beat input Time:\", pad_id, time);\n      this.beatSet.push(pad_id);\n      this.beatTime.push(time);\n    }\n    else{\n      alert(\"This Clip type is Beat\");\n    }\n  }\n  setDuration(duration){\n    this.duration = duration;\n  }\n  serInstrument(instrument_id){\n    this.instrument_id = instrument_id;\n  }\n  editNote(noteIndex, deltaTimeset){\n    if(this.Type==MusicClipType.Melody){\n      this.melodyTimeset[noteIndex][0] += deltaTimeset[0];\n      this.melodyTimeset[noteIndex][1] += deltaTimeset[1];\n    }\n    else{\n      this.beatTime[noteIndex] += deltaTimeset[0];\n    }\n  }\n  getClipId(){\n    return this.Clip_id;\n  }\n  getClipType(){\n    return this.Type;\n  }\n  getDuration(){\n    return this.duration;\n  }\n  getNoteIndex(){\n    if(this.Type==MusicClipType.Melody){\n      return this.melodyNoteSet.length - 1;\n    }\n    else{\n      return this.beatSet.length - 1;\n    }\n  }\n  getMusicClip(){\n    if(this.Type==MusicClipType.Melody){\n      return [this.melodyNoteSet, this.melodyTimeset]\n    }\n    else{\n      return [this.beatSet, this.beatTime]\n    }\n  }\n\n  getcurrentNoteSet(currentTime){\n    const noteSet = []\n    if(this.Type==MusicClipType.Melody){\n      return [this.melodyNoteSet, this.melodyTimeset]\n    }\n    else{\n      return [this.beatSet, this.beatTime]\n    }\n  }\n  getCurrentNoteByTime(timeSetArray, currentTime) {\n    const indexes = [];\n    for (let i = 0; i < timeSetArray.length; i++) {\n      if (timeSetArray[i][0] <= currentTime && currentTime < timeSetArray[i][1]) {\n        indexes.push(i);\n      }\n    }\n    return indexes;\n  }\n\n}\n\n\n//# sourceURL=webpack://Synthesizer/./src/js/Share.js?");

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