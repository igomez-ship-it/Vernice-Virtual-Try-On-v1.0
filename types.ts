
export type DetectionMode = 'rings' | 'necklaces' | 'earrings';

export interface Jewel {
    type: DetectionMode;
    imageUrl: string;
    image: HTMLImageElement;
    loaded: boolean;
    scale: number;
    offsetY?: number;
    offsetX?: number;
}

export interface JewelryCatalog {
    [key: string]: Jewel;
}
