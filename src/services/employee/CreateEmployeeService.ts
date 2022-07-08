import { inject, injectable } from "tsyringe";

import { EmployeeModel } from "@models/domain/EmployeeModel";
import { CreateEmployeeRequestModel } from "@models/dto/employee/CreateEmployeeRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IPersonRepository } from "@repositories/person";
import { CreateUserService } from "@services/user";

@injectable()
class CreateEmployeeService extends CreateUserService {
  constructor(
    @inject("UniqueIdentifierProvider")
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    @inject("ValidatorsProvider")
    validatorsProvider: IValidatorsProvider,
    @inject("PersonRepository")
    personRepository: IPersonRepository
  ) {
    super(uniqueIdentifierProvider, validatorsProvider, personRepository);
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
