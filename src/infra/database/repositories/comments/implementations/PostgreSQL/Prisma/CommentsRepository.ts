import { prismaClient } from "@infra/database/client";
import { AppointmentStatus } from "@infra/domains";
import { AppointmentModel } from "@models/domain/AppointmentModel";
import { PrismaPromise } from "@prisma/client";
import { ICommentsRepository } from "@repositories/comments/models/ICommentsRepository";

class CommentsRepository implements ICommentsRepository {
  constructor(private prisma = prismaClient) {}

  public save = (
    id: string,
    text: string | null
  ): PrismaPromise<{ id: string; comments: string | null; updatedAt: Date }> =>
    this.prisma.appointment.update({
      where: { id },
      data: { comments: text },
      select: { id: true, comments: true, updatedAt: true },
    });

  public get = (
    professionalId: string,
    patientId: string,
    [take, skip]: [number, number],
    interval: [Date | null, Date | null]
  ): PrismaPromise<AppointmentModel[]> =>
    this.prisma.appointment.findMany({
      where: {
        professionalId,
        patientId,
        status: AppointmentStatus.COMPLETED,
        appointmentDate: {
          gte: interval[0] || undefined,
          lte: interval[1] || undefined,
        },
      },
      take,
      skip,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        appointmentDate: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as PrismaPromise<AppointmentModel[]>;

  public count = (
    professionalId: string,
    patientId: string,
    interval: [Date | null, Date | null]
  ): PrismaPromise<number> =>
    this.prisma.appointment.count({
      where: {
        professionalId,
        patientId,
        status: AppointmentStatus.COMPLETED,
        appointmentDate: {
          gte: interval[0] || undefined,
          lte: interval[1] || undefined,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
}

export { CommentsRepository };
