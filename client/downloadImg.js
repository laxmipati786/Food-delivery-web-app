import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
}

const images = [
    { name: 'pizzahut.jpg', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800' },
    { name: 'burgerking.jpg', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800' },
    { name: 'biryaniblues.jpg', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800' },
    { name: 'kfc.jpg', url: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=800' },
    { name: 'haldirams.jpg', url: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=800' },
    { name: 'mainland.jpg', url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800' },

    // Dishes
    { name: 'margherita.jpg', url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500' },
    { name: 'pepperoni.jpg', url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500' },
    { name: 'garlicbread.jpg', url: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500' },
    { name: 'chocolava.jpg', url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500' },

    { name: 'vegwhopper.jpg', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500' },
    { name: 'chickenwhopper.jpg', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { name: 'fries.jpg', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500' },
    { name: 'coffee.jpg', url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500' },

    { name: 'chickenbiryani.jpg', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500' },
    { name: 'paneerbiryani.jpg', url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500' },
    { name: 'chickentikka.jpg', url: 'https://images.unsplash.com/photo-1599487405230-e5bf7e05e269?w=500' },
    { name: 'gulabjamun.jpg', url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=500' },

    { name: 'hotcrispy.jpg', url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500' },
    { name: 'zinger.jpg', url: 'https://images.unsplash.com/photo-1615444743209-57e0523689f9?w=500' },
    { name: 'popcorn.jpg', url: 'https://images.unsplash.com/photo-1562967914-01efa7e87832?w=500' },
    { name: 'pepsi.jpg', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500' },

    { name: 'chole.jpg', url: 'https://images.unsplash.com/photo-1626132540026-6635ae4f02ec?w=500' },
    { name: 'rajkachori.jpg', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500' },
    { name: 'thali.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500' },
    { name: 'rasmalai.jpg', url: 'https://images.unsplash.com/photo-1551105943-4ed671c69188?w=500' },

    { name: 'hakka.jpg', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500' },
    { name: 'kungpao.jpg', url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500' },
    { name: 'springroll.jpg', url: 'https://images.unsplash.com/photo-1609185121287-73d870a58145?w=500' },
    { name: 'manchow.jpg', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500' }
];

const download = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                download(res.headers.location, filepath).then(resolve).catch(reject);
            } else {
                res.resume();
                resolve(); // Just skip
            }
        }).on('error', reject);
    });
};

(async () => {
    for (const image of images) {
        const dest = path.join(publicImagesDir, image.name);
        if (!fs.existsSync(dest)) {
            console.log(`Downloading ${image.name}...`);
            await download(image.url, dest).catch(e => console.error(e));
        } else {
            console.log(`${image.name} already exists.`);
        }
    }
    console.log('All images downloaded locally.');
})();
