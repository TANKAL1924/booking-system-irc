import React, { useState, useCallback, useMemo, memo } from 'react';

interface AppImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
    onClick?: () => void;
    fallbackSrc?: string;
    loading?: 'lazy' | 'eager';
    // next/image legacy props — accepted but ignored
    unoptimized?: boolean;
    quality?: number;
    placeholder?: string;
    blurDataURL?: string;
    [key: string]: any;
}

const AppImage = memo(function AppImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    fill = false,
    onClick,
    fallbackSrc = '/assets/images/no_image.png',
    loading = 'lazy',
    // next/image-only props — discarded so they don't reach the DOM
    unoptimized: _unoptimized,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    sizes: _sizes,
    ...props
}: AppImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleError = useCallback(() => {
        if (!hasError && imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
            setHasError(true);
        }
        setIsLoading(false);
    }, [hasError, imageSrc, fallbackSrc]);

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        setHasError(false);
    }, []);

    const imageClassName = useMemo(() => {
        const classes = [className];
        if (isLoading) classes.push('bg-gray-200');
        if (onClick) classes.push('cursor-pointer hover:opacity-90 transition-opacity duration-200');
        return classes.filter(Boolean).join(' ');
    }, [className, isLoading, onClick]);

    if (fill) {
        return (
            <div className="relative" style={{ width: '100%', height: '100%' }}>
                <img
                    src={imageSrc}
                    alt={alt}
                    className={imageClassName}
                    loading={priority ? 'eager' : loading}
                    onError={handleError}
                    onLoad={handleLoad}
                    onClick={onClick}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    {...props}
                />
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            width={width || 400}
            height={height || 300}
            className={imageClassName}
            loading={priority ? 'eager' : loading}
            onError={handleError}
            onLoad={handleLoad}
            onClick={onClick}
            {...props}
        />
    );
});

export default AppImage;

