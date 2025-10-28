#!/bin/bash
# scripts/optimize-images.sh

# 前提: ImageMagick と cwebp がインストール済み
# macOS: brew install imagemagick webp
# Ubuntu: apt install imagemagick webp

PUBLIC_DIR="public/beans"

echo "🖼️  画像最適化を開始..."

# jpg, jpeg, png ファイルを処理
for img in "$PUBLIC_DIR"/*.jpg "$PUBLIC_DIR"/*.jpeg "$PUBLIC_DIR"/*.png; do
  # ファイルが存在するかチェック
  if [ -f "$img" ]; then
    filename=$(basename "$img")
    name="${filename%.*}"
    
    # WebP変換（80%品質）
    cwebp -q 80 "$img" -o "$PUBLIC_DIR/$name.webp"
    echo "✅ $filename → $name.webp"
    
    # 元ファイルも圧縮（JPEGのみ）
    if [[ "$filename" == *.jpg ]] || [[ "$filename" == *.jpeg ]]; then
      convert "$img" -quality 85 -sampling-factor 4:2:0 -strip "$img"
      echo "📦 $filename を圧縮"
    fi
  fi
done

echo "🎉 最適化完了！"