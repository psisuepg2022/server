import ejs, { Data } from "ejs";
import pdf from "html-pdf";
import path from "path";

import { CreatePDFBufferOptionsModel } from "../models/CreatePDFBufferOptionsModel";
import { IPDFProvider } from "../models/IPDFProvider";

class PDFProvider implements IPDFProvider {
  compile = <T>(template: string, options: T): Promise<string> =>
    ejs.renderFile(
      path.join(__dirname, "..", "..", "..", "..", "templates", template),
      options as Data
    );

  getPDFBuffer = (
    html: string,
    options: CreatePDFBufferOptionsModel
  ): Promise<Buffer> =>
    new Promise((resolve, reject) => {
      pdf.create(html, options).toBuffer((err, buffer) => {
        if (err !== null) reject(err);
        else resolve(buffer);
      });
    });
}

export { PDFProvider };
