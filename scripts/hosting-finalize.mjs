import { existsSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const sitemap = join(publicDir, "sitemap.xml");

if (existsSync(sitemap) && readFileSync(sitemap, "utf8").trim() === "Not found") {
  rmSync(sitemap);
}

// Astro still emits the inquiry script when the form is closed. Drop client
// assets that no page, stylesheet, or kept script references.
function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

const astroDir = `${sep}_astro${sep}`;
let removed = true;
while (removed) {
  removed = false;
  const files = walk(publicDir);
  const assets = files.filter((file) => file.includes(astroDir));
  const roots = files.filter((file) => !file.includes(astroDir));
  let corpus = roots.map((file) => readFileSync(file, "utf8")).join("\n");
  const keep = new Set();
  let grew = true;
  while (grew) {
    grew = false;
    for (const file of assets) {
      if (keep.has(file)) continue;
      const name = file.split(sep).pop();
      if (name && corpus.includes(name)) {
        keep.add(file);
        corpus += `\n${readFileSync(file, "utf8")}`;
        grew = true;
      }
    }
  }
  for (const file of assets) {
    if (!keep.has(file)) {
      rmSync(file);
      removed = true;
    }
  }
}
