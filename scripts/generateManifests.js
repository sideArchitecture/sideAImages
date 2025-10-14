const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../images/projects');
const OUTPUT_MANIFEST = path.join(ROOT_DIR, 'manifest.json');
const BASE_URL = 'https://sidearchitecture.github.io/sideAImages/images/projects';

function extractSortAndSlug(folderName) {
    const match = folderName.match(/^(\d+)-(.+)$/);
    return match
        ? { sortIndex: parseInt(match[1]), slug: match[2] }
        : { sortIndex: Infinity, slug: folderName };
}

function getImageFiles(projectPath) {
    const files = fs.readdirSync(projectPath);
    return files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
}

function generateProjectManifest(categoryFolder, categorySortIndex, projectFolder, projectPath) {
    const { sortIndex: projectSortIndex, slug } = extractSortAndSlug(projectFolder);
    const imageFiles = getImageFiles(projectPath);
    const coverImageFile = imageFiles.find(f => f.toLowerCase() === 'cover.jpg') || imageFiles[0];

    if (!coverImageFile) {
        console.warn(`⚠️ No cover image found in ${projectFolder}`);
        return null;
    }

    const imageUrls = imageFiles.filter(f => f !== coverImageFile);
    const baseUrl = `${BASE_URL}/${categoryFolder}/${projectFolder}`;

    const projectJsonPath = path.join(projectPath, 'project.json');
    if (!fs.existsSync(projectJsonPath)) {
        console.warn(`⚠️ Missing project.json in ${projectFolder}`);
        return null;
    }

    const manualData = JSON.parse(fs.readFileSync(projectJsonPath, 'utf-8'));

    const manifest = {
        id: slug,
        slug,
        imageUrl: `${baseUrl}/${coverImageFile}`,
        imageUrls: imageUrls.map(f => `${baseUrl}/${f}`),
        ...manualData
    };

    fs.writeFileSync(path.join(projectPath, 'manifest.json'), JSON.stringify(manifest, null, 2));

    return {
        id: slug,
        slug,
        title: manualData.title || slug,
        coverImage: `${baseUrl}/${coverImageFile}`,
        imageCount: imageUrls.length,
        category: manualData.category || [],
        categorySortIndex,
        projectSortIndex,
        projectPath: `${categoryFolder}/${projectFolder}`,
        year: manualData.year || '',
        client: manualData.client || '',
        designStyle: manualData.designStyle || '',
        builtStatus: manualData.builtStatus || '',
        location: manualData.location || ''
    };
}

function generateAllManifests() {
    const categories = fs.readdirSync(ROOT_DIR).filter(f => fs.statSync(path.join(ROOT_DIR, f)).isDirectory());
    const allProjects = [];

    for (const categoryFolder of categories) {
        const { sortIndex: categorySortIndex } = extractSortAndSlug(categoryFolder);
        const categoryPath = path.join(ROOT_DIR, categoryFolder);
        const projects = fs.readdirSync(categoryPath).filter(f => fs.statSync(path.join(categoryPath, f)).isDirectory());

        for (const projectFolder of projects) {
            const projectPath = path.join(categoryPath, projectFolder);
            const manifest = generateProjectManifest(categoryFolder, categorySortIndex, projectFolder, projectPath);
            if (manifest) allProjects.push(manifest);
        }
    }

    // Sort by category then project
    allProjects.sort((a, b) => {
        if (a.categorySortIndex !== b.categorySortIndex) return a.categorySortIndex - b.categorySortIndex;
        if (a.projectSortIndex !== b.projectSortIndex) return a.projectSortIndex - b.projectSortIndex;
        return a.title.localeCompare(b.title);
    });

    const output = allProjects.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        coverImage: p.coverImage,
        imageCount: p.imageCount,
        category: p.category,
        projectPath: p.projectPath,
        year: p.year,
        client: p.client,
        designStyle: p.designStyle,
        builtStatus: p.builtStatus,
        location: p.location
    }));

    fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(output, null, 2));
    console.log(`✅ Generated ${output.length} project entries in manifest.json`);
}

generateAllManifests();
