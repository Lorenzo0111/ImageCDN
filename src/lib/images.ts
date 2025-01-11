import sharp from "sharp";

export async function compressImage(buffer: Buffer | ArrayBuffer) {
  return await sharp(buffer, { failOn: "error" })
    .resize(256, 256, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();
}
