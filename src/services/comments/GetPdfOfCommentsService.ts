import { GetPdfOfCommentsRequestModel } from "@models/dto/comments/GetPdfOfCommentsRequestModel";
import { GetPdfOfCommentsResponseModel } from "@models/dto/comments/GetPdfOfCommentsResponseModel";

class GetPdfOfCommentsService {
  public async execute(
    _: GetPdfOfCommentsRequestModel
  ): Promise<GetPdfOfCommentsResponseModel> {
    return { content: "" };
  }
}

export { GetPdfOfCommentsService };
