import { getManager } from "typeorm";
import { User } from "./entities/user";

export async function run() {
  const user = new User();
  user.name = "Иван";
  user.surname = "Иванович";
  user.patronymic = "Иванов";
  user.password = "ПарольИванова";
  user.email = "ivanov@test.ru";
  console.log(user);
  await user.save();
}