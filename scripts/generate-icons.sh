#!/bin/bash
# Generate app icons from SVG sources using sharp CLI
set -e

ASSETS="assets/images"
SCRIPTS="scripts"

echo "Generating app icons..."

# iOS app icon (1024x1024) - rounded corners handled by OS
npx sharp -i "$SCRIPTS/icon.svg" -o "$ASSETS/icon.png" resize 1024 1024

# Favicon (48x48)
npx sharp -i "$SCRIPTS/favicon.svg" -o "$ASSETS/favicon.png" resize 48 48

# Android adaptive icon foreground (1024x1024, needs safe zone padding)
npx sharp -i "$SCRIPTS/android-foreground.svg" -o "$ASSETS/android-icon-foreground.png" resize 1024 1024

# Android adaptive icon background (solid color)
npx sharp -i "$SCRIPTS/android-background.svg" -o "$ASSETS/android-icon-background.png" resize 1024 1024

# Android monochrome icon
npx sharp -i "$SCRIPTS/android-monochrome.svg" -o "$ASSETS/android-icon-monochrome.png" resize 1024 1024

# Splash screen icon
npx sharp -i "$SCRIPTS/splash-icon.svg" -o "$ASSETS/splash-icon.png" resize 512 512

echo "Done! Icons generated in $ASSETS/"
