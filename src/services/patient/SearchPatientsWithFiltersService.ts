import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { GenderDomain, MaritalStatusDomain } from "@infra/domains";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { AddressModel } from "@models/domain/AddressModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListPatientsResponseModel } from "@models/dto/patient/ListPatientsResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IPatientRepository } from "@repositories/patient";
import { IPersonRepository } from "@repositories/person";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchPatientsWithFiltersService extends SearchPeopleWithFiltersService {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("PatientRepository")
    private patientRepository: IPatientRepository
  ) {
    super(
      personRepository,
      maskProvider,
      uniqueIdentifierProvider,
      validatorsProvider
    );
  }

  protected getDomainClass = (): string => UserDomainClasses.PATIENT;

  public async execute(
    clinicId: string,
    { page, size, filters }: IPaginationOptions<SearchPersonRequestModel>
  ): Promise<IPaginationResponse<ListPatientsResponseModel>> {
    const countOperation = this.getCountOperation(clinicId, { filters });

    const getOperation = this.patientRepository.get(
      clinicId,
      pagination({ page, size }),
      filters
        ? {
            ...filters,
            CPF: this.maskProvider.remove(filters.CPF || ""),
          }
        : null
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
          PersonModel & {
            patient: PatientModel & {
              liable: any & { person: Partial<PersonModel> };
            };
            address: AddressModel;
          }
        >): ListPatientsResponseModel =>
          ({
            ...this.convert(item as PersonModel, item.address),
            gender: getEnumDescription(
              "GENDER",
              GenderDomain[patient?.gender as number]
            ),
            maritalStatus: getEnumDescription(
              "MARITAL_STATUS",
              MaritalStatusDomain[patient?.maritalStatus as number]
            ),
            liable: patient?.liable?.person
              ? {
                  ...(patient?.liable.person || {}),
                  CPF: this.maskProvider.cpf(patient?.liable.person.CPF || ""),
                  contactNumber: this.maskProvider.contactNumber(
                    patient?.liable.person.contactNumber || ""
                  ),
                  birthDate: this.maskProvider.date(
                    patient?.liable.person.birthDate || ""
                  ),
                }
              : null,
          } as ListPatientsResponseModel)
      ),
      totalItems,
    };
  }
}

export { SearchPatientsWithFiltersService };
