import { PersonModel } from "@models/domain/PersonModel";
import { CreatePersonRequestModel } from "@models/dto/person/CreatePersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";

class CreatePersonService {
  constructor(protected uniqueIdentifierProvider: IUniqueIdentifierProvider) {}

  protected async createOperation(
    _: CreatePersonRequestModel
  ): Promise<PersonModel> {
    console.log(
      "CreatePersonService",
      this.uniqueIdentifierProvider.generate()
    );
    return {} as PrismaPromise<PersonModel>;
  }
}

export { CreatePersonService };
