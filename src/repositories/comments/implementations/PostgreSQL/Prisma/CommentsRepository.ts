import { prismaClient } from "@infra/database/client";
import { ICommentsRepository } from "@repositories/comments/models/ICommentsRepository";

class CommentsRepository implements ICommentsRepository {
  constructor(private prisma = prismaClient) {}

  save(): any {
    throw new Error("Method not implemented.");
  }
}

export { CommentsRepository };
