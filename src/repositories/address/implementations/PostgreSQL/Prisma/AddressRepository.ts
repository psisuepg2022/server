import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { PrismaPromise } from "@prisma/client";
import { IAddressRepository } from "@repositories/address/models/IAddressRepository";

class AddressRepository implements IAddressRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    personId: string,
    { city, district, id, publicArea }: AddressModel
  ): PrismaPromise<AddressModel> =>
    this.prisma.address.create({
      data: {
        city,
        district,
        id,
        personId,
        publicArea,
      },
    }) as PrismaPromise<AddressModel>;
}

export { AddressRepository };
