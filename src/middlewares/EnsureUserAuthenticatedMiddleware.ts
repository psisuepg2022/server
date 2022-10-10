import i18n from "i18n";
import { inject, injectable } from "tsyringe";

import { HttpStatus, IMiddleware } from "@infra/http";
import { IAuthTokenProvider } from "@providers/authToken";

@injectable()
class EnsureUserAuthenticatedMiddleware {
  constructor(
    @inject("AuthTokenProvider")
    private authTokenProvider: IAuthTokenProvider
  ) {}

  public execute: IMiddleware = async (req, res, next) => {
    try {
      const tokenHeader = req.headers.authorization;

      if (!tokenHeader)
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: i18n.__("ErrorTokenRequired"),
        });

      const parts = tokenHeader.split(" ");
      const [scheme, token] = parts;

      if (parts.length !== 2 || !/^Bearer$/i.test(scheme))
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: i18n.__("ErrorTokenInvalid"),
        });

      const payload = this.authTokenProvider.decode(token);
      if (!payload)
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: i18n.__("ErrorTokenInvalid"),
        });

      if (payload.exp && Date.now() >= payload.exp * 1000)
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: i18n.__("ErrorTokenExpired"),
        });

      if (payload.type === "refresh_token")
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: i18n.__("ErrorTokenInvalid"),
        });

      if (!this.authTokenProvider.verify(token))
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: i18n.__("ErrorTokenInvalid"),
        });

      Object.assign(req, { user: { id: payload.id } });
      Object.assign(req, { clinic: { id: payload.clinic.id } });

      return next();
    } catch (_) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: i18n.__("ErrorTokenInvalid"),
      });
    }
  };
}

export { EnsureUserAuthenticatedMiddleware };
