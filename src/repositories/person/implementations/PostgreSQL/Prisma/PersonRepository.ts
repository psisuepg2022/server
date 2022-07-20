import { prismaClient } from "@infra/database/client";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";
import { IPersonRepository } from "@repositories/person/models/IPersonRepository";

class PersonRepository implements IPersonRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    clinicId: string,
    { CPF, birthDate, contactNumber, email, domainClass, id, name }: PersonModel
  ): PrismaPromise<Partial<PersonModel>> =>
    this.prisma.person.create({
      data: {
        birthDate,
        CPF,
        id,
        name,
        domainClass,
        contactNumber,
        email,
        clinicId,
      },
      select: {
        birthDate: true,
        CPF: true,
        contactNumber: true,
        email: true,
        name: true,
      },
    }) as PrismaPromise<Partial<PersonModel>>;

  public hasEmail = (email: string): PrismaPromise<PersonModel | null> =>
    this.prisma.person.findFirst({
      where: { email },
    }) as PrismaPromise<PersonModel | null>;

  public hasCPF = (CPF: string): PrismaPromise<PersonModel | null> =>
    this.prisma.person.findFirst({
      where: { CPF },
    }) as PrismaPromise<PersonModel | null>;
}

export { PersonRepository };
