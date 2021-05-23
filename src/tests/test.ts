import { inspect } from "util";
import { createLatexTestData } from "./latex-tests/create-latex-test-data";
import { testDraftService } from "./test-draft-service";
import { testListService } from "./test-list-service"
import { testTaskService } from "./test-task-service";

export async function runTests() {
  try {
    // testStringify();
    // await testTaskService();
    // await testListService();
    // await createLatexTestData();
//    testMLib();
    await testDraftService();
  }
  catch (err) {
    console.error("Ошибка при тестировании: " + err.message);
  }
}

export function inspectLog(obj : any) {
  console.log(inspect(obj, { colors : true, depth : null }));
}