import { prismaClient } from "@infra/database/client";
import { ClinicModel } from "@models/domain/ClinicModel";
import { PrismaPromise } from "@prisma/client";
import { IClinicRepository } from "@repositories/clinic/models/IClinicRepository";

class ClinicRepository implements IClinicRepository {
  constructor(private prisma = prismaClient) {}

  public delete = (id: string): PrismaPromise<ClinicModel> =>
    this.prisma.clinic.delete({
      where: {
        id,
      },
    });

  public getById = (id: string): PrismaPromise<ClinicModel> =>
    this.prisma.clinic.findFirst({
      where: { id },
    }) as PrismaPromise<ClinicModel>;

  public count = (): PrismaPromise<number> => this.prisma.clinic.count();

  public get = ([take, skip]: [number, number]): PrismaPromise<ClinicModel[]> =>
    this.prisma.clinic.findMany({
      select: { code: true, email: true, id: true, name: true },
      orderBy: { name: "asc" },
      take,
      skip,
    });

  public get2login = (): PrismaPromise<{ code: number; name: string }[]> =>
    this.prisma.clinic.findMany({
      select: {
        code: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

  public hasEmail = (
    clinicId: string,
    email: string
  ): PrismaPromise<ClinicModel | null> =>
    this.prisma.clinic.findFirst({
      where: {
        email,
        id: {
          not: clinicId,
        },
      },
    }) as PrismaPromise<ClinicModel | null>;

  public save = ({
    email,
    id,
    name,
  }: Omit<ClinicModel, "code">): PrismaPromise<ClinicModel> =>
    this.prisma.clinic.upsert({
      where: { id },
      create: {
        id,
        name,
        email,
      },
      update: {
        name,
        email,
      },
    }) as PrismaPromise<ClinicModel>;
}

export { ClinicRepository };
