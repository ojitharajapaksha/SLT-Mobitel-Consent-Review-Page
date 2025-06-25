# Railway URL Update Script for PowerShell
# Usage: .\update-urls.ps1 https://your-railway-url.up.railway.app

param(
    [Parameter(Mandatory=$false)]
    [string]$RailwayUrl
)

function Show-Usage {
    Write-Host "🔗 Railway URL Replacer for Windows" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\update-urls.ps1 <your-railway-url>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Green
    Write-Host "  .\update-urls.ps1 https://my-party-api.up.railway.app" -ForegroundColor White
    Write-Host ""
    Write-Host "This will generate environment variables for Vercel deployment." -ForegroundColor Gray
}

function Update-EnvVars {
    param([string]$Url)
    
    # Remove trailing slash if present
    $CleanUrl = $Url.TrimEnd('/')
    
    Write-Host "🚀 Generating environment variables for Vercel..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Copy and paste these into your Vercel environment variables:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host "VITE_API_BASE_URL=$CleanUrl" -ForegroundColor White
    Write-Host "VITE_HEALTH_URL=$CleanUrl/health" -ForegroundColor White
    Write-Host "VITE_TMF_API_BASE_URL=$CleanUrl/tmf-api/party/v5" -ForegroundColor White
    Write-Host "VITE_CONSENT_API_URL=$CleanUrl/tmf-api/consent/v1" -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host ""
    Write-Host "✅ Ready to paste into Vercel!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to your Vercel project settings" -ForegroundColor White
    Write-Host "2. Navigate to Environment Variables" -ForegroundColor White
    Write-Host "3. Add each variable above" -ForegroundColor White
    Write-Host "4. Redeploy your frontend" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 Test your backend: $CleanUrl/health" -ForegroundColor Cyan
}

# Main script logic
if (-not $RailwayUrl) {
    Show-Usage
} else {
    Update-EnvVars -Url $RailwayUrl
}
