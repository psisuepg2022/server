import { AppointmentModel } from "@models/domain/AppointmentModel";
import { PrismaPromise } from "@prisma/client";

interface ICommentsRepository {
  save(
    id: string,
    text: string | null,
    updatedAt: Date
  ): PrismaPromise<{ id: string; comments: string | null; updatedAt: Date }>;
  get(
    professionalId: string,
    patientId: string,
    [take, skip]: [number, number]
  ): PrismaPromise<AppointmentModel[]>;
  count(professionalId: string, patientId: string): PrismaPromise<number>;
}

export { ICommentsRepository };
