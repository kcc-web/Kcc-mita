// eslint.config.mjs
import next from "eslint-config-next";
import tseslint from "typescript-eslint";

export default [
  ...next(), // Next.js の標準設定

  // TypeScript plugin の推奨セット（型付き）
  ...tseslint.configs.recommendedTypeChecked,

  // 共通ルール（エラー→警告に変更）
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn",
    },
  },

  // any が多いフォルダは一時的に off（必要に応じて減らす）
  {
    files: ["src/app/menu/**/*.{ts,tsx}", "src/app/result/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

