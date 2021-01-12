import { getRepository } from "typeorm";
import { User } from "../entities/user";

const userRep = getRepository(User);

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

function getProfile(obj : User) : UserGetProfileModel {
  const {
    id, name, surname, patronymic, email
  } = obj;
  return {
    id, name, surname, patronymic, email
  };
}

export interface UserPostRegistrationModel extends UserGetMinModel {
  password: string;
}

export async function registerUser(obj: UserPostRegistrationModel) : Promise<number | Error> {
  if (await userRep.count({email: obj.email}) > 0) {
    return new Error("Пользователь с такой почтой уже зарегистрирован");
  }
  const user : User = userRep.create(obj);
  return user.id;
}

export async function getUserProfile(id: number) : Promise<UserGetProfileModel | Error> {
  const users : User[] = await userRep.findByIds([id]);
  if (users.length == 0) {
    return new Error("Пользователя с таким идентификатором не зарегистрировано");
  }
  return getProfile(users[0]);
}

export async function login(email: string, password: string) : Promise<number | Error> {
  const users : User[] = await userRep.find({email, password});
  if (users.length == 0) {
    return new Error("Неверная почта или пароль");
  }
  return users[0].id;
}