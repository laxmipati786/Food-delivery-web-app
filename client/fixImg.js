import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
}

const images = [
    { name: 'haldirams.jpg', url: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=800' },
    { name: 'chickentikka.jpg', url: 'https://images.unsplash.com/photo-1599487405230-e5bf7e05e269?w=500' },
    { name: 'fries.jpg', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500' },
    { name: 'zinger.jpg', url: 'https://images.unsplash.com/photo-1615444743209-57e0523689f9?w=500' },
    { name: 'chole.jpg', url: 'https://images.unsplash.com/photo-1626132540026-6635ae4f02ec?w=500' },
    { name: 'rasmalai.jpg', url: 'https://images.unsplash.com/photo-1551105943-4ed671c69188?w=500' },
    { name: 'springroll.jpg', url: 'https://images.unsplash.com/photo-1609185121287-73d870a58145?w=500' },
    // A fallback working image just in case
    { name: 'fallback.jpg', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800' }
];

const downloadWithFetch = async (url, filepath) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filepath, buffer);
        console.log(`Successfully downloaded ${filepath}`);
    } catch (e) {
        console.error(`Failed to download ${url}`, e.message);
        // Copy fallback if failed
        const fallback = Buffer.from(await (await fetch(images[7].url)).arrayBuffer());
        fs.writeFileSync(filepath, fallback);
        console.log(`Used fallback for ${filepath}`);
    }
};

(async () => {
    for (const image of images) {
        const dest = path.join(publicImagesDir, image.name);
        if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
            console.log(`Downloading ${image.name}...`);
            await downloadWithFetch(image.url, dest);
        } else {
            console.log(`${image.name} already exists and looks valid.`);
        }
    }
    console.log('All missing images downloaded locally.');
})();
