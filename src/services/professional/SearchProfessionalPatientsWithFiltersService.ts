import { inject, injectable } from "tsyringe";

import { SearchProfessionalPatientsRequestModel } from "@models/dto/professional/SearchProfessionalPatientsRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IValidatorsProvider } from "@providers/validators";
import { IPatientRepository } from "@repositories/patient";
import { IPersonRepository } from "@repositories/person";
import { SearchPatientsWithFiltersService } from "@services/patient";

@injectable()
class SearchProfessionalPatientsWithFiltersService extends SearchPatientsWithFiltersService<SearchProfessionalPatientsRequestModel> {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("PatientRepository")
    patientRepository: IPatientRepository
  ) {
    super(
      personRepository,
      maskProvider,
      validatorsProvider,
      patientRepository
    );
  }

  protected getOperation = (
    clinicId: string,
    pagination: [number, number],
    filters: SearchProfessionalPatientsRequestModel | null
  ): any =>
    this.patientRepository.getByProfessional(
      clinicId,
      pagination,
      this.getFilters(filters)
    );

  protected countOperation = (
    clinicId: string,
    filters: SearchProfessionalPatientsRequestModel | null
  ): PrismaPromise<number> =>
    this.patientRepository.countByProfessional(
      clinicId,
      this.getDomainClass(),
      filters
        ? {
            ...filters,
            CPF: this.maskProvider.remove(filters.CPF || ""),
          }
        : null
    );
}

export { SearchProfessionalPatientsWithFiltersService };
