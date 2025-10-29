import { v4 as uuidv4 } from "uuid";
import Extract, { Link } from "./extract";

interface UnifiedDoc {
  id: string;
  source: string; // "csv" | "pdf" | "docx"
  fileName: string;
  canonicalTitle: string; // filename or document title
  summary: string; // plain text
  bullets?: string[]
  tags?: string[]
  metadata: {
    page: number; // for pdf
    row: number; // for csv
    createdAt: string;
    author?: string;
    links?: Link[];
    // [key: string]: any;
  };
}

function chunkText(text: string, maxLength = 800) {
  const lines = text.split(/\n+/); // split on one or more newlines
  const chunks = [];
  let current = "";

  for (const line of lines) {
    if ((current + line).length > maxLength) {
      chunks.push(current.trim());
      current = line;
    } else {
      current += (current ? " " : "") + line;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

class Transform {
  static async Pdf(file:File) {
    const data: UnifiedDoc[] = [];

    const { cleanPdf } = await Extract.extractFromPDF(file);

    const chunks = chunkText(cleanPdf.text);

    for (const [i, row] of chunks.entries()) {
      const PdfRow: UnifiedDoc = {
        id: uuidv4(),
        source: "pdf",
        fileName: file.name as string,
        canonicalTitle: cleanPdf.Title,
        summary: row,
        metadata: {
          page: cleanPdf.totalPages,
          row: i + 1,
          createdAt: new Date().toDateString(),
          author: cleanPdf?.Author,
          links: cleanPdf.links,
        },
      };
      data.push(PdfRow);
    }

    return data;
  }
  static async Docx() {
    //     paragraphs.forEach((text, i) => {
    //   docs.push({
    //     id: uuid(),
    //     source: "docx",
    //     title: fileName,
    //     content: text,
    //     metadata: { paragraph: i }
    //   });
    // });
  }
  static async Csv(file: File) {
    const data: UnifiedDoc[] = [];

    const { cleanCsv } = await Extract.extractFromCsv(file);

    for (const [i, row] of cleanCsv.entries()) {
      const csvRow: UnifiedDoc = {
        id: uuidv4(),
        source: "csv",
        fileName: file.name as string,
        canonicalTitle: Object.keys(row).join(" ").trim(),
        summary: Object.values(row).join(" "),
        metadata: {
          page: 1,
          row: i + 1,
          createdAt: new Date().toDateString(),
        },
      };
      data.push(csvRow);
    }

    return data;
  }
}

export const connectors = {
  pdf: Transform.Pdf,
  docx: Transform.Docx,
  csv: Transform.Csv,
  // email: Connect.ingestEmail,
  // drive: Connect.ingestDrive,
  // notion: Connect.ingestNotion,
};
