import { inject, injectable } from "tsyringe";

import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { ClinicModel } from "@models/domain/ClinicModel";
import { IClinicRepository } from "@repositories/clinic";

@injectable()
class ListClinicsService {
  constructor(
    @inject("ClinicRepository")
    private clinicRepository: IClinicRepository
  ) {}

  public async execute(
    options?: IPaginationOptions
  ): Promise<IPaginationResponse<ClinicModel>> {
    const countOperation = this.clinicRepository.count();
    const getOperation = this.clinicRepository.get(pagination(options || {}));

    const [totalItems, items] = await transaction([
      countOperation,
      getOperation,
    ]);

    return { items, totalItems };
  }
}

export { ListClinicsService };
