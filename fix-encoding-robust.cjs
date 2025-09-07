const fs = require('fs');
const path = require('path');

// Fonction pour corriger l'encodage d'un fichier
function fixEncoding(filePath) {
  try {
    console.log(`Traitement de: ${filePath}`);
    
    // Lire le fichier en binaire pour détecter le BOM
    const buffer = fs.readFileSync(filePath);
    
    // Supprimer le BOM UTF-8 si présent
    let content = buffer.toString('utf8');
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
      console.log('  BOM UTF-8 supprimé');
    }
    
    // Remplacer les caractères mal encodés
    const replacements = {
      'Ã©': 'é',
      'Ã¨': 'è',
      'Ã ': 'à',
      'Ã¹': 'ù',
      'Ã§': 'ç',
      'Ã«': 'ë',
      'Ã¯': 'ï',
      'Ã´': 'ô',
      'Ã»': 'û',
      'Ã¢': 'â',
      'Ãª': 'ê',
      'Ã®': 'î',
      'ÃƒÂ©': 'é',
      'ÃƒÂ¨': 'è',
      'ÃƒÂ ': 'à',
      'ÃƒÂ¹': 'ù',
      'ÃƒÂ§': 'ç',
      'ÃƒÂ«': 'ë',
      'ÃƒÂ¯': 'ï',
      'ÃƒÂ´': 'ô',
      'ÃƒÂ»': 'û',
      'ÃƒÂ¢': 'â',
      'ÃƒÂª': 'ê',
      'ÃƒÂ®': 'î',
      'Ãƒâ°': 'É',
      'Ãƒâ¬': 'È',
      'Ãƒ ': 'À',
      'Ãƒ¹': 'Ù',
      'Ãƒ§': 'Ç',
      'Ãƒ«': 'Ë',
      'Ãƒ¯': 'Ï',
      'Ãƒ´': 'Ô',
      'Ãƒ»': 'Û',
      'Ãƒ¢': 'Â',
      'Ãƒª': 'Ê',
      'Ãƒ®': 'Î',
      // Caractères spéciaux supplémentaires
      'âš ï¸': '⚠️',
      'â†': '→',
      'oÃ¹': 'où',
      'Ã¢': 'â',
      'Ã­': 'í',
      'Ã ': 'à'
    };
    
    let hasChanges = false;
    for (const [wrong, correct] of Object.entries(replacements)) {
      if (content.includes(wrong)) {
        content = content.replace(new RegExp(wrong, 'g'), correct);
        hasChanges = true;
        console.log(`  Remplacé: ${wrong} → ${correct}`);
      }
    }
    
    if (hasChanges) {
      // Sauvegarder avec l'encodage UTF-8 correct (sans BOM)
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Encodage corrigé: ${filePath}`);
      return true;
    } else {
      console.log(`✓ Encodage déjà correct: ${filePath}`);
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
  console.log('🔧 Correction robuste de l\'encodage UTF-8 des fichiers MDX...');
  
  const dataDir = path.join(__dirname, 'data');
  const fixedCount = processDirectory(dataDir);
  
  console.log(`\n✅ Correction terminée! ${fixedCount} fichier(s) corrigé(s).`);
  console.log('💡 Vous pouvez maintenant redémarrer votre serveur de développement.');
}

if (require.main === module) {
  main();
}

module.exports = { fixEncoding, processDirectory }; 