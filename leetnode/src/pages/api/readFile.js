import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'document_loaders', 'Electrical_Engineering_Principles_and_Practice.pdf');
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    res.status(200).json({ pdfText: data.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

