import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { OwnerModel } from "@models/domain/OwnerModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";
import { IOwnerRepository } from "@repositories/owner/models/IOwnerRepository";

class OwnerRepository implements IOwnerRepository {
  constructor(private prisma = prismaClient) {}

  public get = (
    clinicId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<
    Partial<
      OwnerModel & { person: PersonModel & { clinic: { code: number } } }
    >[]
  > =>
    this.prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        person: {
          select: {
            birthDate: true,
            CPF: true,
            contactNumber: true,
            email: true,
            name: true,
            clinic: { select: { code: true } },
          },
        },
      },
      where: {
        person: {
          domainClass: UserDomainClasses.OWNER,
          active: true,
          clinicId,
        },
      },
      orderBy: { person: { name: "asc" } },
      take,
      skip,
    }) as PrismaPromise<
      Partial<
        OwnerModel & { person: PersonModel & { clinic: { code: number } } }
      >[]
    >;
}

export { OwnerRepository };
