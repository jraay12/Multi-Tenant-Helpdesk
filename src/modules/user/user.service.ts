import { UserRepository } from "./user.repository";
import bcrypt from "bcrypt";
import { CreateUserDTO } from "./user.types";
import { BadRequestError } from "../../shared/errors/BadRequestError";

export class UserService {
  constructor(private userRepo: UserRepository){}

  async createUser(data: CreateUserDTO) {
    const existingUser = await this.userRepo.findByEmail(data.email)
    if(existingUser) throw new BadRequestError("Email already exists")

    const hashedPassword = await bcrypt.hash(data.password, 10) 

    const user = await this.userRepo.save({
      name: data.name,
      email: data.email,
      password: hashedPassword
    })

    const {password, ...safeUser} = user 

    return safeUser
  }
}