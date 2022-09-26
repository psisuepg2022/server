import { ConfigureProfessionalRequestModel } from "@models/dto/professional/ConfigureProfessionalRequestModel";

class ConfigureProfessionalService {
  public async execute(_: ConfigureProfessionalRequestModel): Promise<void> {
    console.log("");
  }
}

export { ConfigureProfessionalService };
