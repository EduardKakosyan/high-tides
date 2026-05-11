/* eslint-disable no-undef, no-console */
// One-off: take the logo PNG and key out the near-white background to
// transparency. Run with: pnpm exec node scripts/strip-logo-bg.mjs
//
// Strategy: sample the top-left pixel as the background colour, then
// for every pixel within `TOLERANCE` of that colour scale its alpha
// proportional to how far it is from the background — so anti-aliased
// edges keep their soft falloff instead of becoming jagged.

import sharp from "sharp";

const FILE = "public/logo.png";
const TOLERANCE = 28;

const { data, info } = await sharp(FILE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const bgR = data[0];
const bgG = data[1];
const bgB = data[2];

console.log(
  `Background sample: rgb(${bgR}, ${bgG}, ${bgB})  size ${info.width}x${info.height}`,
);

const out = Buffer.from(data);
let stripped = 0;
let softened = 0;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const dr = Math.abs(r - bgR);
  const dg = Math.abs(g - bgG);
  const db = Math.abs(b - bgB);
  const maxDelta = Math.max(dr, dg, db);

  if (maxDelta < TOLERANCE) {
    const alpha = Math.round((maxDelta / TOLERANCE) * 255);
    out[i + 3] = alpha;
    if (alpha === 0) stripped++;
    else softened++;
  }
}

await sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(FILE);

console.log(
  `Wrote ${FILE}: ${stripped} pixels fully transparent, ${softened} softened`,
);
