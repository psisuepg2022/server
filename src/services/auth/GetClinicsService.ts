import { IPaginationResponse } from "@infra/http";
import { GetClinicsReponseModel } from "@models/dto/auth/GetClinicsReponseModel";

class GetClinicsService {
  public async execute(): Promise<IPaginationResponse<GetClinicsReponseModel>> {
    return {
      items: [],
      totalItems: 0,
    };
  }
}

export { GetClinicsService };
