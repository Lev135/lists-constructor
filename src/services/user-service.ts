import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { User } from "../entities/user";
import { keysForSelection } from "../mlib";

export interface UserGetMinModel {
  id: number;
  name: string,
  surname: string,
  patronymic?: string,
  email: string
}

export interface UserGetProfileModel extends UserGetMinModel {
  // Ещё разная информация об активности User'a
}

export interface UserPostRegistrationModel {
  name: string,
  surname: string,
  patronymic?: string,
  email: string,
  password: string;
}

export async function registerUser(obj: UserPostRegistrationModel) : Promise<number> {
  if (await getRepository(User).count({email: obj.email}) > 0) {
    throw new Error("Пользователь с такой почтой уже зарегистрирован");
  }
  return (await getRepository(User).save(obj)).id;
}

export async function getUser(id : number) : Promise<User> {
  return getRepository(User).findOneOrFail(id);
}

export async function getUserProfile(id: number) : Promise<UserGetProfileModel> {
  const user = await createQueryBuilder(User, 'user')
      .where({ id })
      .select(keysForSelection<User>('user', keys<UserGetProfileModel>()))
      .getOneOrFail();
  return user;
}

export async function getUserMin(id: number) : Promise<UserGetMinModel> {
  const user = await createQueryBuilder(User, 'user')
      .where({ id })
      .select(keysForSelection<User>('user', keys<UserGetMinModel>()))
      .getOneOrFail();
  return user;
}

export async function login(email: string, password: string) : Promise<number> {
  const user : User | undefined = await getRepository(User).findOne({email, password});
  if (!user) {
    throw new Error("Неверная почта или пароль");
  }
  return user.id;
}
