import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { PrismaPromise } from "@prisma/client";

interface IProfessionalRepository {
  save(
    userId: string,
    professional: ProfessionalModel
  ): PrismaPromise<Partial<ProfessionalModel>>;
}

export { IProfessionalRepository };
