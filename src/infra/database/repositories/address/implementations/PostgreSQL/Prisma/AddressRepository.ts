import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { PrismaPromise } from "@prisma/client";
import { IAddressRepository } from "@repositories/address/models/IAddressRepository";

class AddressRepository implements IAddressRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    personId: string,
    { city, district, id, publicArea, state, zipCode }: AddressModel
  ): PrismaPromise<Partial<AddressModel>> =>
    this.prisma.address.upsert({
      where: { id },
      create: {
        state,
        zipCode,
        city,
        district,
        id,
        personId,
        publicArea,
      },
      update: {
        state,
        zipCode,
        city,
        district,
        publicArea,
      },
      select: {
        city: true,
        district: true,
        publicArea: true,
        state: true,
        zipCode: true,
      },
    }) as PrismaPromise<Partial<AddressModel>>;
}

export { AddressRepository };
