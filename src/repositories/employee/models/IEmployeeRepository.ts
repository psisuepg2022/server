import { AddressModel } from "@models/domain/AddressModel";
import { EmployeeModel } from "@models/domain/EmployeeModel";
import { PersonModel } from "@models/domain/PersonModel";
import { UserModel } from "@models/domain/UserModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";

interface IEmployeeRepository {
  get(
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchPersonRequestModel | null
  ): PrismaPromise<
    Partial<
      EmployeeModel & { person: PersonModel & { address: AddressModel } }
    >[]
  >;
  getToUpdate(
    clinicId: string,
    id: string
  ): PrismaPromise<
    | (Partial<UserModel> & {
        person: Partial<PersonModel> & { address: AddressModel };
      })
    | null
  >;
}

export { IEmployeeRepository };
