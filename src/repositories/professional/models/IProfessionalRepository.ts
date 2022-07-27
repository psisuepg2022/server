import { PersonModel } from "@models/domain/PersonModel";
import { ProfessionalModel } from "@models/domain/ProfessionalModel";
import { UserModel } from "@models/domain/UserModel";
import { PrismaPromise } from "@prisma/client";

interface IProfessionalRepository {
  save(
    userId: string,
    professional: ProfessionalModel
  ): PrismaPromise<Partial<ProfessionalModel>>;
  get(
    clinicId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<
    Partial<
      UserModel & { person: PersonModel; professional: ProfessionalModel }
    >[]
  >;
}

export { IProfessionalRepository };
