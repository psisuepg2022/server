import { UserDomainClasses } from "@common/UserDomainClasses";
import { prismaClient } from "@infra/database/client";
import { AddressModel } from "@models/domain/AddressModel";
import { PatientModel } from "@models/domain/PatientModel";
import { PersonModel } from "@models/domain/PersonModel";
import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";
import { SearchProfessionalPatientsRequestModel } from "@models/dto/professional/SearchProfessionalPatientsRequestModel";
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

  public countToAutocomplete = (
    clinicId: string,
    name: string,
    professionalId: string | null
  ): PrismaPromise<number> =>
    this.prisma.patient.count({
      where: {
        person: {
          clinicId,
          active: true,
          domainClass: UserDomainClasses.PATIENT,
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        Appointment: professionalId
          ? {
              some: { professionalId },
            }
          : {},
      },
      orderBy: {
        person: {
          name: "asc",
        },
      },
    });

  public getToAutocomplete = (
    clinicId: string,
    name: string,
    professionalId: string | null
  ): PrismaPromise<
    Partial<PatientModel> &
      {
        person: Partial<PersonModel>;
        liable: { person: Partial<PersonModel> };
      }[]
  > =>
    this.prisma.patient.findMany({
      where: {
        person: {
          clinicId,
          active: true,
          domainClass: UserDomainClasses.PATIENT,
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        Appointment: professionalId
          ? {
              some: { professionalId },
            }
          : {},
      },
      select: {
        person: {
          select: {
            id: true,
            name: true,
            CPF: true,
            contactNumber: true,
          },
        },
        liable: {
          select: {
            person: {
              select: {
                CPF: true,
                name: true,
                contactNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        person: {
          name: "asc",
        },
      },
      take: 30,
    }) as PrismaPromise<
      Partial<PatientModel> &
        {
          person: Partial<PersonModel>;
          liable: { person: Partial<PersonModel> };
        }[]
    >;

  public getByProfessional = (
    clinicId: string,
    [take, skip]: [number, number],
    filters: SearchProfessionalPatientsRequestModel | null
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
        patient: {
          Appointment: { some: { professionalId: filters?.professionalId } },
        },
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

  public countByProfessional = (
    clinicId: string,
    domainClass: string,
    filters: SearchProfessionalPatientsRequestModel | null
  ): PrismaPromise<number> =>
    this.prisma.person.count({
      where: {
        clinicId,
        domainClass: UserDomainClasses.PATIENT,
        active: true,
        AND: clause2searchPeopleWithFilters(filters),
        patient: {
          Appointment: { some: { professionalId: filters?.professionalId } },
        },
      },
    });

  public getByIdList = (
    clinicId: string,
    idList: string[]
  ): PrismaPromise<Partial<PersonModel>[]> =>
    this.prisma.person.findMany({
      where: {
        clinicId,
        id: { in: idList },
      },
      select: {
        name: true,
        contactNumber: true,
        email: true,
      },
    }) as PrismaPromise<Partial<PersonModel>[]>;
}

export { PatientRepository };
