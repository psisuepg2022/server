import { inject, injectable } from "tsyringe";

import { getEnumDescription } from "@helpers/getEnumDescription";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { GenderDomain, MaritalStatusDomain } from "@infra/domains";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListPatientsResponseModel } from "@models/dto/patient/ListPatientsResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
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
    clinicId: string,
    { page, size, filters }: IPaginationOptions<SearchPersonRequestModel>
  ): Promise<IPaginationResponse<ListPatientsResponseModel>> {
    const countOperation = this.patientRepository.count(clinicId);
    const getOperation = this.patientRepository.get(
      clinicId,
      pagination({ page, size }),
      filters || null
    );

    const [totalItems, items] = await transaction([
      countOperation,
      getOperation,
    ]);

    return {
      items: items.map(
        ({
          patient,
          ...item
        }: Partial<
          PersonModel & { patient: PatientModel }
        >): ListPatientsResponseModel =>
          ({
            ...item,
            CPF: this.maskProvider.cpf(item.CPF || ""),
            birthDate: this.maskProvider.date(new Date(item.birthDate || "")),
            contactNumber: this.maskProvider.contactNumber(
              item.contactNumber || ""
            ),
            gender: getEnumDescription(
              "GENDER",
              GenderDomain[patient?.gender as number]
            ),
            maritalStatus: getEnumDescription(
              "MARITAL_STATUS",
              MaritalStatusDomain[patient?.maritalStatus as number]
            ),
          } as ListPatientsResponseModel)
      ),
      totalItems,
    };
  }
}

export { ListPatientsService };
