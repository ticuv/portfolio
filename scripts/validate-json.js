#!/usr/bin/env node

/* ==========================================
   VALIDATE-JSON.JS
   Validates projects.json structure and data
   ========================================== */

const fs = require('fs');
const path = require('path');

const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');

console.log('🔍 Validating projects.json...\n');

// Check if file exists
if (!fs.existsSync(PROJECTS_FILE)) {
    console.error('❌ Error: projects.json not found at', PROJECTS_FILE);
    process.exit(1);
}

// Read and parse JSON
let data;
try {
    const fileContent = fs.readFileSync(PROJECTS_FILE, 'utf8');
    data = JSON.parse(fileContent);
} catch (error) {
    console.error('❌ Error parsing JSON:', error.message);
    process.exit(1);
}

// Validate structure
if (!data.projects || !Array.isArray(data.projects)) {
    console.error('❌ Error: Missing or invalid "projects" array');
    process.exit(1);
}

console.log(`✅ Found ${data.projects.length} projects\n`);

// Validate each project
let hasErrors = false;
const requiredFields = ['id', 'title', 'tags', 'description', 'image', 'thumbnail', 'category', 'year', 'featured'];
const validCategories = ['visuals', '3d', 'branding', 'generative'];
const ids = new Set();

data.projects.forEach((project, index) => {
    const projectNum = index + 1;
    let projectErrors = [];

    // Check required fields
    requiredFields.forEach(field => {
        if (project[field] === undefined || project[field] === null || project[field] === '') {
            if (field !== 'thumbnail') { // Thumbnail can use image fallback
                projectErrors.push(`Missing required field: ${field}`);
            }
        }
    });

    // Validate ID uniqueness
    if (ids.has(project.id)) {
        projectErrors.push(`Duplicate ID: ${project.id}`);
    } else {
        ids.add(project.id);
    }

    // Validate ID format (lowercase, no spaces)
    if (project.id && !/^[a-z0-9-]+$/.test(project.id)) {
        projectErrors.push(`Invalid ID format: ${project.id} (must be lowercase letters, numbers, and hyphens only)`);
    }

    // Validate tags array
    if (project.tags && !Array.isArray(project.tags)) {
        projectErrors.push('Tags must be an array');
    } else if (project.tags && project.tags.length === 0) {
        projectErrors.push('Tags array is empty');
    }

    // Validate category
    if (project.category && !validCategories.includes(project.category)) {
        projectErrors.push(`Invalid category: ${project.category} (must be one of: ${validCategories.join(', ')})`);
    }

    // Validate year
    if (project.year && (project.year < 2000 || project.year > 2100)) {
        projectErrors.push(`Invalid year: ${project.year}`);
    }

    // Validate URLs
    ['image', 'thumbnail', 'link'].forEach(field => {
        if (project[field] && project[field] !== '') {
            try {
                new URL(project[field]);
            } catch {
                projectErrors.push(`Invalid URL for ${field}: ${project[field]}`);
            }
        }
    });

    // Validate featured boolean
    if (project.featured !== undefined && typeof project.featured !== 'boolean') {
        projectErrors.push('Featured must be a boolean (true/false)');
    }

    // Validate tools array
    if (project.tools && !Array.isArray(project.tools)) {
        projectErrors.push('Tools must be an array');
    }

    // Report errors
    if (projectErrors.length > 0) {
        hasErrors = true;
        console.log(`❌ Project #${projectNum} (${project.title || project.id || 'Unknown'}):`);
        projectErrors.forEach(error => {
            console.log(`   - ${error}`);
        });
        console.log('');
    } else {
        console.log(`✅ Project #${projectNum}: ${project.title} (${project.id})`);
    }
});

// Final report
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ Validation FAILED - Please fix the errors above');
    process.exit(1);
} else {
    console.log('✅ Validation PASSED - projects.json is valid!');
    console.log(`\n📊 Summary:`);
    console.log(`   Total projects: ${data.projects.length}`);
    console.log(`   Featured: ${data.projects.filter(p => p.featured).length}`);
    console.log(`   Categories:`);
    validCategories.forEach(cat => {
        const count = data.projects.filter(p => p.category === cat).length;
        if (count > 0) {
            console.log(`     - ${cat}: ${count}`);
        }
    });
    process.exit(0);
}
