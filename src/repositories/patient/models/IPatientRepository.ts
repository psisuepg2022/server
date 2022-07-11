import { PatientModel } from "@models/domain/PatientModel";
import { PrismaPromise } from "@prisma/client";

interface IPatientRepository {
  save(
    personId: string,
    patient: PatientModel
  ): PrismaPromise<Partial<PatientModel>>;
}

export { IPatientRepository };
