import { AddressModel } from "@models/domain/AddressModel";
import { PrismaPromise } from "@prisma/client";

interface IAddressRepository {
  save(
    personId: string,
    address: AddressModel
  ): PrismaPromise<Partial<AddressModel>>;
}

export { IAddressRepository };
