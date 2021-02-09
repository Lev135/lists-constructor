import { createTestData } from "./create-test-data";
import { createLatexTestData } from "./latex-tests/create-latex-test-data";
import { testStringify } from "./latex-tests/test-stringify";
import { testListService } from "./test-list-service"
import { testTaskService } from "./test-task-service";

export async function run() {
  try {
    await createTestData();
    await createLatexTestData();
    testStringify();
    //    await createTestData();
//    await testListService();
    // await testTaskService();
//    testMLib();
  }
  catch (err) {
    console.error("Ошибка при тестировании: " + err.message);
  }
}