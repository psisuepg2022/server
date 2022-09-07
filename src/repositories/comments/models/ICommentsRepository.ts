import { PrismaPromise } from "@prisma/client";

interface ICommentsRepository {
  save(
    id: string,
    text: string,
    updatedAt: Date
  ): PrismaPromise<{ id: string; comments: string | null; updatedAt: Date }>;
}

export { ICommentsRepository };
