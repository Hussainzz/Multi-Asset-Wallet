if (process.env.TEST_TYPE !== "e2e") {
  require("./src/prisma/singleton.ts");
}
//require('dotenv').config({ path: '.env.test' });
