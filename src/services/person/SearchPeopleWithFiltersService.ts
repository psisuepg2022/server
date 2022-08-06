import i18n from "i18n";

import { AppError } from "@handlers/error/AppError";
import { IPaginationOptions } from "@infra/http";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IMaskProvider } from "@providers/mask";
import { IPersonRepository } from "@repositories/person";

class SearchPeopleWithFiltersService {
  constructor(
    protected personRepository: IPersonRepository,
    protected maskProvider: IMaskProvider
  ) {}

  protected getDomainClass = (): string => {
    throw new AppError("INTERNAL_SERVER_ERROR", i18n.__("ErrorGeneric"));
  };

  protected getCountOperation(
    clinicId: string,
    { filters }: IPaginationOptions<SearchPersonRequestModel>
  ): PrismaPromise<number> {
    // validar id da clinica e cpf
    // remover mascara do cpf
    const countOperation = this.personRepository.count(
      clinicId,
      this.getDomainClass(),
      filters || null
    );

    return countOperation;
  }
}

export { SearchPeopleWithFiltersService };
