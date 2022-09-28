import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { AddressModel } from "@models/domain/AddressModel";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListEmployeesResponseModel } from "@models/dto/employee/ListEmployeesResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IValidatorsProvider } from "@providers/validators";
import { IEmployeeRepository } from "@repositories/employee";
import { IPersonRepository } from "@repositories/person";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchEmployeesWithFiltersService extends SearchPeopleWithFiltersService<
  ListEmployeesResponseModel,
  Partial<EmployeeModel & { person: PersonModel & { address: AddressModel } }>
> {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("EmployeeRepository")
    private employeeRepository: IEmployeeRepository
  ) {
    super(personRepository, maskProvider, validatorsProvider);
  }

  protected getDomainClass = (): string => UserDomainClasses.EMPLOYEE;

  protected getOperation = (
    clinicId: string,
    pagination: [number, number],
    filters: SearchPersonRequestModel | null
  ): any =>
    this.employeeRepository.get(clinicId, pagination, this.getFilters(filters));

  protected convertObject = ({
    person,
    userName,
    accessCode,
  }: Partial<
    EmployeeModel & { person: PersonModel & { address: AddressModel } }
  >): ListEmployeesResponseModel =>
    ({
      userName,
      accessCode,
      ...this.covertBase(person || {}),
    } as ListEmployeesResponseModel);
}

export { SearchEmployeesWithFiltersService };
