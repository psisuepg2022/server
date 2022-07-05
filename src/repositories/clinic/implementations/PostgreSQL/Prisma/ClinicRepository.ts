import { prismaClient } from "@infra/database/client";
import { ClinicModel } from "@models/domain/ClinicModel";
import { PrismaPromise } from "@prisma/client";
import { IClinicRepository } from "@repositories/clinic/models/IClinicRepository";

class ClinicRepository implements IClinicRepository {
  constructor(private prisma = prismaClient) {}

  public save = ({
    email,
    id,
    name,
    password,
  }: Omit<ClinicModel, "code">): PrismaPromise<ClinicModel> =>
    this.prisma.clinic.create({
      data: {
        id,
        name,
        password,
        email,
      },
    }) as PrismaPromise<ClinicModel>;
}

export { ClinicRepository };
