import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";

// O projeto usa <img> para SVGs placeholder e imagens estáticas simples.
// next/image não otimiza SVG e exigiria width/height explícitos em cada uso.
// Reavaliar se imagens raster forem adicionadas.
const compat = new FlatCompat({ baseDirectory: fileURLToPath(new URL(".", import.meta.url)) });
const config = [
  { ignores: [".next/**", "node_modules/**"] },
  ...compat.extends("next/core-web-vitals"),
  // Adicione a regra abaixo:
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;

