import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { getEnumDescription } from "@helpers/getEnumDescription";
import { GenderDomain, MaritalStatusDomain } from "@infra/domains";
import { AddressModel } from "@models/domain/AddressModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListPatientsResponseModel } from "@models/dto/patient/ListPatientsResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IValidatorsProvider } from "@providers/validators";
import { IPatientRepository } from "@repositories/patient";
import { IPersonRepository } from "@repositories/person";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchPatientsWithFiltersService extends SearchPeopleWithFiltersService<
  ListPatientsResponseModel,
  Partial<
    PersonModel & {
      patient: PatientModel & { liable: any & { person: PersonModel } };
      address: AddressModel;
    }
  >
> {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("PatientRepository")
    private patientRepository: IPatientRepository
  ) {
    super(personRepository, maskProvider, validatorsProvider);
  }

  protected getDomainClass = (): string => UserDomainClasses.PATIENT;

  protected getOperation = (
    clinicId: string,
    pagination: [number, number],
    filters: SearchPersonRequestModel | null
  ): any =>
    this.patientRepository.get(clinicId, pagination, this.getFilters(filters));

  protected convertObject = ({
    address,
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
      ...this.covertBase({ ...item, address }),
      gender: getEnumDescription(
        "GENDER",
        GenderDomain[item.patient?.gender as number]
      ),
      maritalStatus: getEnumDescription(
        "MARITAL_STATUS",
        MaritalStatusDomain[item.patient?.maritalStatus as number]
      ),
      liable: item.patient?.liable?.person
        ? {
            ...(item.patient?.liable.person || {}),
            CPF: this.maskProvider.cpf(item.patient?.liable.person.CPF || ""),
            contactNumber: this.maskProvider.contactNumber(
              item.patient?.liable.person.contactNumber || ""
            ),
            birthDate: this.maskProvider.date(
              item.patient?.liable.person.birthDate || ""
            ),
          }
        : null,
    } as ListPatientsResponseModel);
}

export { SearchPatientsWithFiltersService };
