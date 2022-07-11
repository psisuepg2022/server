import { inject, injectable } from "tsyringe";

import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { IMaskProvider } from "@providers/mask";
import { IPatientRepository } from "@repositories/patient";

@injectable()
class ListPatientsService {
  constructor(
    @inject("PatientRepository")
    private patientRepository: IPatientRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute(
    options?: IPaginationOptions
  ): Promise<IPaginationResponse<Partial<PatientModel>>> {
    const countOperation = this.patientRepository.count();
    const getOperation = this.patientRepository.get(pagination(options || {}));

    const [totalItens, itens] = await transaction([
      countOperation,
      getOperation,
    ]);

    return {
      itens: itens.map(
        ({
          patient,
          ...item
        }: Partial<
          PersonModel & { patient: PatientModel }
        >): Partial<PatientModel> => ({
          ...item,
          CPF: this.maskProvider.cpf(item.CPF || ""),
          birthDate: this.maskProvider.date(new Date(item.birthDate || "")),
          contactNumber: this.maskProvider.contactNumber(
            item.contactNumber || ""
          ),
          gender: patient?.gender,
          maritalStatus: patient?.maritalStatus,
        })
      ),
      totalItens,
    };
  }
}

export { ListPatientsService };
