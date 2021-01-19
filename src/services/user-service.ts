import { getRepository } from "typeorm";
import { User } from "../entities/user";

export interface UserGetMinModel {
  id: number;
  name: string,
  surname: string,
  patronymic?: string,
  email: string
}

function getMin(obj : User) : UserGetMinModel {
  const {
    id, name, surname, patronymic, email
  } = obj;
  return {
    id, name, surname, patronymic, email
  }
}

export interface UserGetProfileModel extends UserGetMinModel {
  // Ещё разная информация об активности User'a
}

function getProfile(obj : User) : UserGetProfileModel {
  const {
    id, name, surname, patronymic, email
  } = obj;
  return {
    id, name, surname, patronymic, email
  };
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
  const user : User = getRepository(User).create(obj);
  await user.save();
  return user.id;
}

export async function getUser(id : number) : Promise<User> {
  return getRepository(User).findOneOrFail(id);
}

export async function getUserProfile(id: number) : Promise<UserGetProfileModel> {
  const users : User[] = await getRepository(User).findByIds([id]);
  if (users.length == 0) {
    throw new Error("Пользователя с таким идентификатором не зарегистрировано");
  }
  return getProfile(users[0]);
}

export async function getUserMin(id: number) : Promise<UserGetMinModel> {
  const users : User[] = await getRepository(User).findByIds([id]);
  if (users.length == 0) {
    throw new Error("Пользователя с таким идентификатором не зарегистрировано");
  }
  return getMin(users[0]);
}

export async function login(email: string, password: string) : Promise<number> {
  const users : User[] = await getRepository(User).find({email, password});
  if (users.length == 0) {
    throw new Error("Неверная почта или пароль");
  }
  return users[0].id;
}