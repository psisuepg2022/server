import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";

interface IPatientRepository {
  save(
    personId: string,
    patient: PatientModel
  ): PrismaPromise<Partial<PatientModel>>;
  get(
    clinicId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<Partial<PersonModel & { patient: PatientModel }>[]>;
  count(clinicId: string): PrismaPromise<number>;
}

export { IPatientRepository };
