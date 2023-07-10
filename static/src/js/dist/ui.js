/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/ui.js":
/*!**********************!*\
  !*** ./src/js/ui.js ***!
  \**********************/
/***/ (() => {

eval("// 보여지는 메뉴\nconst themaGroup = document.getElementsByClassName('themaButton')\n\n\n\nlet blurButton = document.getElementById('thema_blur')\nlet fogButton = document.getElementById('thema_fog')\n\nlet haloButton = document.getElementById('thema_halo')\n\nlet cloudButton = document.getElementById('thema_clouds')\nlet cellsButton = document.getElementById('thema_cells')\nlet noneButton = document.getElementById('thema_none')\n\nlet clickList = []\n\n\n// 색상 저장 버튼\nconst bgColorSaveButton = document.getElementById('backgroundColorSaveButton');\nconst objColor1SaveButton = document.getElementById('objectColor1SaveButton');\n\n\n// assisitve menu (save)\nlet speedDIV = document.getElementById('speedDIV')\nlet zoomDIV = document.getElementById('zoomDIV')\nlet sizeDIV = document.getElementById('sizeDIV')\nlet velocityDIV = document.getElementById('velocityDIV')\nlet objColor1DIV = document.getElementById('objColor1DIV')\n\n\n\n// functions start!\n\nblurButton.addEventListener('click', function(){\n    speedDIV.style.display = 'block'\n    zoomDIV.style.display = 'block'\n    sizeDIV.style.display = 'none'\n    velocityDIV.style.display = 'none'\n    objColor1DIV.style.display = 'block'\n});\n\n\n\nfogButton.addEventListener('click', function(){\n    speedDIV.style.display = 'block'\n    zoomDIV.style.display = 'block'\n    sizeDIV.style.display = 'none'\n    velocityDIV.style.display = 'none'\n    objColor1DIV.style.display = 'block'\n});\n\n\nhaloButton.addEventListener('click', function(){\n    speedDIV.style.display = 'none'\n    zoomDIV.style.display = 'none'\n    sizeDIV.style.display = 'block'\n    velocityDIV.style.display = 'none'\n    objColor1DIV.style.display = 'block'\n})\n\n\ncellsButton.addEventListener('click', function(){\n    speedDIV.style.display = 'none'\n    zoomDIV.style.display = 'none'\n    sizeDIV.style.display = 'none'\n    velocityDIV.style.display = 'block'\n    objColor1DIV.style.display = 'block'\n})\n\n\ncloudButton.addEventListener('click', function(){\n    speedDIV.style.display = 'none'\n    zoomDIV.style.display = 'none'\n    sizeDIV.style.display = 'none'\n    velocityDIV.style.display = 'block'\n    objColor1DIV.style.display = 'block'\n})\n\n\nnoneButton.addEventListener('click', function(){\n    speedDIV.style.display = 'none'\n    zoomDIV.style.display = 'none'\n    sizeDIV.style.display = 'none'\n    velocityDIV.style.display = 'none'\n    objColor1DIV.style.display = 'none'\n})\n\n\n\n\n\n\n\n// function changeDisplay(identifier){\n//     for (let i=0; i < themaGroup.length; i++ ){\n//         if (themaGroup[i].id.slice(6, ) == identifier){\n\n//             // themaGroup[i].style.display = 'block'\n//         } else {\n\n//             // themaGroup[i].style.display = 'none'\n//         }\n//     }\n// }\n\n\n// function changeBorder(identifier){\n//     for (let i=0; i < effectButtonGroup.length; i++ ){\n//         if (effectButtonGroup[i].id.slice(6, ) == identifier){\n//             effectButtonGroup[i].style.border = '3px solid black';\n//         } else {\n//             effectButtonGroup[i].style.border = 'none';\n//         }\n//     }\n// }\n\n\n// for (let i = 0; i < bloom2D.length; i++) {\n//     bloom2D[i].addEventListener('click', hideColorMenuBG, false);\n// }\n\n\n// for (let i = 0; i < bloom3D.length; i++) {\n//     bloom3D[i].addEventListener('click', hideColorMenuOBJ1, false);\n// }\n\n//# sourceURL=webpack://Synthesizer/./src/js/ui.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/ui.js"]();
/******/ 	
/******/ })()
;