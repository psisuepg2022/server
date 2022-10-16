import { stringIsNullOrEmpty } from "@helpers/stringIsNullOrEmpty";
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
  stringIsNullOrEmpty(filters?.email || "")
    ? undefined
    : {
        email: {
          contains: filters?.email || "%",
          mode: "insensitive",
        },
      },
  stringIsNullOrEmpty(filters?.CPF || "")
    ? undefined
    : {
        OR: [
          { CPF: filters?.CPF },
          {
            patient: {
              liable: {
                person: {
                  CPF: filters?.CPF,
                },
              },
            },
          },
        ],
      },
];

export { clause2searchPeopleWithFilters };
