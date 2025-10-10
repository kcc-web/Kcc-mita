// postcss.config.js
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},   // ← これだけでOK（autoprefixerも内包されます）
  },
};

