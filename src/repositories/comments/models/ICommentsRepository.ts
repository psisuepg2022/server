import { PrismaPromise } from "@prisma/client";

interface ICommentsRepository {
  save(
    id: string,
    text: string,
    updatedAt: Date
  ): PrismaPromise<{ id: string; comments: string | null; updatedAt: Date }>;
  get(
    professionalId: string,
    patientId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<
    { createdAt: Date; updatedAt: Date; comments: string | null }[]
  >;
  count(
    professionalId: string,
    patientId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<number>;
}

export { ICommentsRepository };
