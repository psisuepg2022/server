import { PersonModel } from "@models/domain/PersonModel";
import { CreateUserRequestModel } from "@models/dto/user/CreateUserRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { IValidatorsProvider } from "@providers/validators";
import { IPersonRepository } from "@repositories/person";
import { CreatePersonService } from "@services/person";

class CreateUserService extends CreatePersonService {
  constructor(
    uniqueIdentifierProvider: IUniqueIdentifierProvider,
    validatorsProvider: IValidatorsProvider,
    personRepository: IPersonRepository
  ) {
    super(uniqueIdentifierProvider, validatorsProvider, personRepository);
  }

  protected async createOperation(
    {
      CPF,
      birthDate,
      name,
      address,
      contactNumber,
      email,
      clinicId,
    }: CreateUserRequestModel,
    domainClass: string
  ): Promise<PersonModel> {
    await super.createOperation(
      {
        birthDate,
        CPF,
        name,
        address,
        contactNumber,
        email,
        clinicId,
      },
      domainClass
    );
    return {} as PrismaPromise<PersonModel>;
  }
}

export { CreateUserService };
