import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListEmployeesResponseModel } from "@models/dto/employee/ListEmployeesResponseModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { IMaskProvider } from "@providers/mask";
import { IEmployeeRepository } from "@repositories/employee";
import { IPersonRepository } from "@repositories/person";
import { SearchPeopleWithFiltersService } from "@services/person";

@injectable()
class SearchEmployeesWithFiltersService extends SearchPeopleWithFiltersService {
  constructor(
    @inject("PersonRepository")
    personRepository: IPersonRepository,
    @inject("MaskProvider")
    maskProvider: IMaskProvider,
    @inject("EmployeeRepository")
    private employeeRepository: IEmployeeRepository
  ) {
    super(personRepository, maskProvider);
  }

  protected getDomainClass = (): string => UserDomainClasses.EMPLOYEE;

  public async execute(
    clinicId: string,
    { page, size, filters }: IPaginationOptions<SearchPersonRequestModel>
  ): Promise<IPaginationResponse<ListEmployeesResponseModel>> {
    const countOperation = this.getCountOperation(clinicId, { filters });

    const getOperation = this.employeeRepository.get(
      clinicId,
      pagination({ page, size })
    );

    const [totalItems, items] = await transaction([
      countOperation,
      getOperation,
    ]);

    return {
      items: items.map(
        ({
          person,
          ...item
        }: Partial<
          EmployeeModel & { person: PersonModel }
        >): ListEmployeesResponseModel =>
          ({
            ...item,
            CPF: this.maskProvider.cpf(person?.CPF || ""),
            contactNumber: this.maskProvider.contactNumber(
              person?.contactNumber || ""
            ),
            email: person?.email,
            name: person?.name || "",
            birthDate: this.maskProvider.date(
              new Date(person?.birthDate || "")
            ),
          } as ListEmployeesResponseModel)
      ),
      totalItems,
    };
  }
}

export { SearchEmployeesWithFiltersService };
