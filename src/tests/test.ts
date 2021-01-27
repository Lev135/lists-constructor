import { createTestData } from "./create-test-data";
import { testListService } from "./test-list-service"
import { testTaskService } from "./test-task-service";

export async function run() {
  try {
    await createTestData();
    await testListService();
    // await testTaskService();
//    testMLib();
  }
  catch (err) {
    console.error("Ошибка при тестировании: " + err.message);
  }
}