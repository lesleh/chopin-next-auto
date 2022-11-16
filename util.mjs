import fs from "node:fs/promises";

export async function exists(path) {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}
