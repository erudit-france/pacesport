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
    console.log('------------------------');
    console.log('------------------------');
    console.log('fileupload files', files.file[0])
    console.log('------------------------');
    console.log('------------------------');
    await saveFile(files.file[0]);
    return res.status(201).send("Success");
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