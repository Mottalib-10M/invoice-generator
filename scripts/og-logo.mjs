// Pose le logo du site (public/favicon.svg) à la place du carré à sigle dessiné par generate-og-images.mjs.
// Usage : node scripts/generate-og-images.mjs && node scripts/og-logo.mjs && node scripts/gen-icons.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
const logo = await sharp(readFileSync('public/favicon.svg'), { density: 600 }).resize(72, 72).png().toBuffer();
const out = await sharp('public/og-en.png').composite([{ input: logo, left: 80, top: 70 }]).png().toBuffer();
writeFileSync('public/og-en.png', out);
console.log('og-en.png : logo posé');
