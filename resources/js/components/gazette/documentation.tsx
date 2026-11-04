import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Footer, GazettePage, Heading, RichText } from './index';
import '../../../css/gazette-docs.css';

export function Documentation({
    title,
    intro,
    sections,
    children,
}: {
    title: string;
    intro: string;
    sections: { id: string; label: string }[];
    children: ReactNode;
}) {
    return (
        <GazettePage
            className="gazette-docs"
            skipTo="#documentation"
            header={
                <header className="docs-header">
                    <a href="/option-2" className="docs-wordmark">
                        The Six Family
                    </a>
                    <nav aria-label="Design system">
                        <a
                            href="/styleguide"
                            aria-current={
                                title === 'Styleguide' ? 'page' : undefined
                            }
                        >
                            Styleguide
                        </a>
                        <a
                            href="/components"
                            aria-current={
                                title === 'Components' ? 'page' : undefined
                            }
                        >
                            Components
                        </a>
                        <a href="/option-2">The mockup</a>
                    </nav>
                </header>
            }
            footer={
                <Footer
                    back={{ href: '#gazette-top', label: 'Back to the top' }}
                >
                    The Six Family / Design system / 2026
                </Footer>
            }
        >
            <Head title={`${title} | The Six Family`} />
            <div className="docs-intro" id="documentation" tabIndex={-1}>
                <Heading as="h1">{title}</Heading>
                <RichText>
                    <p>{intro}</p>
                </RichText>
            </div>
            <div className="docs-layout">
                <nav className="docs-index" aria-label="On this page">
                    <p>On this page</p>
                    {sections.map((section) => (
                        <a key={section.id} href={`#${section.id}`}>
                            {section.label}
                        </a>
                    ))}
                </nav>
                <div className="docs-content">{children}</div>
            </div>
        </GazettePage>
    );
}

export function DocSection({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section
            className="docs-section"
            id={id}
            aria-labelledby={`${id}-heading`}
        >
            <Heading id={`${id}-heading`}>{title}</Heading>
            {children}
        </section>
    );
}

export function Code({ children }: { children: string }) {
    return (
        <pre className="docs-code" tabIndex={0} aria-label="Code example">
            <code>{children}</code>
        </pre>
    );
}
