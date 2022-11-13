import { GetPdfOfCommentsRequestModel } from "@models/dto/comments/GetPdfOfCommentsRequestModel";

class GetPdfOfCommentsService {
  public async execute(_: GetPdfOfCommentsRequestModel): Promise<Buffer> {
    return Buffer.from("");
  }
}

export { GetPdfOfCommentsService };
