import { PrismaPromise, UnwrapTuple } from "@prisma/client";

import { prismaClient } from "../client";

const transaction = async <P extends PrismaPromise<any>[]>(
  events: [...P]
): Promise<UnwrapTuple<P>> => prismaClient.$transaction(events);

export { transaction };
