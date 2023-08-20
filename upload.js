/**
 * File handling component
 *
 * Usage:
 * <form>
 *      <input type="file" id="file" />
 *      <input type="button" id="file-upload" value="Отправить" />
 * </form>
 *
 * <script>
 * import upload from 'imnd-upload';
 *
 * upload
 *   .defaults({
 *     "chunk-size" : 120000,
 *     "file-id" : "file",
 *     "upload-url" : "accept.php",
 *     "on-complete" : () => {
 *       ...
 *     },
 *   })
 * .attach('file-upload');
 * </script>
 *
 * @constructor
 * @this  {upload}
 */

import { findById, find } from 'imnd-dom';
import ajax from 'imnd-ajax';

const
  /**
   * параметры
   */
  settings = {
    /**
     * путь обработчика загрузки
     */
    "upload-url": "upload.php",
    /**
     * id инпута файла
     */
    "file-id": "file",
    /**
     * размер кусков, на которые делится файл.
     */
    "chunk-size": 100000,
    /**
     * что делать после удачной загрузки
     */
    "on-complete": function () {
      alert("Готово");
    }
  },
  /**
   * Считывание и загрузки фрагмента файла
   *
   * @param {array} options параметры
   * @return {void}
   */
  uploadBlob = function (options) {
    const
      file = options["file"],
      startByte = options["startByte"],
      stopByte = options["stopByte"],
      chunksCount = options["chunksCount"] || 0,
      fileNum = options["fileNum"] || 0,
      reader = new FileReader(),
      start = parseInt(startByte) || 0,
      stop = parseInt(stopByte) || file.size - 1
    ;
    // если мы используем onloadend, нам нужно проверить readyState.
    reader.onloadend = function () {
      ajax.post(
        settings["upload-url"],
        {
          "data": reader.result,
          "fileName": file.name,
          "fileType": file.type,
          "chunksCount": chunksCount,
          "fileNum": fileNum,
        },
        function (data) {
          if (data.complete === true) {
            settings["on-complete"]();
          }
        },
        "json",
        "multipart/form-data"
      );
    };
    let blob;
    if (file.slice) {
      blob = file.slice(start, stop);
    } else if (file.webkitSlice) {
      blob = file.webkitSlice(start, stop);
    } else if (file.mozSlice) {
      blob = file.mozSlice(start, stop);
    }
    reader.readAsDataURL(blob);
  },
  /**
   * Установка значения параметра
   *
   * @param {string} varName
   * @param {array} options параметры
   * @return {void}
   */
  setValue = function (varName, options) {
    if (options[varName] !== undefined) {
      settings[varName] = options[varName];
    }
  }
;

const upload = {

    /**
     * Загрузка файла по частям на сервер
     *
     * @return {void}
     */
    run: () => {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        const files = findById(settings["file-id"]).files;
        if (!files.length) {
          alert("Выберите файл, пожалуйста.");
          return;
        }
        const file = files[0],
          chunksCount = Math.ceil(file.size / settings["chunk-size"]);
        for (let fileNum = 0; fileNum < chunksCount; fileNum++) {
          uploadBlob({
            "file": file,
            "startByte": settings["chunk-size"] * fileNum,
            "stopByte": settings["chunk-size"] * (fileNum + 1),
            "chunksCount": chunksCount,
            "fileNum": fileNum,
          });
        }
      }
    },

    /**
     * Установка значений параметров
     *
     * @param options параметры
     */
    defaults: function (options) {
      const varNames = ["file-id", "chunk-size", "upload-url", "on-complete"];
      for (let key in varNames) {
        setValue(varNames[key], options);
      }
      return this;
    },

    /**
     * Установка значений параметров
     *
     * @param selector
     */
    attach: (selector) => {
      find(selector).addEventListener('click', this.run, false);
    },

  }
;

export default upload;
