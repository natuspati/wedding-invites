import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const galleryDir = "src/assets/gallery";
const files = await fs.readdir(galleryDir);

for (const file of files) {
  if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
  const input = path.join(galleryDir, file);
  const output = path.join(galleryDir, file.replace(/\.(png|jpg|jpeg)$/i, ".webp"));
  await sharp(input).webp({ quality: 75 }).toFile(output);
  console.log(`✓ ${file} → ${path.basename(output)}`);
}
