import { ClinicModel } from "@models/domain/ClinicModel";
import { PrismaPromise } from "@prisma/client";

interface IClinicRepository {
  save(clinic: Omit<ClinicModel, "code">): PrismaPromise<ClinicModel>;
  hasEmail(clinicId: string, email: string): PrismaPromise<ClinicModel | null>;
  get([take, skip]: [number, number]): PrismaPromise<ClinicModel[]>;
  get2login(): PrismaPromise<{ code: number; name: string }[]>;
  count(): PrismaPromise<number>;
  getById(id: string): PrismaPromise<ClinicModel>;
  delete(id: string): PrismaPromise<ClinicModel>;
}

export { IClinicRepository };
