import { prismaClient } from "@infra/database/client";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { PrismaPromise } from "@prisma/client";
import { IProfessionalRepository } from "@repositories/professional/models/IProfessionalRepository";

class ProfessionalRepository implements IProfessionalRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    userId: string,
    { baseDuration, profession, registry, specialization }: ProfessionalModel
  ): PrismaPromise<Partial<ProfessionalModel>> =>
    this.prisma.professional.create({
      data: {
        profession,
        registry,
        baseDuration,
        specialization,
        id: userId,
      },
      select: {
        profession: true,
        baseDuration: true,
        registry: true,
        specialization: true,
      },
    }) as PrismaPromise<Partial<ProfessionalModel>>;
}

export { ProfessionalRepository };
