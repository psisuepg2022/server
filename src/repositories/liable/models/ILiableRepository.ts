import { PrismaPromise } from "@prisma/client";

interface ILiableRepository {
  save(patientId: string, liableId: string): PrismaPromise<any>;
}

export { ILiableRepository };
