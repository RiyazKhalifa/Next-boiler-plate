'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { defaultAvatar } from '@/configs/imageConfig';

export default function NextImage({
    src,
    alt = '',
    fallback = defaultAvatar,
    className = '',
    priority = false,
    quality = 90,
    fill = false,
    width,
    height,
    onLoad,
    onError,
    ...props
}) {
    const containerRef = useRef(null);

    const [imageSrc, setImageSrc] = useState(src);
    const [loading, setLoading] = useState(true);
    const [isInView, setIsInView] = useState(false);

    const isLocalhost = useMemo(
        () =>
            imageSrc?.startsWith('http://localhost') ||
            imageSrc?.startsWith('http://127.0.0.1'),
        [imageSrc]
    );

    const wrapperStyle = useMemo(
        () =>
            !fill && (width || height)
                ? {
                    width: typeof width === 'number' ? `${width}px` : width,
                    height: typeof height === 'number' ? `${height}px` : height,
                }
                : undefined,
        [fill, width, height]
    );

    useEffect(() => {
        if (src !== imageSrc) {
            setImageSrc(src);
            setLoading(true);
        }
    }, [src]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        if (imageSrc !== fallback) {
            setImageSrc(fallback);
        }
        setLoading(false);
        onError?.();
    };

    const imageStyle = fill
        ? {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        }
        : {
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            ...props.style,
        };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''} ${className}`}
            style={wrapperStyle}
        >
            {/* Shimmer */}
            {loading && (
                <div className="absolute inset-0 z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primaryLighter via-backgroundPaper to-primaryLighter">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primaryLight to-transparent translate-x-full animate-shimmer-slow" />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primaryLighter to-transparent -translate-x-full -translate-y-full animate-shimmer" />
                        <div className="absolute inset-0 bg-gradient-radial from-primaryLighter via-transparent to-transparent animate-pulse" />
                    </div>
                </div>
            )}

            {/* Image */}
            {isInView &&
                (isLocalhost ? (
                    <img
                        src={imageSrc}
                        alt={alt}
                        onLoad={handleLoad}
                        onError={handleError}
                        style={imageStyle}
                        className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'
                            }`}
                        {...props}
                    />
                ) : (
                    <Image
                        src={imageSrc}
                        alt={alt}
                        fill={fill}
                        width={!fill ? width : undefined}
                        height={!fill ? height : undefined}
                        priority={priority}
                        quality={quality}
                        loading="lazy"
                        onLoad={handleLoad}
                        onError={handleError}
                        className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'
                            }`}
                        {...props}
                    />
                ))}
        </div>
    );
}
