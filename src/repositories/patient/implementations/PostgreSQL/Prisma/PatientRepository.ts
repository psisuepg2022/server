import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IPatientRepository } from "@repositories/patient/models/IPatientRepository";
import { clause2searchPeopleWithFilters } from "@repositories/person";

class PatientRepository implements IPatientRepository {
  constructor(private prisma = prismaClient) {}

  public count = (clinicId: string): PrismaPromise<number> =>
    this.prisma.person.count({
      where: {
        clinicId,
        domainClass: UserDomainClasses.PATIENT,
      },
    });

  public get = (
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchPersonRequestModel | null
  ): PrismaPromise<Partial<PersonModel & { patient: PatientModel }>[]> =>
    this.prisma.person.findMany({
      where: {
        clinicId,
        domainClass: UserDomainClasses.PATIENT,
        active: true,
        AND: clause2searchPeopleWithFilters(filters),
      },
      select: {
        birthDate: true,
        contactNumber: true,
        CPF: true,
        email: true,
        name: true,
        id: true,
        patient: {
          select: {
            gender: true,
            maritalStatus: true,
          },
        },
      },
      orderBy: { name: "asc" },
      take,
      skip,
    }) as PrismaPromise<Partial<PersonModel & { patient: PatientModel }>[]>;

  public save = (
    personId: string,
    { gender, maritalStatus }: PatientModel
  ): PrismaPromise<Partial<PatientModel>> =>
    this.prisma.patient.create({
      data: {
        gender,
        maritalStatus,
        id: personId,
      },
    });
}

export { PatientRepository };
