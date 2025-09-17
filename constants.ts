import { JewelryCatalog } from './types';

export const jewelryCatalog: JewelryCatalog = {
    'ring-1': { type: 'rings', imageUrl: 'https://i.ibb.co/DP4VQ1dr/1-90-quilates-anillo-de-compromi-Photoroom.png', image: new Image(), loaded: false, scale: 0.95 },
    'ring-2': { type: 'rings', imageUrl: 'https://i.ibb.co/TxVp1Ck4/Montura-Tiffany6unas2aguas1-8mm-r.png', image: new Image(), loaded: false, scale: 1.05 },
    'ring-3': { type: 'rings', imageUrl: 'https://i.ibb.co/8Dwj5YkY/Tiffanypave0-03-rosa-round0-50-S.png', image: new Image(), loaded: false, scale: 0.9 },
    'necklace-1': { type: 'necklaces', imageUrl: 'https://i.ibb.co/0xCgyhD/png-transparent-necklace-charms-pendants-body-jewellery-necklace-pendant-fashion-charms-pendants-Pho.png', image: new Image(), loaded: false, scale: 1.3, offsetY: 200 },
    'necklace-2': { type: 'necklaces', imageUrl: 'https://i.ibb.co/v6MrqKtT/png-transparent-locket-charms-pendants-necklace-jewellery-gold-necklace-pendant-heart-fashion-Photor.png', image: new Image(), loaded: false, scale: 1.5, offsetY: 230 },
    'necklace-3': { type: 'necklaces', imageUrl: 'https://i.ibb.co/8nKhXKqf/png-clipart-necklace-necklace-Photoroom-Photoroom.png', image: new Image(), loaded: false, scale: 1.1, offsetY: 180 },
    'earring-1': { type: 'earrings', imageUrl: 'https://i.ibb.co/PskQM40W/61-F4-H0x-Ihc-L.png', image: new Image(), loaded: false, scale: 1.0, offsetX: 10, offsetY: 0 },
    'earring-2': { type: 'earrings', imageUrl: 'https://i.ibb.co/JFR1fQbs/10-101002-earring-transparent-images-png-transparent-long-earrings-png.png', image: new Image(), loaded: false, scale: 1.2, offsetX: 10, offsetY: 25 },
    'earring-3': { type: 'earrings', imageUrl: 'https://i.ibb.co/WpVqqrxy/pngtree-earrings-png-image-879929.png', image: new Image(), loaded: false, scale: 1.1, offsetX: 10, offsetY: 10 },
};

// Preload images
Object.values(jewelryCatalog).forEach(jewel => {
    jewel.image.crossOrigin = "anonymous";
    jewel.image.src = jewel.imageUrl;
    jewel.image.onload = () => {
        jewel.loaded = true;
    };
});

export const FINGER_MAP: { [key: string]: number } = {
    index: 5,
    middle: 9,
    ring: 13,
    pinky: 17,
    thumb: 2,
};

export const FINGER_NAMES = ['thumb', 'index', 'middle', 'ring', 'pinky'];

export const EAR_PLACEMENT_POINTS_LEFT: { [key: number]: number } = {
    1: 137, // Earlobe Center
};

export const EAR_PLACEMENT_POINTS_RIGHT: { [key: number]: number } = {
    1: 366, // Earlobe Center
};