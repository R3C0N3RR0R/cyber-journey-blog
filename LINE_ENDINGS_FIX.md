# Correction des Problèmes de Fins de Ligne

## Problème

Les fichiers MDX générés par Contentlayer contenaient des caractères `\r` (retours chariot Windows) qui causaient des erreurs de validation dans Next.js.

## Solution Implémentée

### 1. Plugin Contentlayer

Un plugin remark personnalisé a été ajouté dans `contentlayer.config.ts` pour normaliser automatiquement les fins de ligne :

```typescript
const remarkNormalizeLineEndings = () => {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === 'text' && node.value) {
        // Remplacer tous les \r\n par \n
        node.value = node.value.replace(/\r\n/g, '\n');
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
};
```

### 2. Configuration Git

Un fichier `.gitattributes` a été créé pour forcer l'utilisation de fins de ligne Unix :

```
*.mdx text eol=lf
*.md text eol=lf
*.json text eol=lf
# ... autres extensions
```

### 3. Scripts de Normalisation

- **`fix-line-endings.ps1`** : Script PowerShell pour normaliser tous les fichiers MDX existants
- **`scripts/pre-commit.js`** : Script Node.js pour vérifier les fins de ligne avant chaque commit

## Utilisation

### Normalisation Manuelle

```powershell
# Normaliser tous les fichiers MDX
.\fix-line-endings.ps1
```

### Vérification Pré-commit

```bash
# Vérifier les fins de ligne avant un commit
node scripts/pre-commit.js
```

## Prévention

1. **Éditeur de code** : Configurez votre éditeur pour utiliser des fins de ligne Unix (LF)
2. **Git** : Le fichier `.gitattributes` s'assure que les fins de ligne sont correctes
3. **Contentlayer** : Le plugin remark normalise automatiquement le contenu

## Résultat

- ✅ Plus d'erreurs de validation Next.js
- ✅ Fichiers générés propres sans caractères `\r`
- ✅ Cohérence des fins de ligne dans tout le projet
- ✅ Prévention automatique des problèmes futurs 