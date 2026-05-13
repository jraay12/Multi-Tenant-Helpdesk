import { UserRepository } from "../user/user.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { LoginUserDTO } from "./auth.types";
import { BadRequestError } from "../../shared/errors/BadRequestError";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async login(data: LoginUserDTO): Promise<{ accessToken: string }> {
    const emailExist = await this.userRepo.findByEmail(data.email);
    if (!emailExist) throw new BadRequestError("Invalid credentials");

    const passwordMatch = await bcrypt.compare(
      data.password,
      emailExist.password,
    );
    if (!passwordMatch) throw new BadRequestError("Invalid credentials");

    const accessToken = jwt.sign(
      {
        userId: emailExist.id,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "1h",
      },
    );

    return { accessToken };
  }
}
