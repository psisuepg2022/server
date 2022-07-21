import { prismaClient } from "@infra/database/client";
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
}

export { LiableRepository };
