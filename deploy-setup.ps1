# 🚀 Quick Deployment Setup Script for Render (PowerShell)
# This script prepares your repository for Render deployment

Write-Host "🎯 SLT Mobitel ConsentHub - Render Deployment Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Check if this is a git repository
if (!(Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}

# Add all files to git
Write-Host "📦 Adding files to Git..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "feat: prepare for Render deployment with complete ConsentHub integration

- Complete ConsentHub integration with party-service, auth-service, consent-service, preference-service
- Customer data synchronization for CSR/Admin dashboards  
- Production environment configurations
- Render deployment blueprints
- MongoDB Atlas ready configuration
- Security optimizations for production"

Write-Host "✅ Files committed to Git" -ForegroundColor Green

# Instructions for GitHub setup
Write-Host ""
Write-Host "🔗 Next Steps - GitHub Repository Setup:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub" -ForegroundColor White
Write-Host "2. Run: git remote add origin https://github.com/yourusername/your-repo-name.git" -ForegroundColor White
Write-Host "3. Run: git branch -M main" -ForegroundColor White
Write-Host "4. Run: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "🚀 After GitHub setup, go to Render.com and:" -ForegroundColor Cyan
Write-Host "1. Click 'New Blueprint'" -ForegroundColor White
Write-Host "2. Connect your GitHub repository" -ForegroundColor White
Write-Host "3. Render will automatically detect render.yaml" -ForegroundColor White
Write-Host "4. Set MongoDB URI in backend environment variables" -ForegroundColor White
Write-Host "5. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "✨ Deployment preparation complete!" -ForegroundColor Green
