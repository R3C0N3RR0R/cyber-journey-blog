const fs = require('fs');
const path = require('path');

// Fonction pour corriger l'encodage d'un fichier
function fixEncoding(filePath) {
  try {
    console.log(`Traitement de: ${filePath}`);
    
    // Lire le fichier avec différents encodages
    const encodings = ['utf8', 'latin1', 'cp1252'];
    let content = null;
    let workingEncoding = null;
    
    for (const encoding of encodings) {
      try {
        const testContent = fs.readFileSync(filePath, encoding);
        // Vérifier s'il y a des caractères mal encodés
        if (!testContent.includes('Ã©') && !testContent.includes('Ã¨') && !testContent.includes('Ã ')) {
          content = testContent;
          workingEncoding = encoding;
          console.log(`  Encodage détecté: ${encoding}`);
          break;
        }
      } catch (err) {
        continue;
      }
    }
    
    if (content) {
      // Sauvegarder avec l'encodage UTF-8 correct
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Encodage corrigé: ${filePath}`);
      return true;
    } else {
      console.log(`✗ Impossible de corriger l'encodage: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Erreur lors du traitement de ${filePath}:`, error.message);
    return false;
  }
}

// Fonction pour traiter récursivement un dossier
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += processDirectory(filePath);
    } else if (file.endsWith('.mdx')) {
      if (fixEncoding(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// Point d'entrée principal
function main() {
  console.log('🔧 Correction de l\'encodage UTF-8 des fichiers MDX...');
  
  const dataDir = path.join(__dirname, 'data');
  const fixedCount = processDirectory(dataDir);
  
  console.log(`\n✅ Correction terminée! ${fixedCount} fichier(s) corrigé(s).`);
  console.log('💡 Vous pouvez maintenant redémarrer votre serveur de développement.');
}

if (require.main === module) {
  main();
}

module.exports = { fixEncoding, processDirectory }; 