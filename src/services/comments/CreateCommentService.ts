import { CreateCommentRequestModel } from "@models/dto/comments/CreateCommentRequestModel";
import { CreateCommentResponseModel } from "@models/dto/comments/CreateCommentResponseModel";

class CreateCommentService {
  public async execute(
    _: CreateCommentRequestModel
  ): Promise<CreateCommentResponseModel> {
    return { appointmentId: "", text: "" };
  }
}

export { CreateCommentService };
