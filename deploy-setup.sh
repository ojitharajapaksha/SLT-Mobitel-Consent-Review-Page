#!/bin/bash
# 🚀 Quick Deployment Setup Script for Render
# This script prepares your repository for Render deployment

echo "🎯 SLT Mobitel ConsentHub - Render Deployment Setup"
echo "================================================="

# Check if this is a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Add all files to git
echo "📦 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: prepare for Render deployment with complete ConsentHub integration

- Complete ConsentHub integration with party-service, auth-service, consent-service, preference-service
- Customer data synchronization for CSR/Admin dashboards  
- Production environment configurations
- Render deployment blueprints
- MongoDB Atlas ready configuration
- Security optimizations for production"

echo "✅ Files committed to Git"

# Instructions for GitHub setup
echo ""
echo "🔗 Next Steps - GitHub Repository Setup:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/yourusername/your-repo-name.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo ""
echo "🚀 After GitHub setup, go to Render.com and:"
echo "1. Click 'New Blueprint'"
echo "2. Connect your GitHub repository"
echo "3. Render will automatically detect render.yaml"
echo "4. Set MongoDB URI in backend environment variables"
echo "5. Deploy!"
echo ""
echo "✨ Deployment preparation complete!"
