import axios from "axios"

export default async function fileUploader(file) {
    const body = new FormData()
    body.append("file", file)

    const response = axios.post('/local/api/fileUpload', body, {
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