import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/.test(version)) {
    console.error('Please provide a valid semver version (e.g., 1.0.2).');
    console.log('Usage: npm run release <version>');
    process.exit(1);
}

console.log(`Bumping version to ${version}...`);

try {
    // 1. Update package.json
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.version = version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ Updated package.json');

    // 2. Update tauri.conf.json
    const tauriConfPath = path.join(rootDir, 'src-tauri', 'tauri.conf.json');
    const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
    tauriConf.version = version;
    fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
    console.log('✅ Updated tauri.conf.json');

    // 3. Update Cargo.toml
    const cargoTomlPath = path.join(rootDir, 'src-tauri', 'Cargo.toml');
    let cargoToml = fs.readFileSync(cargoTomlPath, 'utf-8');
    cargoToml = cargoToml.replace(/version\s*=\s*"[^"]+"/, `version = "${version}"`);
    fs.writeFileSync(cargoTomlPath, cargoToml);
    console.log('✅ Updated Cargo.toml');

    // 4. Update README.md download links
    const readmePath = path.join(rootDir, 'README.md');
    let readme = fs.readFileSync(readmePath, 'utf-8');
    // Handle replacing older .dmg with _x64.dmg or updating existing _x64.dmg
    readme = readme.replace(/(download\/app-v)[^\/]+(\/NotepadMac_)[a-zA-Z0-9\.-]+(\.dmg)/g, (match, p1, p2, p3) => {
        if (match.includes('_aarch64')) return `${p1}${version}${p2}${version}_aarch64${p3}`;
        if (match.includes('_x64')) return `${p1}${version}${p2}${version}_x64${p3}`;
        return `${p1}${version}${p2}${version}_x64${p3}`; // fallback convert old .dmg to _x64.dmg
    });
    fs.writeFileSync(readmePath, readme);
    console.log('✅ Updated README.md');

    // 5. Commit and tag
    execSync('git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml README.md scripts/release.js', { cwd: rootDir, stdio: 'inherit' });
    execSync(`git commit -m "chore(release): v${version}"`, { cwd: rootDir, stdio: 'inherit' });
    execSync(`git tag app-v${version}`, { cwd: rootDir, stdio: 'inherit' });

    // 6. Push
    execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });
    execSync('git push origin --tags', { cwd: rootDir, stdio: 'inherit' });

    console.log(`\n🎉 Successfully bumped version, tagged as app-v${version}, and pushed to GitHub!`);
    console.log('The GitHub Action release workflow will now build the apps and update the Homebrew cask.');

} catch (error) {
    console.error('\n❌ Release process failed:');
    console.error(error);
    process.exit(1);
}
