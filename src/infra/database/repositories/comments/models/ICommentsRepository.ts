import { AppointmentModel } from "@models/domain/AppointmentModel";
import { PrismaPromise } from "@prisma/client";

interface ICommentsRepository {
  save(
    id: string,
    text: string | null
  ): PrismaPromise<{ id: string; comments: string | null; updatedAt: Date }>;
  get(
    professionalId: string,
    patientId: string,
    [take, skip]: [number, number],
    interval: [Date | null, Date | null]
  ): PrismaPromise<AppointmentModel[]>;
  count(
    professionalId: string,
    patientId: string,
    interval: [Date | null, Date | null]
  ): PrismaPromise<number>;
}

export { ICommentsRepository };
