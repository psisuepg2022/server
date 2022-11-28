import ejs, { Data } from "ejs";
import path from "path";
import { launch } from "puppeteer";

import { CreatePDFBufferOptionsModel } from "../models/CreatePDFBufferOptionsModel";
import { IPDFProvider } from "../models/IPDFProvider";

class PDFProvider implements IPDFProvider {
  compile = <T>(template: string, options: T): Promise<string> =>
    ejs.renderFile(
      path.join(__dirname, "..", "..", "..", "..", "templates", template),
      options as Data
    );

  getPDFBuffer = async (
    html: string,
    options: CreatePDFBufferOptionsModel
  ): Promise<Buffer> => {
    const browser = await launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);

    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.emulateMediaType("screen");

    const pdf = await page.pdf(options);

    await browser.close();

    return pdf;
  };
}

export { PDFProvider };
