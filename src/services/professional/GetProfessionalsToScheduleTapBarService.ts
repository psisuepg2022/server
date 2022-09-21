import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { GetProfessionalsToScheduleTapBarResponseModel } from "@models/dto/professional/GetProfessionalsToScheduleTapBarResponseModel";

class GetProfessionalsToScheduleTapBarService {
  public async execute(
    _: string,
    __: IPaginationOptions
  ): Promise<
    IPaginationResponse<GetProfessionalsToScheduleTapBarResponseModel>
  > {
    return {
      items: [],
      totalItems: 0,
    };
  }
}

export { GetProfessionalsToScheduleTapBarService };
