import { getManager } from "typeorm";
import { User } from "../entities/user";
import { testTaskService } from "./test-task-service";

async function testTypeOrm() {
  const user = new User();
  user.name = "Иван";
  user.surname = "Иванович";
  user.patronymic = "Иванов";
  user.password = "ПарольИванова";
  user.email = "ivanov@test.ru";
  console.log(user);
  await user.save();
}

export async function run() {
  try {
    await testTaskService();
  }
  catch (err) {
    console.error("Ошибка при тестировании: " + err.message);
  }
}