import { inject, injectable } from "tsyringe";

import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { GetProfessionalsToScheduleTapBarResponseModel } from "@models/dto/professional/GetProfessionalsToScheduleTapBarResponseModel";
import { IProfessionalRepository } from "@repositories/professional";

@injectable()
class GetProfessionalsToScheduleTapBarService {
  constructor(
    @inject("ProfessionalRepository")
    private professionalRepository: IProfessionalRepository
  ) {}

  public async execute(
    clinicId: string,
    { page, size }: IPaginationOptions
  ): Promise<
    IPaginationResponse<GetProfessionalsToScheduleTapBarResponseModel>
  > {
    const [totalItems, items] = await transaction([
      this.professionalRepository.countNames(clinicId),
      this.professionalRepository.getNames(
        clinicId,
        pagination({ page, size })
      ),
    ]);

    return { items, totalItems };
  }
}

export { GetProfessionalsToScheduleTapBarService };
