import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const path = join(dirname(fileURLToPath(import.meta.url)), "..", ".secret.local");
if (!existsSync(path)) {
  writeFileSync(path, "RATE_LIMIT_SECRET=emulator-dev-secret-not-for-production\n");
}
