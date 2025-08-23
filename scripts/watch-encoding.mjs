import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const WATCH_DIR = path.join(process.cwd(), "data");
const DEBOUNCE_DELAY = 1000; // 1 seconde

let timeout = null;

function runMojibakeFix() {
  console.log("🔧 Détection de changements - vérification de l'encodage...");

  const child = spawn("node", ["scripts/fix-mojibake.mjs"], {
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    if (code === 0) {
      console.log("✅ Vérification d'encodage terminée");
    } else {
      console.log("❌ Erreur lors de la vérification d'encodage");
    }
  });
}

function debounce(func, delay) {
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedFix = debounce(runMojibakeFix, DEBOUNCE_DELAY);

function watchFiles() {
  console.log(
    "👀 Surveillance des fichiers MDX pour les problèmes d'encodage...",
  );
  console.log(`📁 Dossier surveillé: ${WATCH_DIR}`);

  fs.watch(WATCH_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith(".mdx")) {
      console.log(`📝 Changement détecté: ${filename}`);
      debouncedFix();
    }
  });

  console.log("🚀 Surveillance active. Pressez Ctrl+C pour arrêter.");
}

// Lancer la surveillance si le dossier existe
if (fs.existsSync(WATCH_DIR)) {
  watchFiles();
} else {
  console.error(`❌ Dossier non trouvé: ${WATCH_DIR}`);
  process.exit(1);
}
