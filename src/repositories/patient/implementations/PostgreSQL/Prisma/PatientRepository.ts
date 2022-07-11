import { prismaClient } from "@infra/database/client";
import { PatientModel } from "@models/domain/PatientModel";
import { PrismaPromise } from "@prisma/client";
import { IPatientRepository } from "@repositories/patient/models/IPatientRepository";

class PatientRepository implements IPatientRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    personId: string,
    { gender, maritalStatus }: PatientModel
  ): PrismaPromise<Partial<PatientModel>> =>
    this.prisma.patient.create({
      data: {
        gender,
        maritalStatus,
        id: personId,
      },
    });
}

export { PatientRepository };
