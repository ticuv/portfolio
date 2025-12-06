#!/usr/bin/env node

/* ==========================================
   BACKUP-PROJECTS.JS
   Creates timestamped backup of projects.json
   ========================================== */

const fs = require('fs');
const path = require('path');

const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');
const BACKUP_DIR = path.join(__dirname, '../backups');

console.log('💾 Creating backup of projects.json...\n');

// Create backups directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('📁 Created backups directory');
}

// Check if projects.json exists
if (!fs.existsSync(PROJECTS_FILE)) {
    console.error('❌ Error: projects.json not found');
    process.exit(1);
}

// Generate timestamp
const now = new Date();
const timestamp = now.toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .replace(/\..+/, '');

const backupFile = path.join(BACKUP_DIR, `projects_${timestamp}.json`);

// Copy file
try {
    fs.copyFileSync(PROJECTS_FILE, backupFile);
    console.log(`✅ Backup created: ${path.basename(backupFile)}`);
    console.log(`📂 Location: ${backupFile}\n`);

    // List recent backups
    const backups = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.startsWith('projects_') && file.endsWith('.json'))
        .sort()
        .reverse()
        .slice(0, 5);

    if (backups.length > 1) {
        console.log('📋 Recent backups:');
        backups.forEach((backup, index) => {
            if (index === 0) {
                console.log(`   1. ${backup} (current)`);
            } else {
                console.log(`   ${index + 1}. ${backup}`);
            }
        });
    }

    // Clean old backups (keep last 10)
    const allBackups = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.startsWith('projects_') && file.endsWith('.json'))
        .sort()
        .reverse();

    if (allBackups.length > 10) {
        console.log(`\n🧹 Cleaning old backups (keeping last 10)...`);
        const toDelete = allBackups.slice(10);
        toDelete.forEach(file => {
            fs.unlinkSync(path.join(BACKUP_DIR, file));
            console.log(`   Deleted: ${file}`);
        });
    }

    process.exit(0);
} catch (error) {
    console.error('❌ Error creating backup:', error.message);
    process.exit(1);
}
