import { Editor } from "@tinymce/tinymce-react";
import * as editorService from "../../services/editorUploadImageService";

<script
  src="https://cdn.tiny.cloud/1/5y319q0nzf0m0caf2v1bi0yrcfdgajj52wqie6s66aqk1qv3/tinymce/6/tinymce.min.js"
  referrerpolicy="origin"
></script>;

export default function TinyMCE(props) {

  const uploadFile = (data) => {
    return editorService.uploadImageEditor(data);
  };

  return (
    <>
      <Editor
        id="editor"
        apiKey="5y319q0nzf0m0caf2v1bi0yrcfdgajj52wqie6s66aqk1qv3"
        onInit={(evt, editor) => (props.editorRef.current = editor)}
        initialValue=""
        init={{
          height: 300,
          menubar: false,
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker permanentpen powerpaste advtable advcode editimage tableofcontents footnotes mergetags autocorrect typography inlinecss",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          // images_upload_handler: async blobInfo => {
          //     console.log(blobInfo);
          //     return new Promise((resolve, reject) => {
          //       uploadFile(blobInfo)
          //         .then(data => {
          //           resolve('https://docs.google.com/uc?id=' + data);
          //         })
          //         .catch(e => {
          //           reject(e);
          //         });
          //     });
          // },
          file_picker_callback: (cb, value, meta) => {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = function () {
              var file = this.files[0];
              uploadFile(file)
              .then((url) => {
                cb('https://docs.google.com/uc?id=' + url, { title: file.name });
              })
              .catch(() => {})
            //   var reader = new FileReader();
            //   reader.onload = function () {
            //     var id = "blobid" + new Date().getTime();
            //     var blobCache = editorRef.current.editorUpload.blobCache;
            //     var base64 = reader.result.split(",")[1];
            //     var blobInfo = blobCache.create(id, file, base64);
            //     blobCache.add(blobInfo);

            //     /* call the callback and populate the Title field with the file name */
            //     cb(blobInfo.blobUri(), { title: file.name });
            //   };
            //   reader.readAsDataURL(file);
            };
            input.click();
          },
        }}
      />
    </>
  );
}
