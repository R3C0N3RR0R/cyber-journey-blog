# Script pour normaliser les fins de ligne dans tous les fichiers MDX
Write-Host "Normalisation des fins de ligne dans les fichiers MDX..." -ForegroundColor Green

# Fonction pour normaliser un fichier
function Normalize-File {
    param([string]$FilePath)
    
    try {
        $content = Get-Content $FilePath -Raw
        if ($content -match '\r\n') {
            Write-Host "Normalisation de: $FilePath" -ForegroundColor Yellow
            $normalizedContent = $content -replace '\r\n', "`n"
            Set-Content $FilePath $normalizedContent -NoNewline -Encoding UTF8
            Write-Host "✓ Fichier normalisé: $FilePath" -ForegroundColor Green
        } else {
            Write-Host "✓ Fichier déjà normalisé: $FilePath" -ForegroundColor Gray
        }
    } catch {
        Write-Host "✗ Erreur lors du traitement de $FilePath : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Traiter tous les fichiers MDX dans le dossier data
$mdxFiles = Get-ChildItem -Path "data" -Filter "*.mdx" -Recurse

foreach ($file in $mdxFiles) {
    Normalize-File $file.FullName
}

Write-Host "`nNormalisation terminée!" -ForegroundColor Green
Write-Host "Vous pouvez maintenant redémarrer votre serveur de développement." -ForegroundColor Cyan 