import { inject, injectable } from "tsyringe";

import { UserDomainClasses } from "@common/UserDomainClasses";
import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { ListEmployeesResponseModel } from "@models/dto/employee/ListEmployeesResponseModel";
import { IMaskProvider } from "@providers/mask";
import { IEmployeeRepository } from "@repositories/employee";
import { IUserRepository } from "@repositories/user";

@injectable()
class ListEmployeesService {
  constructor(
    @inject("EmployeeRepository")
    private employeeRepository: IEmployeeRepository,
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute(
    clinicId: string,
    options?: IPaginationOptions
  ): Promise<IPaginationResponse<ListEmployeesResponseModel>> {
    const countOperation = this.userRepository.count(
      clinicId,
      UserDomainClasses.EMPLOYEE
    );
    const getOperation = this.employeeRepository.get(
      clinicId,
      pagination(options || {})
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

export { ListEmployeesService };
