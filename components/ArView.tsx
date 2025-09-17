import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DetectionMode } from '../types';
import { jewelryCatalog, FINGER_MAP, EAR_PLACEMENT_POINTS_LEFT, EAR_PLACEMENT_POINTS_RIGHT } from '../constants';
import IconButton from './IconButton';
import JewelryCarousel from './JewelryCarousel';
import FingerSelector from './FingerSelector';
import JewelAdjuster from './NecklaceAdjuster';
import { BackIcon, SnapshotIcon, AdjustIcon } from './Icons';

declare const handPoseDetection: any;
declare const faceLandmarksDetection: any;

interface ArViewProps {
    mode: DetectionMode;
    onBack: () => void;
}

const ArView: React.FC<ArViewProps> = ({ mode, onBack }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const detectorRef = useRef<any>(null);
    const requestRef = useRef<number | null>(null);
    
    const [isVisible, setIsVisible] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>(mode === 'rings' ? 'environment' : 'user');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [detections, setDetections] = useState<any[]>([]);
    const [handedness, setHandedness] = useState<'left' | 'right'>('left');
    
    const [activeJewelId, setActiveJewelId] = useState<string | null>(null);
    const [activeFinger, setActiveFinger] = useState<string>('ring');
    const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);
    const [isAdjusterVisible, setIsAdjusterVisible] = useState<boolean>(false);
    const [jewelAdjustments, setJewelAdjustments] = useState<{ [key: string]: { scale?: number; offsetX?: number; offsetY?: number } }>({});

    const [countdown, setCountdown] = useState<string>('');
    const [showFlash, setShowFlash] = useState<boolean>(false);

    const setupCamera = useCallback(async (currentFacingMode: 'user' | 'environment') => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: currentFacingMode } });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
                await videoRef.current.play();
                if(canvasRef.current && videoRef.current){
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                }
            }
        } catch (error) {
            console.error("Error setting up camera:", error);
            alert("No se pudo iniciar la cámara.");
            onBack();
        }
    }, [stream, onBack]);

    const createDetector = useCallback(async () => {
        if (mode === 'rings') {
            const model = handPoseDetection.SupportedModels.MediaPipeHands;
            const detectorConfig = { runtime: 'mediapipe', solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands', modelType: 'full' };
            detectorRef.current = await handPoseDetection.createDetector(model, detectorConfig);
        } else { // 'necklaces' or 'earrings'
            const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
            const detectorConfig = { runtime: 'mediapipe', solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh', refineLandmarks: true };
            detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
        }
    }, [mode]);

    useEffect(() => {
        setIsVisible(true);
        const newFacingMode = mode === 'rings' ? 'environment' : 'user';
        setFacingMode(newFacingMode);
        setupCamera(newFacingMode);
        createDetector();

        const firstJewel = Object.keys(jewelryCatalog).find(id => jewelryCatalog[id].type === mode);
        if (firstJewel) setActiveJewelId(firstJewel);
        
        return () => {
            setIsVisible(false);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if(requestRef.current) cancelAnimationFrame(requestRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, createDetector]);


    const detect = useCallback(async () => {
        if (detectorRef.current && videoRef.current && !videoRef.current.paused && videoRef.current.readyState >= 3) {
            let newDetections = [];
            if (mode === 'rings') {
                newDetections = await detectorRef.current.estimateHands(videoRef.current);
                if (newDetections.length > 0) {
                    setHandedness(newDetections[0].handedness === 'Right' ? 'right' : 'left');
                }
            } else { // 'necklaces' or 'earrings'
                newDetections = await detectorRef.current.estimateFaces(videoRef.current);
            }
            setDetections(newDetections);
        }
    }, [mode]);
    
    const drawRing = useCallback((ctx: CanvasRenderingContext2D, hands: any[]) => {
        const jewel = activeJewelId ? jewelryCatalog[activeJewelId] : null;
        if (!jewel || !jewel.loaded) return;

        for (const hand of hands) {
            const p1 = hand.keypoints[FINGER_MAP[activeFinger]];
            const p2 = hand.keypoints[FINGER_MAP[activeFinger] + 1];
            if (!p1 || !p2) continue;

            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) + Math.PI / 2;
            const fingerWidth = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
            const ringWidth = fingerWidth * jewel.scale;
            const ringHeight = ringWidth * (jewel.image.height / jewel.image.width);
            let midX = (p1.x + p2.x) / 2;
            let midY = (p1.y + p2.y) / 2;

            ctx.save();
            if (facingMode === 'user') {
                midX = ctx.canvas.width - midX;
            }
            ctx.translate(midX, midY);
            ctx.rotate(angle);
            ctx.drawImage(jewel.image, -ringWidth / 2, -ringHeight / 2, ringWidth, ringHeight);
            ctx.restore();
        }
    }, [activeJewelId, activeFinger, facingMode]);
    
    const drawNecklace = useCallback((ctx: CanvasRenderingContext2D, faces: any[]) => {
        if (!activeJewelId) return;
        const baseJewel = jewelryCatalog[activeJewelId];
        const adjustments = jewelAdjustments[activeJewelId];
        const jewel = { 
            ...baseJewel, 
            scale: adjustments?.scale ?? baseJewel.scale,
            offsetY: adjustments?.offsetY ?? baseJewel.offsetY
        };
        if (!jewel.loaded || typeof jewel.offsetY === 'undefined') return;

        for (const face of faces) {
            const leftEyeInner = face.keypoints[133];
            const rightEyeInner = face.keypoints[362];
            const chin = face.keypoints[152];
            const noseTip = face.keypoints[1];
            if (!leftEyeInner || !rightEyeInner || !chin || !noseTip) continue;

            const midX = noseTip.x;
            const angle = Math.atan2(rightEyeInner.y - leftEyeInner.y, rightEyeInner.x - leftEyeInner.x);
            const eyeDistance = Math.sqrt(Math.pow(leftEyeInner.x - rightEyeInner.x, 2) + Math.pow(leftEyeInner.y - rightEyeInner.y, 2));
            const jewelWidth = eyeDistance * jewel.scale * 4.0;
            const jewelHeight = jewelWidth * (jewel.image.height / jewel.image.width);
            const baseAnchorY = chin.y;
            const scaledOffsetY = (jewel.offsetY / 100) * eyeDistance;
            const finalY = baseAnchorY + scaledOffsetY;
            const finalX = facingMode === 'user' ? ctx.canvas.width - midX : midX;

            ctx.save();
            ctx.translate(finalX, finalY);
            ctx.rotate(angle);
            ctx.drawImage(jewel.image, -jewelWidth / 2, -jewelHeight / 2, jewelWidth, jewelHeight);
            ctx.restore();
        }
    }, [activeJewelId, facingMode, jewelAdjustments]);

    const drawEarring = useCallback((ctx: CanvasRenderingContext2D, faces: any[]) => {
        if (!activeJewelId) return;
        const baseJewel = jewelryCatalog[activeJewelId];
        const adjustments = jewelAdjustments[activeJewelId];
        const jewel = { 
            ...baseJewel, 
            scale: adjustments?.scale ?? baseJewel.scale,
            offsetX: adjustments?.offsetX ?? baseJewel.offsetX,
            offsetY: adjustments?.offsetY ?? baseJewel.offsetY
        };
        if (!jewel.loaded || typeof jewel.offsetX === 'undefined' || typeof jewel.offsetY === 'undefined') return;
        
        const EAR_PLACEMENT_LOBE = 1;

        for (const face of faces) {
            const leftEye = face.keypoints[133];
            const rightEye = face.keypoints[362];
            const noseTip = face.keypoints[1];
            if (!leftEye || !rightEye || !noseTip) continue;

            const eyeDistance = Math.sqrt(Math.pow(leftEye.x - rightEye.x, 2) + Math.pow(leftEye.y - rightEye.y, 2));
            const drawOnEar = (isLeft: boolean) => {
                const placementMap = isLeft ? EAR_PLACEMENT_POINTS_LEFT : EAR_PLACEMENT_POINTS_RIGHT;
                const anchorPoint = face.keypoints[placementMap[EAR_PLACEMENT_LOBE]];
                const orientationPoint = face.keypoints[isLeft ? 234 : 454]; 
                if (!anchorPoint || !orientationPoint) return;
                
                // Vector from nose to ear anchor to push earring "outward"
                const vecX = anchorPoint.x - noseTip.x;
                const vecY = anchorPoint.y - noseTip.y;
                const len = Math.sqrt(vecX * vecX + vecY * vecY);
                if (len === 0) return;
                const normX = vecX / len;
                const normY = vecY / len;

                const angle = Math.atan2(orientationPoint.y - anchorPoint.y, orientationPoint.x - anchorPoint.x) - Math.PI / 2;
                const jewelWidth = eyeDistance * jewel.scale * 0.4;
                const jewelHeight = jewelWidth * (jewel.image.height / jewel.image.width);

                let basePosX = anchorPoint.x + normX * jewel.offsetX;
                let finalY = anchorPoint.y + normY * jewel.offsetX + jewel.offsetY;
                let finalX = facingMode === 'user' ? ctx.canvas.width - basePosX : basePosX;
                
                ctx.save();
                ctx.translate(finalX, finalY);
                ctx.rotate(angle);
                ctx.drawImage(jewel.image, -jewelWidth / 2, -jewelHeight / 2, jewelWidth, jewelHeight);
                ctx.restore();
            };
            
            drawOnEar(true);
            drawOnEar(false);
        }
    }, [activeJewelId, facingMode, jewelAdjustments]);


    const renderLoop = useCallback(() => {
        detect();
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                if (facingMode === 'user') {
                    ctx.scale(-1, 1);
                    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
                } else {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                }
                ctx.restore();

                if (detections.length > 0) {
                    if (mode === 'rings') drawRing(ctx, detections);
                    else if (mode === 'necklaces') drawNecklace(ctx, detections);
                    else if (mode === 'earrings') drawEarring(ctx, detections);
                }
            }
        }
        requestRef.current = requestAnimationFrame(renderLoop);
    }, [detect, facingMode, detections, mode, drawRing, drawNecklace, drawEarring]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(renderLoop);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [renderLoop]);

    const takeSnapshot = useCallback(() => {
        if (!canvasRef.current) return;
        setShowFlash(true);
        const mainCanvas = canvasRef.current;
        const snapshotCanvas = document.createElement('canvas');
        snapshotCanvas.width = mainCanvas.width;
        snapshotCanvas.height = mainCanvas.height;
        const ctx = snapshotCanvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(mainCanvas, 0, 0);

        const finalizeAndDownload = () => {
            const urlText = 'www.vernice.com.ar';
            const textMargin = snapshotCanvas.width * 0.04;
            const fontSize = Math.max(16, Math.round(snapshotCanvas.width / 45));
            ctx.font = `bold ${fontSize}px Montserrat`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 5;
            ctx.fillText(urlText, snapshotCanvas.width / 2, snapshotCanvas.height - textMargin);
            
            const link = document.createElement('a');
            link.download = 'vernice-virtual-try-on.png';
            link.href = snapshotCanvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.src = 'https://i.ibb.co/tMbs4vmc/LOGOletrabl.png'; 
        logo.onload = () => {
            const logoMargin = snapshotCanvas.width * 0.04;
            const logoHeight = snapshotCanvas.height * 0.06;
            const logoWidth = logo.width * (logoHeight / logo.height);
            ctx.globalAlpha = 0.8;
            ctx.drawImage(logo, logoMargin, logoMargin, logoWidth, logoHeight);
            ctx.globalAlpha = 1.0;
            finalizeAndDownload();
        };
        logo.onerror = () => {
            console.error("Failed to load watermark logo.");
            finalizeAndDownload();
        }
        
        setTimeout(() => {
            setShowFlash(false);
            setCountdown('');
        }, 300);
    }, []);

    const handleSnapshotClick = useCallback(() => {
        if (countdown) return;
        setCountdown('3');
        setTimeout(() => setCountdown('2'), 1000);
        setTimeout(() => setCountdown('1'), 2000);
        setTimeout(() => setCountdown('Sonría :)'), 3000);
        setTimeout(() => {
            takeSnapshot();
        }, 3500);
    }, [countdown, takeSnapshot]);

    const handleCloseCarousel = useCallback(() => setIsCarouselVisible(false), []);
    const createAdjustmentHandler = (field: 'scale' | 'offsetX' | 'offsetY') => (newValue: number) => {
        if (!activeJewelId) return;
        setJewelAdjustments(prev => ({ ...prev, [activeJewelId]: { ...prev[activeJewelId], [field]: newValue }}));
    };
    const handleScaleChange = createAdjustmentHandler('scale');
    const handleOffsetXChange = createAdjustmentHandler('offsetX');
    const handleOffsetYChange = createAdjustmentHandler('offsetY');
    
    const activeJewel = activeJewelId ? jewelryCatalog[activeJewelId] : null;
    const activeJewelAdjustments = activeJewelId ? jewelAdjustments[activeJewelId] : null;
    const currentScale = activeJewelAdjustments?.scale ?? activeJewel?.scale ?? 1;
    const currentOffsetX = activeJewelAdjustments?.offsetX ?? activeJewel?.offsetX ?? 0;
    const currentOffsetY = activeJewelAdjustments?.offsetY ?? activeJewel?.offsetY ?? 0;
    const isCountingDown = countdown !== '';

    return (
        <div className={`relative w-full h-full transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <video ref={videoRef} id="ar-video" playsInline autoPlay muted className="hidden"></video>
            <canvas ref={canvasRef} id="ar-canvas" className="absolute top-0 left-0 w-full h-full object-cover"></canvas>
            
            {isCountingDown && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-50 pointer-events-none">
                    <p className={`text-white font-bold animate-ping-pong select-none ${countdown === 'Sonría :)' ? 'text-7xl' : 'text-9xl'}`}>{countdown}</p>
                </div>
            )}
            {showFlash && <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-flash"></div>}
            
            <div id="ui-container" className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <IconButton position="top-left" onClick={onBack} title="Volver"><BackIcon /></IconButton>
                <IconButton position="top-right" onClick={handleSnapshotClick} title="Tomar foto" disabled={isCountingDown}><SnapshotIcon /></IconButton>
                
                {mode === 'rings' && (
                    <>
                        <div className={`absolute top-1/2 -translate-y-1/2 ${handedness === 'right' ? 'left-5' : 'right-5'} pointer-events-auto`}>
                            <div className="relative">
                                <button onClick={() => setIsCarouselVisible(!isCarouselVisible)} className="bg-[rgba(24,21,22,0.8)] border-2 border-[#D5B488] text-[#D5B488] rounded-xl px-4 py-2.5 text-sm">Joyas</button>
                                <JewelryCarousel isVisible={isCarouselVisible} mode={mode} activeJewelId={activeJewelId} onSelectJewel={setActiveJewelId} handedness={handedness === 'right' ? 'left' : 'right'} onClose={handleCloseCarousel} />
                            </div>
                        </div>
                        <FingerSelector activeFinger={activeFinger} onSelectFinger={setActiveFinger} handedness={handedness} />
                    </>
                )}

                {(mode === 'necklaces' || mode === 'earrings') && (
                     <>
                        <div className="absolute top-1/2 -translate-y-1/2 left-5 pointer-events-auto">
                            <div className="relative">
                                <button onClick={() => setIsCarouselVisible(!isCarouselVisible)} className="bg-[rgba(24,21,22,0.8)] border-2 border-[#D5B488] text-[#D5B488] rounded-xl px-4 py-2.5 text-sm">Joyas</button>
                                <JewelryCarousel isVisible={isCarouselVisible} mode={mode} activeJewelId={activeJewelId} onSelectJewel={setActiveJewelId} handedness={'left'} onClose={handleCloseCarousel} />
                            </div>
                        </div>

                        
                        <IconButton position="bottom-right" onClick={() => setIsAdjusterVisible(prev => !prev)} title="Ajustar Joya">
                            <AdjustIcon />
                        </IconButton>
                        <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 w-full max-w-xs pointer-events-auto flex flex-col gap-3 transition-transform duration-300 ease-in-out ${isAdjusterVisible ? 'translate-y-0' : 'translate-y-[150%]'}`}>
                            {activeJewel && (
                                <JewelAdjuster
                                    scale={currentScale}
                                    onScaleChange={handleScaleChange}
                                    offsetX={mode === 'earrings' ? currentOffsetX : undefined}
                                    onOffsetXChange={mode === 'earrings' ? handleOffsetXChange : undefined}
                                    offsetY={currentOffsetY}
                                    onOffsetYChange={handleOffsetYChange}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
            <style>
                {`
                    @keyframes ping-pong { 0% { transform: scale(1.2); opacity: 0.8; } 50% { transform: scale(1.5); opacity: 1; } 100% { transform: scale(1.2); opacity: 0.8; } }
                    .animate-ping-pong { animation: ping-pong 1s ease-in-out infinite; text-shadow: 0 0 15px rgba(255, 255, 255, 0.7); }
                    @keyframes flash-anim { from { opacity: 0.9; } to { opacity: 0; } }
                    .animate-flash { animation: flash-anim 0.3s ease-out forwards; }
                `}
            </style>
        </div>
    );
};

export default ArView;