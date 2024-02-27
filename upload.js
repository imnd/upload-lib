/**
 * File uploading component
 * @author Andrey Serdyuk imndsu@gmail.com
 * @copyright (c) 2023 IMND
 * @constructor
 * @this  { upload }
 *
 * Usage:
 * <form>
 *      <input type="file" id="file" />
 *      <input type="button" id="file-upload" value="Send" />
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
 *   .attach('file-upload');
 * </script>
 */

import dom from 'imnd-dom';
import ajax from 'imnd-ajax';

const
  parameters = {
    /**
     * api endpoint
     */
    "upload-url": "upload.php",
    /**
     * file input element id
     */
    "file-id": "file",
    /**
     * the size of the chunks into which the file is divided
     */
    "chunk-size": 100000,
    /**
     * what to do after a successful download
     */
    "on-complete": () => alert("Done")
  },
  /**
   * Reading and loading a fragment of a file
   *
   * @param {array} options
   * @return {void}
   */
  uploadBlob = function (options) {
    const
      file = options.file,
      startByte = options.startByte,
      stopByte = options.stopByte,
      chunksCount = options.chunksCount || 0,
      fileNum = options.fileNum || 0,
      reader = new FileReader(),
      start = parseInt(startByte) || 0,
      stop = parseInt(stopByte) || file.size - 1
    ;
    // if we use onloadend we need to check readyState.
    reader.onloadend = function () {
      ajax.post(
        parameters["upload-url"],
        {
          "data": reader.result,
          "fileName": file.name,
          "fileType": file.type,
          "chunksCount": chunksCount,
          "fileNum": fileNum,
        },
        data => {
          if (data.complete === true) {
            parameters["on-complete"]();
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
   * Setting the options value
   *
   * @param {string} varName
   * @param {array} options
   * @return {void}
   */
  setValue = function (varName, options) {
    if (options[varName] !== undefined) {
      parameters[varName] = options[varName];
    }
  }
;

const upload = {
    /**
     * Uploading a file in parts to the server
     *
     * @return {void}
     */
    run: () => {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        const files = dom().findById(parameters["file-id"]).files;
        if (!files.length) {
          alert("Выберите файл, пожалуйста.");
          return;
        }
        const file = files[0],
          chunksCount = Math.ceil(file.size / parameters["chunk-size"]);
        for (let fileNum = 0; fileNum < chunksCount; fileNum++) {
          uploadBlob({
            "file": file,
            "startByte": parameters["chunk-size"] * fileNum,
            "stopByte": parameters["chunk-size"] * (fileNum + 1),
            "chunksCount": chunksCount,
            "fileNum": fileNum,
          });
        }
      }
    },

    /**
     * Setting options values
     *
     * @param options
     */
    defaults: options => {
      const varNames = ["file-id", "chunk-size", "upload-url", "on-complete"];
      for (let key in varNames) {
        setValue(varNames[key], options);
      }
      return this;
    },

    /**
     * @param selector
     */
    attach: selector => {
      dom().find(selector).addEventListener('click', this.run, false);
    },
  }
;

export default upload;
