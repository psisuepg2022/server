import { AddressModel } from "@models/domain/AddressModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { SearchProfessionalPatientsRequestModel } from "@models/dto/professional/SearchProfessionalPatientsRequestModel";
import { PrismaPromise } from "@prisma/client";

interface IPatientRepository {
  save(
    personId: string,
    patient: PatientModel
  ): PrismaPromise<Partial<PatientModel>>;
  get(
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchPersonRequestModel | null
  ): PrismaPromise<
    Partial<
      PersonModel & {
        patient: PatientModel & { liable: any & { person: PersonModel } };
        address: AddressModel;
      }
    >[]
  >;
  getByProfessional(
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchProfessionalPatientsRequestModel | null
  ): PrismaPromise<
    Partial<
      PersonModel & {
        patient: PatientModel & { liable: any & { person: PersonModel } };
        address: AddressModel;
      }
    >[]
  >;
  countByProfessional(
    clinicId: string,
    domainClass: string,
    filters: SearchProfessionalPatientsRequestModel | null
  ): PrismaPromise<number>;
  count(clinicId: string): PrismaPromise<number>;
  getToUpdate(
    clinicId: string,
    id: string
  ): PrismaPromise<
    | (Partial<PatientModel> & {
        person: Partial<PersonModel> & { address?: AddressModel };
        liable?: any & { person: Partial<PersonModel> };
      })
    | null
  >;
  countToAutocomplete(clinicId: string, name: string): PrismaPromise<number>;
  getToAutocomplete(
    clinicId: string,
    name: string
  ): PrismaPromise<
    Partial<PatientModel> &
      {
        person: Partial<PersonModel>;
        liable: { person: Partial<PersonModel> };
      }[]
  >;
}

export { IPatientRepository };
