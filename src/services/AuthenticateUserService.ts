import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    // validação - verifica se o usuário é válido

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    // caso o usuário não tenha sido encontrado
    if (!user) {
      throw new Error('Incorrect email/password combination.');
    }

    // caso tenha sido encontrado, caí aqui
    // user.password - senha criptografada
    // password - senha não criptografada
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination.');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;