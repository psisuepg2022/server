import { ClinicModel } from "@models/domain/ClinicModel";
import { PrismaPromise } from "@prisma/client";

interface IClinicRepository {
  save(clinic: ClinicModel): PrismaPromise<ClinicModel>;
}

export { IClinicRepository };
