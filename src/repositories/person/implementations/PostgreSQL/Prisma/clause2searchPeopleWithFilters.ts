import { SearchPersonRequestModel } from "@models/dto/person/SearchPersonRequestModel";

const clause2searchPeopleWithFilters = (
  filters: SearchPersonRequestModel | null
): any => [
  {
    name: {
      contains: filters?.name || "%",
      mode: "insensitive",
    },
  },
  {
    OR: [
      { email: null },
      {
        email: {
          contains: filters?.email || "%",
          mode: "insensitive",
        },
      },
    ],
  },
  {
    OR: [
      { CPF: null },
      {
        CPF: {
          contains: filters?.CPF || "%",
          mode: "default",
        },
      },
    ],
  },
];

export { clause2searchPeopleWithFilters };
