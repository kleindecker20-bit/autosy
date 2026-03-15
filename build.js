/**
 * Build script — copies www assets and syncs to native projects.
 * Run: node build.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 AutoSync Mobile App Build');
console.log('============================\n');

// Ensure www directory exists
const wwwDir = path.join(__dirname, 'www');
if (!fs.existsSync(wwwDir)) {
    console.error('❌ www/ directory not found');
    process.exit(1);
}

// Check required files
const required = ['www/index.html', 'www/native-bridge.js', 'www/manifest.json', 'capacitor.config.ts'];
for (const f of required) {
    if (!fs.existsSync(path.join(__dirname, f))) {
        console.error(`❌ Missing: ${f}`);
        process.exit(1);
    }
}
console.log('✅ All required files present\n');

// Create icons directory if needed
const iconsDir = path.join(wwwDir, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
    console.log('📁 Created www/icons/');
}

// Create screenshots directory if needed
const ssDir = path.join(wwwDir, 'screenshots');
if (!fs.existsSync(ssDir)) {
    fs.mkdirSync(ssDir, { recursive: true });
    console.log('📁 Created www/screenshots/');
}

// Sync to native projects
try {
    console.log('📱 Syncing to native projects...');
    execSync('npx cap sync', { stdio: 'inherit' });
    console.log('\n✅ Build complete!\n');
    console.log('Next steps:');
    console.log('  iOS:     npx cap open ios');
    console.log('  Android: npx cap open android\n');
} catch(e) {
    console.log('\n⚠️  cap sync failed — have you run "npx cap add ios" and "npx cap add android"?');
}
