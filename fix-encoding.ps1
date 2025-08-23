# Script pour corriger l'encodage UTF-8 des fichiers MDX
Write-Host "Correction de l'encodage UTF-8 des fichiers MDX..." -ForegroundColor Green

# Fonction pour corriger l'encodage d'un fichier
function Repair-Encoding {
    param([string]$FilePath)
    
    try {
        # Lire le contenu avec l'encodage détecté automatiquement
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        
        # Vérifier s'il y a des caractères mal encodés
        if ($content -match 'Ã©|Ã¨|Ã |Ã¹|Ã§|Ã«|Ã¯|Ã´|Ã»|Ã¢|Ãª|Ã®|Ã´|Ã»') {
            Write-Host "Correction de l'encodage: $FilePath" -ForegroundColor Yellow
            
            # Essayer de lire avec différents encodages
            $encodings = @('UTF8', 'Default', 'Unicode', 'UTF32')
            $fixedContent = $null
            
            foreach ($encoding in $encodings) {
                try {
                    $testContent = Get-Content $FilePath -Raw -Encoding $encoding
                    if ($testContent -notmatch 'Ã©|Ã¨|Ã |Ã¹|Ã§|Ã«|Ã¯|Ã´|Ã»|Ã¢|Ãª|Ã®|Ã´|Ã»') {
                        $fixedContent = $testContent
                        Write-Host "  Encodage détecté: $encoding" -ForegroundColor Cyan
                        break
                    }
                } catch {
                    continue
                }
            }
            
            if ($fixedContent) {
                # Sauvegarder avec l'encodage UTF-8 correct
                Set-Content $FilePath $fixedContent -NoNewline -Encoding UTF8
                Write-Host "✓ Encodage corrigé: $FilePath" -ForegroundColor Green
            } else {
                Write-Host "✗ Impossible de corriger l'encodage: $FilePath" -ForegroundColor Red
            }
        } else {
            Write-Host "✓ Encodage correct: $FilePath" -ForegroundColor Gray
        }
    } catch {
        Write-Host "✗ Erreur lors du traitement de $FilePath : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Traiter tous les fichiers MDX dans le dossier data
$mdxFiles = Get-ChildItem -Path "data" -Filter "*.mdx" -Recurse

foreach ($file in $mdxFiles) {
    Repair-Encoding $file.FullName
}

Write-Host "`nCorrection d'encodage terminee!" -ForegroundColor Green
Write-Host "Vous pouvez maintenant redemarrer votre serveur de developpement." -ForegroundColor Cyan 