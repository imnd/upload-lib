# imnd-upload

**File uploading component.**

It uses imnd-dom and imnd-ajax libs.
Available options is set by defaults() method as json object: 
  - upload-url: api endpoint;
  - file-id: file input element id;
  - chunk-size: the size of the chunks into which the file is divided;
  - on-complete: what to do after a successful download.

Usage:
```
  <form>
    <input type="file" id="file" />
    <input type="button" id="file-upload" value="Send" />
  </form>
 
  <script>
  import upload from 'imnd-upload';

  upload
    .defaults({
      "chunk-size" : 120000,
      "file-id" : "file",
       "upload-url" : "accept.php",
      "on-complete" : () => {
        ...
      },
    })
    .attach('file-upload');
 </script>
```
