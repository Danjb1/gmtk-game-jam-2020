# Herding Cats | GMTK Game Jam 2020

This is the Cat Herders' entry to the GMTK Game Jam 2020.

The Jam is a 48 hour game making marathon, focused on design, mechanics, and clever ideas. It runs from July 10th, at 8PM UK time, to July 12th, at 8PM UK time.

[Read more](https://itch.io/jam/gmtk-2020)

## Discord

**[Official](https://discord.gg/ewRbsQS)**

**[Team](https://discord.gg/uF5QS9R)**

## Getting Started

1. Install npm
1. Run `npm i` to install dependancies
1. Run `npm run start` to start the local server
1. Open http://localhost:6543/ to view the game

## Packaging for itch.io

1. Run `npm run build`
1. Copy `index.html` to `dist`
1. Copy `styles.css` to `dist`
1. Copy `images` to `dist`
1. Copy `sounds` to `dist`
1. Delete `dist/images/original`
1. Delete `dist/images/catsprite.psd`
1. Delete `dist/images/sprite-guide.md`

### Outstanding Problem

Page is being loaded from:
https://v6p9d9t4.ssl.hwcdn.net/html/2465024/index.html

But images are being loaded from:
https://v6p9d9t4.ssl.hwcdn.net/html/images/sprites.json

This happens even when `SPRITES_SRC` in `assets.ts` is changed to './images/sprites.json'.
