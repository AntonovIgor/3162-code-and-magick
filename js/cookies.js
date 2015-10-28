/* exported Cookies: true */
'use strict';

var Cookies = {

  /**
  * Получение значение из Cookie по ключу
  * @param {string} sKey
  * @return {string}
  */
  getItem: function(sKey) {
    if (!sKey) {
      return null;
    }

    return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
  },

  /**
  * Установка значения в cookie
  * @param {string} sKey
  * @param {string||number} sValue
  * @param {date} vEnd
  * @param {string} sPath
  * @param {string} sDomain
  * @param {boolean} bSecure
  */
  setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var sExpires = '';
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
          break;
        case String:
          sExpires = '; expires=' + vEnd;
          break;
        case Date:
          sExpires = '; expires=' + vEnd.toUTCString();
          break;
        default:
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
    return true;
  },

  /**
  * Удалить значение из Cookie
  * @param {string} sKey
  * @param {string} sPath
  * @param {string} sDomain
  * @return {boolean}
  */
  removeItem: function(sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) {
      return false;
    }
    document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
    return true;
  },

  /**
  * Провярет наличие значения в Cookie по ключу
  * @param {string} sKey
  * @return {boolean}
  */
  hasItem: function(sKey) {
    if (!sKey) {
      return false;
    }
    return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
  },

  /**
  * Возвращает список достпных ключей
  * @return {Array}
  */
  keys: function() {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  },

  /**
  * Сохраняет значения в Cookies. Значения передаются в массиве в
  * в виде объектов; Каждый объект должен содержать name (ключ) и
  * value (значение)
  * @param {Array.<Object>} arrayOfElements
  */
  saveValuesToCookies: function(arrayOfElements) {
    var saveObj;
    var myDateOfBirth = new Date(1986, 3, 12, 0, 0, 0, 0);
    var today = new Date();
    var days = Math.round((today - myDateOfBirth) / 1000 / 86400);
    var endDateForCookie = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);

    for (var i = 0; i < arrayOfElements.length; i++) {
      saveObj = arrayOfElements[i];
      this.setItem(saveObj.name, saveObj.element.value, endDateForCookie);
    }

  },

  /**
  * Считывание из cookie значений для коллекции элементов
  * @param {Array.<Object>} arrayOfElements
  * @return {Array.<Object>}
  */
  restoreValuesFromCookies: function(arrayOfElements) {
    var saveObj;

    for (var i = 0; i < arrayOfElements.length; i++) {
      saveObj = arrayOfElements[i];

      if (this.hasItem(saveObj.name)) {
        saveObj.element.value = this.getItem(saveObj.name);
      }

    }
  }

};
