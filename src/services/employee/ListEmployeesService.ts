import { inject, injectable } from "tsyringe";

import { pagination } from "@helpers/pagination";
import { transaction } from "@infra/database/transaction";
import { IPaginationOptions, IPaginationResponse } from "@infra/http";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { IMaskProvider } from "@providers/mask";
import { IEmployeeRepository } from "@repositories/employee";

@injectable()
class ListEmployeesService {
  constructor(
    @inject("EmployeeRepository")
    private employeeRepository: IEmployeeRepository,
    @inject("MaskProvider")
    private maskProvider: IMaskProvider
  ) {}

  public async execute(
    options?: IPaginationOptions
  ): Promise<IPaginationResponse<Partial<EmployeeModel>>> {
    const countOperation = this.employeeRepository.count();
    const getOperation = this.employeeRepository.get(pagination(options || {}));

    const [totalItens, itens] = await transaction([
      countOperation,
      getOperation,
    ]);

    return {
      itens: itens.map(
        ({
          person,
          ...item
        }: Partial<
          EmployeeModel & { person: PersonModel }
        >): Partial<EmployeeModel> => ({
          ...item,
          CPF: this.maskProvider.cpf(person?.CPF || ""),
          contactNumber: this.maskProvider.contactNumber(
            person?.contactNumber || ""
          ),
          email: person?.email,
          name: person?.name,
          birthDate: this.maskProvider.date(new Date(person?.birthDate || "")),
        })
      ),
      totalItens,
    };
  }
}

export { ListEmployeesService };