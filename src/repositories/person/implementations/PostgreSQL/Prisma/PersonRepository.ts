import { prismaClient } from "@infra/database/client";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";
import { IPersonRepository } from "@repositories/person/models/IPersonRepository";

class PersonRepository implements IPersonRepository {
  constructor(private prisma = prismaClient) {}

  public hasEmail = (email: string): PrismaPromise<PersonModel | null> =>
    this.prisma.person.findFirst({
      where: { email },
    }) as PrismaPromise<PersonModel | null>;
}

export { PersonRepository };
