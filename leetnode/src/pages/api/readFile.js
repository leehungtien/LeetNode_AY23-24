import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export default async function handler(req, res) {
  const filePaths = [
    path.join(process.cwd(), 'document_loaders', 'Electrical_Engineering_Principles_and_Practice.pdf'),
    path.join(process.cwd(), 'document_loaders', 'Electrical_Engineering_Principles_and_Practice_II.pdf'),
    // Add more file paths here
  ];

  const parsedData = []; // Array to store extracted text
  try {
    for (const filePath of filePaths) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      parsedData.push(data.text); // Add extracted text to the array
    }
    res.status(200).json({ pdfText: parsedData.join("\n") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

