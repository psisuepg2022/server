import { ClinicModel } from "@models/domain/ClinicModel";
import { PrismaPromise } from "@prisma/client";

interface IClinicRepository {
  save(clinic: Omit<ClinicModel, "code">): PrismaPromise<ClinicModel>;
}

export { IClinicRepository };
