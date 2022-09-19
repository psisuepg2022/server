import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { OwnerModel } from "@models/domain/OwnerModel";
import { PersonModel } from "@models/domain/PersonModel";
import { UserModel } from "@models/domain/UserModel";
import { PrismaPromise } from "@prisma/client";
import { IOwnerRepository } from "@repositories/owner/models/IOwnerRepository";

class OwnerRepository implements IOwnerRepository {
  constructor(private prisma = prismaClient) {}

  public get = (
    clinicId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<Partial<OwnerModel & { person: PersonModel }>[]> =>
    this.prisma.user.findMany({
      select: {
        accessCode: true,
        id: true,
        userName: true,
        person: {
          select: {
            birthDate: true,
            CPF: true,
            contactNumber: true,
            email: true,
            name: true,
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
    }) as PrismaPromise<Partial<OwnerModel & { person: PersonModel }>[]>;

  public getToUpdate = (
    clinicId: string,
    id: string
  ): PrismaPromise<
    | (Partial<UserModel> & {
        person: Partial<PersonModel> & { address: AddressModel };
      })
    | null
  > =>
    this.prisma.user.findFirst({
      where: {
        id,
        person: {
          clinicId,
          active: true,
          domainClass: UserDomainClasses.OWNER,
        },
      },
      select: {
        userName: true,
        person: {
          select: {
            birthDate: true,
            contactNumber: true,
            CPF: true,
            email: true,
            name: true,
            address: {
              select: {
                id: true,
                city: true,
                district: true,
                state: true,
                publicArea: true,
                zipCode: true,
              },
            },
          },
        },
      },
    }) as PrismaPromise<
      | (Partial<UserModel> & {
          person: Partial<PersonModel> & { address: AddressModel };
        })
      | null
    >;
}

export { OwnerRepository };
