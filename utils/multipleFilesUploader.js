import axios from "axios"

export default async function multipleFilesUploader(files) {
  if (files.length == 0) {
    let res = new Response({data: {code: 1}}, {status: 201});
    return res
  }
  const body = new FormData()
  files.forEach(file => {
    body.append("files", file)
  });

  const response = axios.post('/local/api/multipleFileUpload', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })

  // const response = await fetch("/local/api/fileUpload", {
  //     method: "POST",
  //     body
  // })
  return response
}

export const config = {
  api: {
    bodyParser: false,
  }
}