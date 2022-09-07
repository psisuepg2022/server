import { prismaClient } from "@infra/database/client";
import { PrismaPromise } from "@prisma/client";
import { ICommentsRepository } from "@repositories/comments/models/ICommentsRepository";

class CommentsRepository implements ICommentsRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    id: string,
    text: string,
    updatedAt: Date
  ): PrismaPromise<{ id: string; comments: string | null; updatedAt: Date }> =>
    this.prisma.appointment.update({
      where: { id },
      data: { updatedAt, comments: text },
      select: { id: true, comments: true, updatedAt: true },
    });
}

export { CommentsRepository };
