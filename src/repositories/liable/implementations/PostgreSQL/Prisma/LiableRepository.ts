import { prismaClient } from "@infra/database/client";
import { PersonModel } from "@models/domain/PersonModel";
import { PrismaPromise } from "@prisma/client";
import { ILiableRepository } from "@repositories/liable/models/ILiableRepository";

class LiableRepository implements ILiableRepository {
  constructor(private prisma = prismaClient) {}

  public save = (patientId: string, liableId: string): PrismaPromise<any> =>
    this.prisma.liable.create({
      data: {
        patientId,
        personId: liableId,
      },
    });

  public hasLiablePersonSaved = (
    id: string
  ): PrismaPromise<(any & { person: PersonModel }) | null> =>
    this.prisma.liable.findFirst({
      where: { personId: id },
      select: {
        person: {
          select: {
            email: true,
            name: true,
            CPF: true,
            birthDate: true,
            contactNumber: true,
          },
        },
      },
    }) as PrismaPromise<(any & { person: PersonModel }) | null>;
}

export { LiableRepository };
