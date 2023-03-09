import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { transaction } from "@infra/database/transaction";
import { HttpStatus, IMiddleware } from "@infra/http";
import { IAuthTokenProvider } from "@providers/authToken";
import { IUserRepository } from "@repositories/user";

@injectable()
class RBACMiddleware {
  constructor(
    @inject("AuthTokenProvider")
    private authTokenProvider: IAuthTokenProvider,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  public has =
    (permission: string): IMiddleware =>
    async (req, res, next) => {
      const tokenHeader = req.headers.authorization;

      if (!tokenHeader)
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: i18n.__("ErrorTokenRequired"),
        });

      const [_, token] = tokenHeader.split(" ");

      const payload = this.authTokenProvider.decode(token);

      if (!payload.permissions.includes(permission))
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: i18n.__("ErrorUnauthorizedUserForThisResource"),
        });

      return next();
    };

  public is =
    (role: string): IMiddleware =>
    async (req, res, next) => {
      const { id } = req.user;

      const [hasRole] = await transaction([
        this.userRepository.verifyRole(id, role),
      ]);

      if (!hasRole)
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: i18n.__("ErrorUnauthorizedUserForThisResource"),
        });

      return next();
    };
}

export { RBACMiddleware };
