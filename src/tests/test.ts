import { createTestData } from "./create-test-data";
import { createLatexTestData } from "./latex-tests/create-latex-test-data";
import { testListService } from "./test-list-service"
import { testTaskService } from "./test-task-service";

export async function run() {
  try {
    await createTestData();
    // testStringify();
    // await testTaskService();
    // await testListService();
    await createLatexTestData();
//    testMLib();
  }
  catch (err) {
    console.error("Ошибка при тестировании: " + err.message);
  }
}