import { IncomingForm } from "formidable";
import fs from "fs";

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = new IncomingForm({
    keepExtensions: true
  });
  form.parse(req, async function (err, fields, files) {
    console.log('------------- incoming fields', fields)
    console.log('------------- incoming files', files)
    let response = {
      code: 0,
      message: 'Erreur pendant le téléchargement',
      filenames: []
    }
    for (const file of files.files) {
      await saveFile(file)
      response.code = 1
      response.message = 'Images téléchargées'
      response.filenames.push(file.newFilename)
    }
    return res.status(201).send(response);
  });
};

const saveFile = async (file) => {
  console.log('newFileName', file.newFilename)
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/uploads/${file.newFilename}`, data);
  await fs.unlinkSync(file.filepath);
  return;
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;