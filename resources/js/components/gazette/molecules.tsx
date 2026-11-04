import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Heading, Image, Label } from './atoms';

export type PhotographProps = ComponentProps<typeof Image> & {
    caption?: ReactNode;
    figureClassName?: string;
};

export function Photograph({
    caption,
    figureClassName,
    ...image
}: PhotographProps) {
    return (
        <figure className={cn('gazette-photograph', figureClassName)}>
            <Image {...image} />
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    );
}

export function SectionHeading({
    id,
    label,
    title,
    note,
}: {
    id: string;
    label: string;
    title: ReactNode;
    note?: string;
}) {
    return (
        <div className="gazette-section-heading">
            <Label>{label}</Label>
            <Heading id={id}>{title}</Heading>
            {note && <p className="gazette-margin-note">{note}</p>}
        </div>
    );
}

export function Disclosure({
    summary,
    children,
    className,
    ...props
}: Omit<ComponentProps<'details'>, 'children'> & {
    summary: ReactNode;
    children: ReactNode;
}) {
    return (
        <details className={cn('gazette-credits', className)} {...props}>
            <summary>{summary}</summary>
            {children}
        </details>
    );
}

export function Signature({
    name,
    children = 'With love,',
}: {
    name: string;
    children?: ReactNode;
}) {
    return (
        <p className="gazette-signature">
            {children}
            <br />
            <span>{name}</span>
        </p>
    );
}
