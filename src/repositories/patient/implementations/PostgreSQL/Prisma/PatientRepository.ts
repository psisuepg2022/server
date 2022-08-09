import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { PrismaPromise } from "@prisma/client";
import { IPatientRepository } from "@repositories/patient/models/IPatientRepository";
import { clause2searchPeopleWithFilters } from "@repositories/person";

class PatientRepository implements IPatientRepository {
  constructor(private prisma = prismaClient) {}

  public getToUpdate = (
    clinicId: string,
    id: string
  ): PrismaPromise<
    | (Partial<PatientModel> & {
        person: Partial<PersonModel> & { address?: AddressModel };
        liable?: any & { person: Partial<PersonModel> };
      })
    | null
  > =>
    this.prisma.patient.findFirst({
      where: {
        id,
        person: {
          clinicId,
          active: true,
          domainClass: UserDomainClasses.PATIENT,
        },
      },
      select: {
        id: true,
        gender: true,
        maritalStatus: true,
        person: {
          select: {
            birthDate: true,
            contactNumber: true,
            CPF: true,
            email: true,
            name: true,
            address: {
              select: {
                id: true,
                city: true,
                district: true,
                state: true,
                publicArea: true,
                zipCode: true,
              },
            },
          },
        },
        liable: {
          select: {
            person: {
              select: {
                id: true,
                birthDate: true,
                email: true,
                name: true,
                CPF: true,
                contactNumber: true,
              },
            },
          },
        },
      },
    }) as PrismaPromise<
      | (Partial<PatientModel> & {
          person: Partial<PersonModel> & { address?: AddressModel };
          liable?: any & { person: Partial<PersonModel> };
        })
      | null
    >;

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
  ): PrismaPromise<
    Partial<
      PersonModel & {
        patient: PatientModel & { liable: any & { person: PersonModel } };
        address: AddressModel;
      }
    >[]
  > =>
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
        address: {
          select: {
            id: true,
            city: true,
            district: true,
            publicArea: true,
            state: true,
            zipCode: true,
          },
        },
        patient: {
          select: {
            gender: true,
            maritalStatus: true,
            liable: {
              select: {
                person: {
                  select: {
                    birthDate: true,
                    contactNumber: true,
                    CPF: true,
                    email: true,
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
      take,
      skip,
    }) as PrismaPromise<
      Partial<
        PersonModel & {
          patient: PatientModel & { liable: any & { person: PersonModel } };
          address: AddressModel;
        }
      >[]
    >;

  public save = (
    personId: string,
    { gender, maritalStatus }: PatientModel
  ): PrismaPromise<Partial<PatientModel>> =>
    this.prisma.patient.upsert({
      where: { id: personId },
      create: {
        gender,
        maritalStatus,
        id: personId,
      },
      update: {
        gender,
        maritalStatus,
      },
    });
}

export { PatientRepository };
