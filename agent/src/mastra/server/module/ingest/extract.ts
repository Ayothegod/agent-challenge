import { PDFParse } from "pdf-parse";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { ApiError } from "../../util/services";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const pdfDataPath = path.join(__dirname, "");

export interface Link {
  text: string;
  url: string;
}

function cleanPdfText(text: string) {
  return text
    .replace(/\t+/g, " ") // remove tabs
    .replace(/--\s*\d+\s*of\s*\d+\s*--\s*\d*/gi, "\n") // handle page markers
    .replace(/\s{2,}/g, " ") // collapse extra spaces
    .replace(/\n{2,}/g, "\n") // collapse blank lines
    .replace(/([a-z])-\s+([a-z])/gi, "$1$2") // fix hyphenated breaks
    .trim();
}

class Extract {
  static async extractFromPDF(file: File) {
    try {
      const buffer = await file.arrayBuffer();
      const parser = new PDFParse({ data: buffer });

      const info = await parser.getInfo({ parsePageInfo: true });
      const textResult = await parser.getText();
      const result = await parser.getTable();
      await parser.destroy();

      const links: Link[] = [];
      info.pages.map((info) => info.links.map((link) => links.push(link)));

      // const tables: string[] = [];
      // for (const page of result.pages) {
      //   if (!page.tables) continue;

      //   for (const [tableIndex, table] of page.tables.entries()) {
      //     const tableText = table.map((row) => tables.push(row));
      //   }
      // }
      console.log(cleanPdfText(textResult.text));

      const data = {
        totalPages: info.total,
        Title: info.info?.Title,
        Author: info.info?.Author,
        links,
        // tables: tables?.filter((r) => r.length > 1),
        // text: textResult.text.trim(),
        text: cleanPdfText(textResult.text),
      };
      return { cleanPdf: data };
    } catch (error) {
      console.log({ error });

      throw new ApiError(404, "Error while parsing pdf file!");
    }
  }
  static async extractFromDocx(filePath?: any) {
    //     const result = await mammoth.extractRawText({ path: filePath });
    // return {
    //   text: result.value,
    //   metadata: { source: "docx" },
    // };
    return "docx";
  }
  static async extractFromCsv(file: File) {
    const cleanCsv: any = [];

    const buffer = await file.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer)).pipe(csvParser());
    for await (const item of stream) {
      cleanCsv.push(item);
    }

    return { cleanCsv };
  }
  // static async ingestEmail(payload?: any) {
  //   return "email";
  // }
  // static async ingestDrive() {
  //   return "drive";
  // }
  // static async ingestNotion() {
  //   return "notion";
  // }
}
export default Extract;
