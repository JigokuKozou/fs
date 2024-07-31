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

/***/ "./web/src/index.js":
/*!**************************!*\
  !*** ./web/src/index.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_style_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/style.js */ \"./web/src/js/style.js\");\n/* harmony import */ var _js_script_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/script.js */ \"./web/src/js/script.js\");\n\n\n\n//# sourceURL=webpack://fs/./web/src/index.js?");

/***/ }),

/***/ "./web/src/js/buttons.js":
/*!*******************************!*\
  !*** ./web/src/js/buttons.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _fileManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fileManager.js */ \"./web/src/js/fileManager.js\");\n/* harmony import */ var _sort_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sort.js */ \"./web/src/js/sort.js\");\n\n\nfunction initEventListeners() {\n  // Кнопка назад вырезает последнюю директорию из пути и обновляет таблицу\n  _fileManager_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].backButton.addEventListener('click', function () {\n    var splittedRootPath = _fileManager_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].rootPathInput.value.split('/');\n    splittedRootPath.pop();\n    _fileManager_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].changeRootPath(splittedRootPath.join('/'));\n    _fileManager_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].loadDirEntities();\n  });\n\n  // Кнопка размера меняет тип сортировки на противоположный и обновляет таблицу\n  _sort_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].size.button.addEventListener('click', function () {\n    _sort_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].toggleType();\n    _fileManager_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].loadDirEntities();\n  });\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initEventListeners);\n\n//# sourceURL=webpack://fs/./web/src/js/buttons.js?");

/***/ }),

/***/ "./web/src/js/dirTable.js":
/*!********************************!*\
  !*** ./web/src/js/dirTable.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _fs_client_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fs_client.js */ \"./web/src/js/fs_client.js\");\n/* harmony import */ var _loadingScreen_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loadingScreen.js */ \"./web/src/js/loadingScreen.js\");\n/* harmony import */ var _sort_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sort.js */ \"./web/src/js/sort.js\");\n\n\n\nvar dirEntitiesList = document.querySelector('.dir_table tbody');\n\n// Обновляет таблицу списка файлов и директорий\nfunction loadDirEntities(path) {\n  disableEventsWhileLoading();\n  dirEntitiesList.innerHTML = '';\n  _loadingScreen_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].show(dirEntitiesList);\n  return _fs_client_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].fetchDirEntity(path, _sort_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].type()).then(function (response) {\n    if (response.entities === null || response.entities.length === 0) {\n      showInfoPanel(response.error_message);\n      return response;\n    }\n    renderDirEntities(response.entities);\n    return response;\n  })[\"catch\"](function (error) {\n    alert(error.message);\n  })[\"finally\"](function (response) {\n    _loadingScreen_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hide(dirEntitiesList);\n    enableEventsAfterLoading();\n    return response;\n  });\n}\n\n// Создаёт и добавляет строки файлов и директорий в tbody на основе переданного массива\nfunction renderDirEntities(dirEntities) {\n  dirEntities.forEach(function (dirEntity) {\n    var row = document.createElement('tr');\n    var typeCell = document.createElement('td');\n    typeCell.textContent = dirEntity.type;\n    row.appendChild(typeCell);\n    var nameCell = document.createElement('td');\n    nameCell.textContent = dirEntity.name;\n    row.appendChild(nameCell);\n    var sizeCell = document.createElement('td');\n    sizeCell.textContent = dirEntity.size;\n    sizeCell.classList.add('dir_table__size');\n    row.appendChild(sizeCell);\n    if (dirEntity.type === _fs_client_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].DirEntityType.DIR) {\n      row.classList.add('selectable');\n    }\n    dirEntitiesList.appendChild(row);\n  });\n}\n\n// Отключает события обновляющие таблицу\nfunction disableEventsWhileLoading() {\n  _sort_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].size.button.style.pointerEvents = 'none';\n  dirEntitiesList.style.pointerEvents = 'none';\n}\n\n// Включает события обновляющие таблицу\nfunction enableEventsAfterLoading() {\n  _sort_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].size.button.style.pointerEvents = 'auto';\n  dirEntitiesList.style.pointerEvents = 'auto';\n}\nfunction showInfoPanel(message) {\n  // TODO: Показать панель с информацией\n  alert(\"Инфо панель: \" + message);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  dirEntitiesList: dirEntitiesList,\n  loadDirEntities: loadDirEntities\n});\n\n//# sourceURL=webpack://fs/./web/src/js/dirTable.js?");

/***/ }),

/***/ "./web/src/js/fileManager.js":
/*!***********************************!*\
  !*** ./web/src/js/fileManager.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _dirTable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dirTable.js */ \"./web/src/js/dirTable.js\");\n\nvar DEFAULT_ROOT_PATH = \"\";\nvar backButton = document.getElementById('back-button');\nvar rootPathInput = document.getElementById('root-path');\n\n// Изменяет корневой путь в input\nfunction changeRootPath(path) {\n  if (path.length == 0) {\n    path = '/';\n  }\n  rootPathInput.value = path;\n}\nfunction init() {\n  initEventListeners();\n  loadDirEntities();\n}\nfunction initEventListeners() {\n  // Переходим переходит меняет путь до выбранной директории и обновляет таблицу\n  _dirTable_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].dirEntitiesList.addEventListener('click', function (event) {\n    var tr = event.target.closest('tr');\n    if (tr.classList.contains('selectable')) {\n      var dirName = tr.querySelector('td:nth-child(2)').textContent;\n      if (rootPathInput.value === '/') {\n        changeRootPath('/' + dirName);\n      } else {\n        changeRootPath(\"\".concat(rootPathInput.value, \"/\").concat(dirName));\n      }\n      loadDirEntities();\n    }\n  });\n}\n\n// Обновление таблицы с блокировкой событий обновления\nfunction loadDirEntities() {\n  disableEventsWhileLoading();\n  _dirTable_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].loadDirEntities(rootPathInput.value).then(function (response) {\n    return changeRootPath(response.root_dir);\n  })[\"finally\"](enableEventsAfterLoading);\n}\n\n// Отключает события обновляющие таблицу\nfunction disableEventsWhileLoading() {\n  backButton.style.pointerEvents = 'none';\n}\n\n// Включает события обновляющие таблицу\nfunction enableEventsAfterLoading() {\n  backButton.style.pointerEvents = 'auto';\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  rootPathInput: rootPathInput,\n  backButton: backButton,\n  init: init,\n  loadDirEntities: loadDirEntities,\n  changeRootPath: changeRootPath\n});\n\n//# sourceURL=webpack://fs/./web/src/js/fileManager.js?");

