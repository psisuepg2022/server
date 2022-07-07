import { inject, injectable } from "tsyringe";

import { EmployeeModel } from "@models/domain/EmployeeModel";
import { CreateEmployeeRequestModel } from "@models/dto/employee/CreateEmployeeRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { CreateUserService } from "@services/user";

@injectable()
class CreateEmployeeService extends CreateUserService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {
    super(uniqueIdentifierProvider);
  }

  public async execute(
    _: CreateEmployeeRequestModel
  ): Promise<Omit<EmployeeModel, "password">> {
    return {
      id: this.uniqueIdentifierProvider.generate(),
    } as Omit<EmployeeModel, "password">;
  }
}

export { CreateEmployeeService };
