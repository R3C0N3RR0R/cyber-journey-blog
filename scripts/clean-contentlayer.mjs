import { rmSync } from "fs";

try {
  rmSync(".contentlayer", { recursive: true, force: true });
  console.log(".contentlayer supprimé !");
} catch (e) {
  // Ignore si le dossier n'existe pas
}
