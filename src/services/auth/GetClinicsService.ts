import { inject, injectable } from "tsyringe";

import { transaction } from "@infra/database/transaction";
import { IPaginationResponse } from "@infra/http";
import { GetClinicsReponseModel } from "@models/dto/auth/GetClinicsReponseModel";
import { IClinicRepository } from "@repositories/clinic";

@injectable()
class GetClinicsService {
  constructor(
    @inject("ClinicRepository")
    private clinicRepository: IClinicRepository
  ) {}

  public async execute(): Promise<IPaginationResponse<GetClinicsReponseModel>> {
    const [totalItems, items] = await transaction([
      this.clinicRepository.count(),
      this.clinicRepository.get2login(),
    ]);

    return { totalItems, items };
  }
}

export { GetClinicsService };
