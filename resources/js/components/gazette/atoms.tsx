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
    ...props
}: Omit<ComponentProps<'img'>, 'alt'> & { alt: string; priority?: boolean }) {
    return (
        <img
            className={cn('gazette-image', className)}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            {...props}
        />
    );
}

export function SkipLink({ className, ...props }: ComponentProps<'a'>) {
    return <a className={cn('gazette-skip', className)} {...props} />;
}
