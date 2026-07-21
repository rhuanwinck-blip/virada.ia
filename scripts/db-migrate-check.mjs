import { existsSync, readdirSync } from "node:fs";

const path = "supabase/migrations";
const files = existsSync(path) ? readdirSync(path).filter((file) => file.endsWith(".sql")) : [];
console.log(`Found ${files.length} migration file(s).`);
if (!files.length) process.exitCode = 1;
