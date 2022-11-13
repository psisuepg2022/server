import { CreatePDFBufferOptionsModel } from "./CreatePDFBufferOptionsModel";

interface IPDFProvider {
  compile<T>(template: string, options: T): Promise<string>;
  getPDFBuffer(
    html: string,
    options: CreatePDFBufferOptionsModel
  ): Promise<Buffer>;
}

export { IPDFProvider };
