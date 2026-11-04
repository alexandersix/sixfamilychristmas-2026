import type { ReactNode } from 'react';
import { ActionLink, Heading, Label, RichText } from './atoms';
import { Photograph, SectionHeading } from './molecules';
import type { PhotographProps } from './molecules';

export type NavigationItem = { href: string; label: string };

export function Masthead({
    name,
    year,
    left,
    right,
    motto,
    edition,
}: {
    name: string;
    year: string;
    left: NavigationItem;
    right: NavigationItem;
    motto: string;
    edition: string;
}) {
    return (
        <header className="gazette-masthead">
            <nav className="gazette-topline" aria-label="Main navigation">
                <a href={left.href}>{left.label}</a>
                <span className="gazette-date">{year}</span>
                <a href={right.href}>{right.label}</a>
            </nav>
            <div className="gazette-name">
                <span>{name}</span>
            </div>
            <div className="gazette-running-line">
                <p>{motto}</p>
                <p>{edition}</p>
            </div>
        </header>
    );
}

export function Cover({
    id,
    title,
    photograph,
    children,
    action,
}: {
    id: string;
    title: ReactNode;
    photograph: PhotographProps;
    children: ReactNode;
    action: NavigationItem;
}) {
    return (
        <section className="gazette-cover" aria-labelledby={id}>
            <Photograph
                {...photograph}
                figureClassName="gazette-photo-cover"
                priority
            />
            <div className="gazette-cover-copy">
                <h1 id={id}>{title}</h1>
                <div className="gazette-cover-invitation">
                    <p>{children}</p>
                    <ActionLink href={action.href}>{action.label}</ActionLink>
                </div>
            </div>
        </section>
    );
}

export function Contents({
    items,
    title = 'In this edition',
    label = 'Chapters in our year',
}: {
    items: NavigationItem[];
    title?: string;
    label?: string;
}) {
    return (
        <nav className="gazette-contents" aria-label={label}>
            <p>{title}</p>
            {items.map((item, index) => (
                <a key={item.href} href={item.href}>
                    {String(index + 1).padStart(2, '0')}{' '}
                    <span>{item.label}</span>
                </a>
            ))}
        </nav>
    );
}

export type ChapterProps = {
    id: string;
    number: number;
    title: ReactNode;
    note?: string;
    featured?: boolean;
    photos:
        | [PhotographProps]
        | [PhotographProps, PhotographProps]
        | [PhotographProps, PhotographProps, PhotographProps]
        | [PhotographProps, PhotographProps, PhotographProps, PhotographProps];
    children: ReactNode;
};

export function Chapter({
    id,
    number,
    title,
    note,
    featured = false,
    photos,
    children,
}: ChapterProps) {
    const heading = (
        <SectionHeading
            id={`${id}-title`}
            label={`Chapter ${String(number).padStart(2, '0')}`}
            title={title}
            note={note}
        />
    );
    const body = <RichText>{children}</RichText>;
    const figures = photos.map((photo, index) => (
        <Photograph key={index} {...photo} />
    ));

    return (
        <section
            className={`gazette-chapter gazette-event-${photos.length}${featured ? ' gazette-chapter-featured' : ''}`}
            id={id}
            aria-labelledby={`${id}-title`}
        >
            {photos.length === 1 ? (
                <div className="gazette-single-layout">
                    <div className="gazette-single-copy">
                        {heading}
                        {body}
                        {note && <p className="gazette-postscript">{note}</p>}
                    </div>
                    {figures}
                </div>
            ) : (
                <>
                    {heading}
                    {photos.length === 2 && (
                        <div className="gazette-pair-layout">
                            {figures[0]}
                            <div className="gazette-pair-aside">
                                {figures[1]}
                                {body}
                            </div>
                        </div>
                    )}
                    {photos.length === 3 && (
                        <div className="gazette-trio-layout">
                            {figures[0]}
                            <div className="gazette-trio-aside">
                                {body}
                                <div className="gazette-photo-pair">
                                    {figures.slice(1)}
                                </div>
                            </div>
                        </div>
                    )}
                    {photos.length === 4 && (
                        <div className="gazette-four-layout">
                            {body}
                            <div className="gazette-photo-quartet">
                                {figures}
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export function Letter({
    id,
    label,
    title,
    year,
    salutation,
    children,
    signature,
}: {
    id: string;
    label: string;
    title: ReactNode;
    year?: string;
    salutation: string;
    children: ReactNode;
    signature: ReactNode;
}) {
    return (
        <section
            className="gazette-letter"
            id={id}
            aria-labelledby={`${id}-title`}
        >
            <div className="gazette-letter-heading">
                <Label>{label}</Label>
                <Heading id={`${id}-title`}>{title}</Heading>
                {year && (
                    <span className="gazette-letter-year" aria-hidden="true">
                        {year}
                    </span>
                )}
            </div>
            <div className="gazette-letter-body">
                <p className="gazette-salutation">{salutation}</p>
                <RichText>{children}</RichText>
                {signature}
            </div>
        </section>
    );
}

export function Footer({
    children,
    back,
    credits,
}: {
    children: ReactNode;
    back: NavigationItem;
    credits?: ReactNode;
}) {
    return (
        <footer className="gazette-footer">
            <div className="gazette-footer-line">
                <p>{children}</p>
                <a href={back.href}>{back.label}</a>
            </div>
            {credits}
        </footer>
    );
}
