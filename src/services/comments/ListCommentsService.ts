import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { ListCommentsRequestModel } from "@models/dto/comments/ListCommentsRequestModel";

class ListCommentsService {
  public async execute(
    _: ListCommentsRequestModel,
    __: IPaginationOptions
  ): Promise<IPaginationResponse<ListCommentsResponseModel>> {
    return { items: [], totalItems: 0 };
  }
}

export { ListCommentsService };