/***/ }),

/***/ "./web/src/js/fs_client.js":
/*!*********************************!*\
  !*** ./web/src/js/fs_client.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar SortOrder = {\n  ASC: 'asc',\n  DESC: 'desc'\n};\nvar DirEntityType = {\n  FILE: 'Файл',\n  DIR: 'Дир'\n};\n\n// Запрос на получение информации о содержимом директории\nfunction fetchDirEntity(rootPath, sortType) {\n  rootPath = rootPath === undefined ? '' : rootPath;\n  var url = \"/fs?root=\".concat(encodeURIComponent(rootPath), \"&sort=\").concat(encodeURIComponent(sortType));\n  return fetch(url, {\n    method: \"GET\"\n  }).then(function (response) {\n    if (response.status === 500) {\n      throw new Error(\"Внутренняя ошибка сервера\");\n    }\n    return response.json();\n  });\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  SortOrder: SortOrder,\n  DirEntityType: DirEntityType,\n  fetchDirEntity: fetchDirEntity\n});\n\n//# sourceURL=webpack://fs/./web/src/js/fs_client.js?");

/***/ }),

/***/ "./web/src/js/loadingScreen.js":
/*!*************************************!*\
  !*** ./web/src/js/loadingScreen.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar element = document.querySelector('.loadingScreen');\n\n// Показать сообщение о загрузке внутри parent\nfunction show(parent) {\n  parent.appendChild(element);\n}\n\n// Скрыть сообщение о загрузке внутри parent\nfunction hide(parent) {\n  parent.removeChild(element);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  element: element,\n  show: show,\n  hide: hide\n});\n\n//# sourceURL=webpack://fs/./web/src/js/loadingScreen.js?");

/***/ }),

/***/ "./web/src/js/script.js":
/*!******************************!*\
  !*** ./web/src/js/script.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _fileManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fileManager.js */ \"./web/src/js/fileManager.js\");\n/* harmony import */ var _buttons_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./buttons.js */ \"./web/src/js/buttons.js\");\n\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  _fileManager_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].init();\n  (0,_buttons_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n});\n\n//# sourceURL=webpack://fs/./web/src/js/script.js?");

/***/ }),

/***/ "./web/src/js/sort.js":
/*!****************************!*\
  !*** ./web/src/js/sort.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _fs_client_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fs_client.js */ \"./web/src/js/fs_client.js\");\nvar _size$button;\n\n\n// Кнопка размера и стрелка сортировки\nvar size = {\n  button: document.querySelector('thead .dir_table__size'),\n  arrow: null\n};\nsize.arrow = (_size$button = size.button) === null || _size$button === void 0 ? void 0 : _size$button.querySelector('.arrow');\nvar _type;\nsetType(_fs_client_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SortOrder.DESC);\n\n// Переключает тип сортировки\nfunction toggleType() {\n  setType(_type === _fs_client_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SortOrder.ASC ? _fs_client_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SortOrder.DESC : _fs_client_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SortOrder.ASC);\n}\nfunction type() {\n  return _type;\n}\n\n// Устанавливает тип сортировки и обновляет стрелку сортировки\n// Принимает тип сортировки (fsClient.SortOrder.ASC или fsClient.SortOrder.DESC)\nfunction setType(newType) {\n  switch (newType) {\n    case _fs_client_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SortOrder.DESC:\n      size.arrow.classList.add('rotate');\n      break;\n    case _fs_client_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SortOrder.ASC:\n      size.arrow.classList.remove('rotate');\n      break;\n    default:\n      throw new Error(\"Тип сортировки не распознан\");\n  }\n  _type = newType;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  size: size,\n  toggleType: toggleType,\n  setType: setType,\n  type: type\n});\n\n//# sourceURL=webpack://fs/./web/src/js/sort.js?");

/***/ }),

/***/ "./web/src/js/style.js":
/*!*****************************!*\
  !*** ./web/src/js/style.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _normalize_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../normalize.css */ \"./web/src/normalize.css\");\n/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style.css */ \"./web/src/style.css\");\n\n\n\n//# sourceURL=webpack://fs/./web/src/js/style.js?");

/***/ }),

/***/ "./web/src/normalize.css":
/*!*******************************!*\
  !*** ./web/src/normalize.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://fs/./web/src/normalize.css?");

/***/ }),

/***/ "./web/src/style.css":
/*!***************************!*\
  !*** ./web/src/style.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://fs/./web/src/style.css?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./web/src/index.js");
/******/ 	
/******/ })()
;