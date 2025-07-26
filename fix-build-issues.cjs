const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des problèmes de build...');

// Corriger le fichier pre-commit.js
try {
  const preCommitPath = 'scripts/pre-commit.js';
  let content = fs.readFileSync(preCommitPath, 'utf8');
  content = content.replace(/\r\n/g, '\n');
  fs.writeFileSync(preCommitPath, content, 'utf8');
  console.log('✅ pre-commit.js corrigé');
} catch (error) {
  console.log('❌ Erreur avec pre-commit.js:', error.message);
}

// Corriger les fichiers de tags
try {
  const tagsDir = 'data/tags';
  const files = fs.readdirSync(tagsDir);
  
  files.forEach(file => {
    if (file.endsWith('.mdx')) {
      const filePath = path.join(tagsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Corriger les fins de ligne et le champ draft
      content = content.replace(/\r\n/g, '\n');
      content = content.replace(/draft: "false\r"/g, 'draft: false');
      content = content.replace(/draft: "false"/g, 'draft: false');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${file} corrigé`);
    }
  });
} catch (error) {
  console.log('❌ Erreur avec les fichiers de tags:', error.message);
}

console.log('🎉 Correction terminée!'); 