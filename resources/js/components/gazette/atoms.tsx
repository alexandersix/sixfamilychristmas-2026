import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

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
