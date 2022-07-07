import { PersonModel } from "@models/domain/PersonModel";
import { CreatePersonRequestModel } from "@models/dto/person/CreatePersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";
import { CreatePersonService } from "@services/person";

class CreateUserService extends CreatePersonService {
  constructor(uniqueIdentifierProvider: IUniqueIdentifierProvider) {
    super(uniqueIdentifierProvider);
  }

  protected async createOperation(
    _: CreatePersonRequestModel
  ): Promise<PersonModel> {
    console.log("CreateUserService", this.uniqueIdentifierProvider.generate());
    return {} as PrismaPromise<PersonModel>;
  }
}

export { CreateUserService };
