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
    await saveFile(files.file[0]);
    return res.status(201).send({
      message: 'Image téléchargée',
      filename: files.file[0].newFilename
    });
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