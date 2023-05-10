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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MusicClip\": () => (/* binding */ MusicClip),\n/* harmony export */   \"MusicClipType\": () => (/* binding */ MusicClipType),\n/* harmony export */   \"MusicTrack\": () => (/* binding */ MusicTrack),\n/* harmony export */   \"SyntheysizerEvents\": () => (/* binding */ SyntheysizerEvents),\n/* harmony export */   \"TemplateClip\": () => (/* binding */ TemplateClip),\n/* harmony export */   \"dial_set\": () => (/* binding */ dial_set),\n/* harmony export */   \"joystick_set\": () => (/* binding */ joystick_set),\n/* harmony export */   \"note_set\": () => (/* binding */ note_set),\n/* harmony export */   \"pad_set\": () => (/* binding */ pad_set),\n/* harmony export */   \"poly_note_set\": () => (/* binding */ poly_note_set)\n/* harmony export */ });\nconst SyntheysizerEvents = window;\n\nconst note_set = {\n  pitch: 0,\n  note: 0,\n  value: 0\n};\nconst poly_note_set = {\n  pitch: [],\n  note : [],\n  value : []\n}\n\nconst pad_set = {\n  id: 0,\n};\n\nconst dial_set = {\n  value: [[50.0, 50.0, 50.0, 50.0], \n          [50.0, 50.0, 50.0, 50.0]]  //순서대로  [21, 22, 23, 24]]\n}; \n\nconst joystick_set = {\n  value:[0, 0]\n};  \n\nconst MusicClipType = {\n  Melody: \"Melody\",\n  Beat: \"Beat\",\n  Template: \"Template\"\n}\n\nconst MusicNote = {\n  note:\"C0\",\n  intensity : 0.0,\n  start: 0.0,\n  end: -1.0\n}\nclass TemplateClip{\n  constructor(Clip_id, duration = 30, instrument = 0){\n    this.Clip_id = Clip_id;\n    this.duration = duration;\n    this.instrument = instrument;\n    this.dial_set = [[50.0, 50.0, 50.0, 50.0], \n                     [50.0, 50.0, 50.0, 50.0]]\n  }\n  set_dial(dial_set){\n    this.dial_set = dial_set\n  }\n  set_duration(duration){\n    this.duration = duration;\n  }\n  get_Clip_id(){\n    return this.Clip_id;\n  }\n  get_duration(){\n    return this.duration;\n  }\n  get_instrument(){\n    return this.instrument;\n  }\n  get_dial(){\n    return this.dial_set;\n  }\n}\n\n\nclass MusicClip {\n  constructor (Type, Clip_id, duration = 30) {\n      console.log(\"music Type : \", Type, \"Clip_id\", Clip_id,  \"duration\", duration);\n      this.Type = Type;\n      this.Clip_id = Clip_id;\n      this.duration = duration;\n      if(Type==MusicClipType.Melody){\n        this.melodyNoteSet = [];\n        this.melodyTimeset = [];\n      }\n      if(Type==MusicClipType.Beat){\n        this.beatSet = [];\n        this.beatTime = [];\n      }\n  }\n  setType(type){\n    console.log(\"Set Type: \", type);\n    this.Type = type;\n  }\n\n  setNoteInput(note, time) {\n    if(this.Type==MusicClipType.Melody){\n      //console.log(\"Pitch input Time:\", pitch, time);\n      this.melodyNoteSet.push(note);\n      this.melodyTimeset.push([time, -1]);\n    }\n    else{\n      alert(\"This Cilp type is Melody\");\n    }\n  }\n  setNoteRelease(note, time) {\n    if(this.Type==MusicClipType.Melody){\n      //console.log(\"Pitch Release Time:\", pitch, time);\n      for (let i = this.melodyNoteSet.length - 1; i >= 0; i--) {\n        if (this.melodyNoteSet[i] === note) {\n          if(this.melodyTimeset[i][1] == -1){\n            this.melodyTimeset[i][1] = time;\n            break;\n          }\n          break;\n        }\n      }\n    }\n    else{\n      alert(\"This Cilp type is Melody\");\n    }\n  }\n  setBeatInput(pad_id, time) {\n    if(this.Type==MusicClipType.Beat){\n      //console.log(\"Beat input Time:\", pad_id, time);\n      this.beatSet.push(pad_id);\n      this.beatTime.push(time);\n    }\n    else{\n      alert(\"This Clip type is Beat\");\n    }\n  }\n  setDuration(duration){\n    this.duration = duration;\n  }\n  serInstrument(instrument_id){\n    this.instrument_id = instrument_id;\n  }\n  editNote(noteIndex, deltaTimeset){\n    if(this.Type==MusicClipType.Melody){\n      this.melodyTimeset[noteIndex][0] += deltaTimeset[0];\n      this.melodyTimeset[noteIndex][1] += deltaTimeset[1];\n    }\n    else{\n      this.beatTime[noteIndex] += deltaTimeset[0];\n    }\n  }\n  getClipId(){\n    return this.Clip_id;\n  }\n  getClipType(){\n    return this.Type;\n  }\n  getDuration(){\n    return this.duration;\n  }\n  getNoteIndex(){\n    if(this.Type==MusicClipType.Melody){\n      return this.melodyNoteSet.length - 1;\n    }\n    else{\n      return this.beatSet.length - 1;\n    }\n  }\n  getMusicClip(){\n    if(this.Type==MusicClipType.Melody){\n      return [this.melodyNoteSet, this.melodyTimeset]\n    }\n    else{\n      return [this.beatSet, this.beatTime]\n    }\n  }\n\n  getcurrentNoteSet(currentTime){\n    const noteSet = []\n    if(this.Type==MusicClipType.Melody){\n      //return [this.melodyNoteSet, this.melodyTimeset]\n      for (let i = 0; i < this.melodyTimeset.length; i++) {\n        if (this.melodyTimeset[i][0] <= currentTime && currentTime < this.melodyTimeset[i][1]) {\n          noteSet.push(this.melodyNoteSet[i]);\n        }\n      }\n      return noteSet;\n    }\n    else{\n      //return [this.beatSet, this.beatTime]\n      for (let i = 0; i < this.beatTime.length; i++) {\n        if (this.beatTime[i] - 1/60 <= currentTime && currentTime < this.beatTime[i] + 1/60) {\n          noteSet.push(this.beatSet[i]);\n        }\n      }\n      return noteSet;\n    }\n  }\n}\n\nclass MusicTrack{\n  constructor (userId = 0, id_set = [[],[],[]], time_set = [[], [], []]){\n    this.userId = userId;\n\n    this.TemplateIdClip = id_set[0];\n    this.MelodyClipIdList = id_set[1];\n    this.BeatClipIdList = id_set[2];\n\n    this.TemplateTimeset = time_set[0];\n    this.MelodyTimeset = time_set[1];\n    this.BeatTimeset = time_set[2];\n  }\n  setMusicClip(musicClip, clipTime){\n    if(musicClip.getClipType() == MusicClipType.Melody){\n      this.MelodyClipIdList.push(musicClip.getClipId());\n      let duration = musicClip.getDuration();\n      this.MelodyTimeset.push([clipTime, clipTime + duration]);\n      console.log(\"Add Melody box\", this.MelodyClipIdList);\n    }\n    else{\n      this.BeatClipIdList.push(musicClip.getClipId());\n      let duration = musicClip.getDuration();\n      this.BeatTimeset.push([clipTime, clipTime + duration]);\n      console.log(\"Add Beat box\", this.BeatClipIdList);\n    }\n  }\n  setTemplateClip(templateId, clipTime){  //지금 코드가 조금 꼬여서 임의로 Template은 30초 길이로 고정\n    this.TemplateIdClip.push(templateId);\n    this.TemplateTimeset.push([clipTime, clipTime + 30]);\n    console.log(\"Add Template box\", this.TemplateIdClip);\n  }\n  editMusicClip(type, clip_id, deltaTime){\n    if(type == MusicClipType.Melody){\n      this.MelodyTimeset[clip_id][0] += deltaTime;\n      this.MelodyTimeset[clip_id][1] += deltaTime;\n    }\n    else{\n      this.BeatTimeset[clip_id][0] += deltaTime;\n      this.BeatTimeset[clip_id][1] += deltaTime;\n    }\n  }\n  getTempalateId(){\n    return this.TemplateIdClip.length;\n  }\n  getMelodyId(){\n    return this.MelodyClipIdList.length;\n  }\n  getBeatId(){\n    return this.BeatClipIdList.length;\n  }\n  getcurrentClipSet(currentTime){\n    const Meldoy_set = []\n    const Beat_set = []\n    const Template_set = []\n    for (let i = 0; i < this.TemplateTimeset.length; i++) {\n      if (this.TemplateTimeset[i][0] <= currentTime && currentTime < this.TemplateTimeset[i][1]) {\n        Template_set.push(this.TemplateTimeset[i][0]);  // 시간이 먼저\n        Template_set.push(this.TemplateIdClip[i]);\n      }\n    }\n    for (let i = 0; i < this.MelodyTimeset.length; i++) {\n      if (this.MelodyTimeset[i][0] <= currentTime && currentTime < this.MelodyTimeset[i][1]) {\n        Meldoy_set.push(this.MelodyTimeset[i][0]);\n        Meldoy_set.push(this.MelodyClipIdList[i]);\n      }\n    }\n    for (let i = 0; i < this.BeatTimeset.length; i++) {\n      if (this.BeatTimeset[i][0] <= currentTime && currentTime < this.BeatTimeset[i][1]) {\n        Beat_set.push(this.BeatTimeset[i][0]);\n        Beat_set.push(this.BeatClipIdList[i]);\n      }\n    }\n    return [Template_set, Meldoy_set, Beat_set];  //순서는 항상 Template, Melody, Beat로 고정\n  }\n  getUserId(){\n    return this.userId;\n  }\n  getIdData(){\n    return [this.TemplateIdClip, this.MelodyClipIdList, this.BeatClipIdList]\n  }\n  getTimeData(){\n    return [this.TemplateTimeset, this.MelodyTimeset, this.BeatTimeset]\n  }\n  // setMusicClip(Melody_clip_array){  //Track의 Clip 정리 코드\n  //   const MaxId = Math.max.apply(null, this.MelodyClipIdList);\n  // }\n  // setBeatClip(Beat_clip_array){  //Track의 Clip 정리 코드\n  //   const MaxId = Math.max.apply(null, this.BeatClipIdList);\n  // }\n  // saveTrack(){\n  //   console.log(\"save the Music Track\");\n  // }\n}\n\n//# sourceURL=webpack://Synthesizer/./src/js/Share.js?");

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