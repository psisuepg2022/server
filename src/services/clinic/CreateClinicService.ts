import { inject, injectable } from "tsyringe";

import { ClinicModel } from "@models/domain/ClinicModel";
import { CreateClinicRequestModel } from "@models/dto/clinic/CreateClinicRequestModel";
import { IUniqueIdentifierProvider } from "@providers/uniqueIdentifier";

@injectable()
class CreateClinicService {
  constructor(
    @inject("UniqueIdentifierProvider")
    private uniqueIdentifierProvider: IUniqueIdentifierProvider
  ) {}

  public async execute({
    email,
    name,
  }: CreateClinicRequestModel): Promise<Omit<ClinicModel, "password">> {
    return {
      code: 1,
      email,
      id: this.uniqueIdentifierProvider.generate(),
      name,
    };
  }
}

export { CreateClinicService };
