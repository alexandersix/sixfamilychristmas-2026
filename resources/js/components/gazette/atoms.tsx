import { useLayoutEffect, useRef } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function DisplayLine({ children }: { children: string }) {
    const ref = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const line = ref.current;
        const parent = line?.parentElement;
        if (!line || !parent) return;

        const fit = () => {
            line.style.removeProperty('transform');
            const scale = new DOMMatrix(getComputedStyle(line).transform).a;
            line.style.transform = `scaleX(${Math.min(scale, parent.clientWidth / (line.scrollWidth + 1))})`;
        };
        const observer = new ResizeObserver(fit);
        observer.observe(parent);
        document.fonts.addEventListener('loadingdone', fit);
        fit();

        return () => {
            observer.disconnect();
            document.fonts.removeEventListener('loadingdone', fit);
        };
    }, [children]);

    return <span ref={ref}>{children}</span>;
}

export function Heading({
    as: Tag = 'h2',
    className,
    ...props
}: ComponentProps<'h2'> & { as?: 'h1' | 'h2' | 'h3' }) {
    return <Tag className={cn('gazette-heading', className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<'p'>) {
    return <p className={cn('gazette-label', className)} {...props} />;
}

export function RichText({ className, ...props }: ComponentProps<'div'>) {
    return <div className={cn('gazette-rich-text', className)} {...props} />;
}

export function Rule({
    variant = 'thin',
    className,
    ...props
}: ComponentProps<'hr'> & { variant?: 'thin' | 'ink' | 'double' }) {
    return (
        <hr
            className={cn('gazette-rule', `gazette-rule-${variant}`, className)}
            {...props}
        />
    );
}

export function ActionLink({ className, ...props }: ComponentProps<'a'>) {
    return <a className={cn('gazette-link', className)} {...props} />;
}

export function Button({
    className,
    type = 'button',
    ...props
}: ComponentProps<'button'>) {
    return (
        <button
            type={type}
            className={cn('gazette-button', className)}
            {...props}
        />
    );
}

export function Image({
    priority = false,
    className,
    alt,
    focalPoint,
    style,
    onLoad,
    ...props
}: Omit<ComponentProps<'img'>, 'alt'> & {
    alt: string;
    priority?: boolean;
    focalPoint?: { x: number; y: number };
}) {
    const ref = useRef<HTMLImageElement>(null);

    useLayoutEffect(() => {
        const image = ref.current;
        if (!image || !focalPoint) return;

        const position = () => {
            if (!image.naturalWidth || !image.naturalHeight) return;
            const { width, height } = image.getBoundingClientRect();
            const scale = Math.max(
                width / image.naturalWidth,
                height / image.naturalHeight,
            );
            const scaledWidth = image.naturalWidth * scale;
            const scaledHeight = image.naturalHeight * scale;
            // Center the selected source point, clamping the crop to the image edges.
            const offset = (size: number, frame: number, focus: number) =>
                Math.min(
                    0,
                    Math.max(frame - size, frame / 2 - (size * focus) / 100),
                );
            image.style.objectPosition = `${offset(scaledWidth, width, focalPoint.x)}px ${offset(scaledHeight, height, focalPoint.y)}px`;
        };
        const observer = new ResizeObserver(position);
        observer.observe(image);
        image.addEventListener('load', position);
        position();

        return () => {
            observer.disconnect();
            image.removeEventListener('load', position);
        };
    }, [focalPoint, props.src]);

    return (
        <img
            ref={ref}
            className={cn('gazette-image', className)}
            alt={alt}
            style={style}
            onLoad={onLoad}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            {...props}
        />
    );
}

export function SkipLink({ className, ...props }: ComponentProps<'a'>) {
    return <a className={cn('gazette-skip', className)} {...props} />;
}
