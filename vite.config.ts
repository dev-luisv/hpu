import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

function extractStoredZip(zipPath: string, destination: string) {
  if (!fs.existsSync(zipPath)) return;
  fs.mkdirSync(destination, { recursive: true });

  const data = fs.readFileSync(zipPath);
  let offset = 0;

  while (offset + 30 <= data.length) {
    if (data.readUInt32LE(offset) !== 0x04034b50) break;

    const flags = data.readUInt16LE(offset + 6);
    const method = data.readUInt16LE(offset + 8);
    const compressedSize = data.readUInt32LE(offset + 18);
    const fileNameLength = data.readUInt16LE(offset + 26);
    const extraLength = data.readUInt16LE(offset + 28);

    if (flags & 0x08) throw new Error("Unsupported ZIP data descriptor");
    if (method !== 0) throw new Error("Image bundle must use ZIP_STORED");

    const nameStart = offset + 30;
    const nameEnd = nameStart + fileNameLength;
    const fileName = data.subarray(nameStart, nameEnd).toString("utf8");
    const dataStart = nameEnd + extraLength;
    const dataEnd = dataStart + compressedSize;

    if (!fileName.endsWith("/")) {
      const output = path.join(destination, fileName);
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, data.subarray(dataStart, dataEnd));
    }

    offset = dataEnd;
  }
}

function fixedImportedImages(): Plugin {
  const publicDir = path.resolve(import.meta.dirname, "client", "public");
  const zipPath = path.join(publicDir, "assets", "hpu-fixed", "imported-images.zip");
  const destination = path.join(publicDir, "assets", "hpu-fixed", "imported");

  // Extract immediately while loading the Vite config so publicDir already contains
  // the fixed images before Vite copies it into the build output.
  extractStoredZip(zipPath, destination);

  return {
    name: "hpu-fixed-imported-images",
    configureServer() {
      extractStoredZip(zipPath, destination);
    },
  };
}

export default defineConfig({
  base: "/hpu/",
  plugins: [fixedImportedImages(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
