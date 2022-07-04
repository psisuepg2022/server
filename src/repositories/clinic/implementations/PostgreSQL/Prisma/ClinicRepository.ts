import { prismaClient } from "@infra/database/client";
import { ClinicModel } from "@models/domain/ClinicModel";
import { PrismaPromise } from "@prisma/client";
import { IClinicRepository } from "@repositories/clinic/models/IClinicRepository";

class ClinicRepository implements IClinicRepository {
  constructor(private prisma = prismaClient) {}

  public save = ({
    code,
    email,
    id,
    name,
    password,
  }: ClinicModel): PrismaPromise<ClinicModel> =>
    this.prisma.clinic.create({
      data: {
        code,
        id,
        name,
        password,
        email,
      },
    }) as PrismaPromise<ClinicModel>;
}

export { ClinicRepository };
