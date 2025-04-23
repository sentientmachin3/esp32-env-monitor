#!/usr/bin/zsh

BUILD_PATH=".next/standalone"

rm -rf .next

pnpm install
pnpm tsc
pnpm build
cp -r public $BUILD_PATH/ && cp -r .next/static $BUILD_PATH/.next/
cp -r $BUILD_PATH build/
