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

  public async execute({
    CPF,
    birthDate,
    name,
    address,
    password,
    userName,
    contactNumber,
    email,
  }: CreateEmployeeRequestModel): Promise<Omit<EmployeeModel, "password">> {
    await super.createOperation({
      birthDate,
      CPF,
      name,
      address,
      contactNumber,
      email,
      password,
      userName,
    });

    return {
      id: this.uniqueIdentifierProvider.generate(),
    } as Omit<EmployeeModel, "password">;
  }
}

export { CreateEmployeeService };
