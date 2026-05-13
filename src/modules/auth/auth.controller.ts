import { AuthService } from "./auth.service";
import { Response, Request, NextFunction } from "express";
import { loginUserSchema } from "./auth.validation";
export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = loginUserSchema.parse(req.body);
      const {accessToken} = await this.authService.login(data);
      res.status(200).json({
        accessToken: accessToken
      })
    } catch (error) {
      next(error);
    }
  };
}
