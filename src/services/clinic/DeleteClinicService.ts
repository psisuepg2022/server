import { inject, injectable } from "tsyringe";

import { transaction } from "@infra/database/transaction";
import { IClinicRepository } from "@repositories/clinic";

@injectable()
class DeleteClinicService {
  constructor(
    @inject("ClinicRepository")
    private clinicRepository: IClinicRepository
  ) {}

  public async execute(id: string): Promise<boolean> {
    const deleteOperation = this.clinicRepository.delete(id);
    const [deleted] = await transaction([deleteOperation]);

    return !!deleted;
  }
}

export { DeleteClinicService };
