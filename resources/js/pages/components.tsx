import { useState } from 'react';
import type { ReactNode } from 'react';
import {
    ActionLink,
    Button,
    Chapter,
    Contents,
    Disclosure,
    Heading,
    Image,
    Label,
    Letter,
    Masthead,
    Photograph,
    RichText,
    Rule,
    SectionHeading,
    Signature,
} from '@/components/gazette';
import {
    Code,
    DocSection,
    Documentation,
} from '@/components/gazette/documentation';

function Entry({
    name,
    description,
    api,
    code,
    children,
}: {
    name: string;
    description: string;
    api: string;
    code: string;
    children?: ReactNode;
}) {
    return (
        <article
            className="docs-entry"
            id={`component-${name}`}
            aria-labelledby={`name-${name}`}
        >
            <h3 id={`name-${name}`}>{name}</h3>
            <p>{description}</p>
            <p className="docs-token">{api}</p>
            {children && <div className="docs-preview">{children}</div>}
            <Disclosure summary={`${name}: usage example`}>
                <Code>{code}</Code>
            </Disclosure>
        </article>
    );
}

const lake = {
    src: '/images/option-2/winter-1920.webp',
    srcSet: '/images/option-2/winter-960.webp 960w, /images/option-2/winter-1920.webp 1920w',
    sizes: '(max-width: 680px) 90vw, 650px',
    alt: 'A still mountain lake surrounded by forest and snow-capped peaks',
};
const bread = {
    src: '/images/option-2/bread-960.webp',
    alt: 'Fresh sourdough rolls in a striped cloth',
    caption: 'Something good to share.',
};

export default function Components() {
    const [marked, setMarked] = useState(false);
    return (
        <Documentation
            title="Components"
            intro="The building blocks of the Gazette. Start with a complete story, or compose the smaller pieces into something of your own."
            sections={[
                { id: 'start', label: 'Start here' },
                { id: 'atoms', label: 'Atoms / 8' },
                { id: 'molecules', label: 'Molecules / 4' },
                { id: 'organisms', label: 'Organisms / 6' },
                { id: 'templates', label: 'Templates / 1' },
                { id: 'pages', label: 'Pages & recipes' },
            ]}
        >
            <DocSection id="start" title="Small pieces. Complete stories.">
                <p>
                    19 components, one shared visual system. All public UI
                    components are named exports from{' '}
                    <code>@/components/gazette</code>. The previews below are
                    the actual components, not pictures of them. Open a usage
                    example for copyable JSX.
                </p>
                <Code>{`import { GazettePage, Chapter, Photograph, Heading } from '@/components/gazette';`}</Code>
                <p>
                    Atoms handle one element. Molecules combine a few elements.
                    Organisms arrange a complete section. Templates provide the
                    page shell. Pages supply real content, routes, and data. Use
                    the highest tier that fits; drop down when the composition
                    needs to be custom.
                </p>
                <p>
                    Atoms accept native HTML attributes, including className,
                    event handlers, aria-* attributes, and React refs. Image
                    requires alt. Organisms expose content slots rather than
                    hardcoded stories. GazettePage loads the CSS; use it once
                    around a page. See the <a href="/styleguide">styleguide</a>{' '}
                    for tokens and visual rules.
                </p>
            </DocSection>
            <DocSection id="atoms" title="Atoms">
                <Entry
                    name="Heading"
                    description="Slab-serif headings for stories and custom sections. Choose h1, h2, or h3 for document structure; the default is h2."
                    api="atoms.tsx / as?: 'h1' | 'h2' | 'h3'; native heading props"
                    code={
                        '<Heading as="h2" id="winter-title">Winter, together.</Heading>'
                    }
                >
                    <Heading as="h3">Winter, together.</Heading>
                </Entry>
                <Entry
                    name="Label"
                    description="A short chapter number or editorial label. Keep tracked uppercase text to a few words; never use it for essential body copy."
                    api="atoms.tsx / native paragraph props"
                    code={'<Label>Chapter 01</Label>'}
                >
                    <Label>Chapter 01</Label>
                </Entry>
                <Entry
                    name="RichText"
                    description="A readable prose measure with paragraph rhythm. Supply semantic paragraphs, emphasis, lists, and inline links, not an HTML string."
                    api="atoms.tsx / native div props; children: ReactNode"
                    code={
                        '<RichText><p>A quiet morning.</p><p>A memory worth keeping.</p></RichText>'
                    }
                >
                    <RichText>
                        <p>A quiet morning. A memory worth keeping.</p>
                        <p>Give each thought a little room.</p>
                    </RichText>
                </Entry>
                <Entry
                    name="Rule"
                    description="A semantic separator. Thin is for minor divisions, ink for strong boundaries, and double for the end of a spread."
                    api="atoms.tsx / variant?: 'thin' | 'ink' | 'double'; native hr props"
                    code={
                        '<Rule />\n<Rule variant="ink" />\n<Rule variant="double" />'
                    }
                >
                    <Rule />
                    <Rule variant="ink" />
                    <Rule variant="double" />
                </Entry>
                <Entry
                    name="ActionLink"
                    description="A red, underlined editorial invitation. Use href for navigation or a jump within the page; use Button for an action."
                    api="atoms.tsx / native anchor props; provide a meaningful href"
                    code={
                        '<ActionLink href="#winter">Read our winter story</ActionLink>'
                    }
                >
                    <ActionLink href="/option-2#gazette-year">
                        Read our winter story
                    </ActionLink>
                </Entry>
                <Entry
                    name="Button"
                    description="An ink-filled action control, added for future interactive pages. Defaults to type=button so it never submits a form by accident. Use native disabled and aria-busy for pending work."
                    api="atoms.tsx / native button props; type defaults to 'button'"
                    code={
                        '<Button onClick={save}>Save this memory</Button>\n<Button disabled>Unavailable</Button>\n<Button disabled aria-busy="true">Saving…</Button>'
                    }
                >
                    <div className="docs-actions">
                        <Button
                            aria-pressed={marked}
                            onClick={() => setMarked(!marked)}
                        >
                            {marked ? 'Memory marked' : 'Mark this memory'}
                        </Button>
                        <Button disabled>Unavailable</Button>
                        <Button disabled aria-busy="true">
                            Saving…
                        </Button>
                    </div>
                    <p role="status" className="docs-caption">
                        {marked
                            ? 'This demo memory is marked. Click again to unmark.'
                            : 'Try the active button. This demo does not save data.'}
                    </p>
                </Entry>
                <Entry
                    name="Image"
                    description="An uncaptioned, full-width 4:3 image. Lazy-load by default; set priority only for the initial cover. Supply srcSet and sizes for responsive assets, style for object-position."
                    api="atoms.tsx / required alt; priority?: boolean; native img props"
                    code={
                        '<Image src="/photos/lake.webp" alt="Snow on the pines beside the lake" />'
                    }
                >
                    <Image {...lake} />
                </Entry>
                <Entry
                    name="SkipLink"
                    description="A keyboard-first route past navigation. Hidden until focused. GazettePage already includes it; add separately only for a custom shell."
                    api="atoms.tsx / native anchor props; href must point to an existing target"
                    code={
                        '<SkipLink href="#main-content">Skip to content</SkipLink>\n<main id="main-content" tabIndex={-1}>…</main>'
                    }
                >
                    <p className="docs-caption">
                        Reload this page and press Tab to see the template’s
                        SkipLink.
                    </p>
                </Entry>
            </DocSection>
            <DocSection id="molecules" title="Molecules">
                <Entry
                    name="Photograph"
                    description="Image plus an optional caption in a figure. Use it for editorial photography; Chapter and Cover arrange and crop it for you."
                    api="molecules.tsx / all Image props; caption?: ReactNode; figureClassName?: string"
                    code={
                        '<Photograph src="/photos/bread.webp" alt="Bread cooling on the table" caption="Everyone had a hand in it." />'
                    }
                >
                    <Photograph {...bread} />
                </Entry>
                <Entry
                    name="SectionHeading"
                    description="A chapter label, heading, and optional margin note. The note disappears on small screens, so it must not contain information absent from the story."
                    api="molecules.tsx / id, label: string; title: ReactNode; note?: string"
                    code={
                        '<SectionHeading id="spring-title" label="Chapter 02" title="Spring in the garden." note="Small things, growing." />'
                    }
                >
                    <SectionHeading
                        id="demo-section-title"
                        label="Chapter 02"
                        title="Spring in the garden."
                        note="Small things, growing."
                    />
                </Entry>
                <Entry
                    name="Disclosure"
                    description="Native details/summary for credits or optional information. Keyboard-operable without custom JavaScript. Pass open for an initially expanded disclosure."
                    api="molecules.tsx / summary, children: ReactNode; native details props"
                    code={
                        '<Disclosure summary="Photograph credits"><p>Credit the photographer and license here.</p></Disclosure>'
                    }
                >
                    <Disclosure summary="Try opening this disclosure">
                        <p>
                            Optional details belong here. The browser handles
                            focus and expanded state.
                        </p>
                    </Disclosure>
                </Entry>
                <Entry
                    name="Signature"
                    description="A closing sentiment and display-serif family name. Change the sentiment through children; the default is “With love,”."
                    api="molecules.tsx / name: string; children?: ReactNode"
                    code={
                        '<Signature name="The Six Family">With love,</Signature>'
                    }
                >
                    <Signature name="The Six Family" />
                </Entry>
            </DocSection>
            <DocSection id="organisms" title="Organisms">
                <Entry
                    name="Masthead"
                    description="The running navigation, fitted family name, year, and edition line. Keep the name short: this newspaper treatment is art-directed, not a general logo fitter."
                    api="organisms.tsx / name, year, motto, edition: string; left, right: { href, label }"
                    code={
                        '<Masthead name="The Six Family" year="2026"\n    left={{ href: "#winter", label: "Our year" }}\n    right={{ href: "#letter", label: "A note from us" }}\n    motto="People. Places. Ordinary days." edition="A year in review" />'
                    }
                >
                    <Masthead
                        name="The Six Family"
                        year="2026"
                        left={{
                            href: '/option-2#gazette-year',
                            label: 'Our year',
                        }}
                        right={{
                            href: '/option-2#gazette-note',
                            label: 'A note from us',
                        }}
                        motto="People. Places. Ordinary days."
                        edition="A year in review"
                    />
                </Entry>
                <Entry
                    name="Cover"
                    description="The front-page photograph, fitted h1, short introduction, and action link. Use once per page instead of another h1. Pass two short span lines in title to reproduce the reference’s fitted headline; test new words at narrow widths."
                    api="organisms.tsx / id: string; title, children: ReactNode; photograph: PhotographProps; action: { href, label }"
                    code={
                        '<Cover id="cover-title"\n    title={<><span>A year to</span><span>hold on to</span></>}\n    photograph={{ src: "/photos/cover.webp", alt: "Our winter lake" }}\n    action={{ href: "#winter", label: "Open our year" }}>\n    The moments that made our 2026.\n</Cover>'
                    }
                >
                    <a href="/option-2">
                        See the full-size Cover on the mockup
                    </a>
                </Entry>
                <Entry
                    name="Contents"
                    description="A numbered set of chapter links. Give it the same IDs used by Chapter. Four columns on desktop, two on small screens; numbers follow array order."
                    api="organisms.tsx / items: { href, label }[]; title?, label?: string (navigation’s accessible name)"
                    code={
                        '<Contents items={[{ href: "#winter", label: "Winter" }, { href: "#spring", label: "Spring" }]} />'
                    }
                >
                    <Contents
                        label="Example chapter navigation"
                        items={[
                            { href: '/option-2#gazette-year', label: 'Winter' },
                            {
                                href: '/option-2#gazette-orchard',
                                label: 'At the orchard',
                            },
                        ]}
                    />
                </Entry>
                <Entry
                    name="Chapter"
                    description="A complete story with one to four photos. The photo count chooses the layout: one = side-by-side; two = lead photo + inset and prose; three = lead photo + two-photo pair; four = prose + quartet. Layouts reflow automatically."
                    api="organisms.tsx / id: string; number: number; title, children: ReactNode; note?: string; featured?: boolean (larger headline); photos: tuple of 1–4 PhotographProps"
                    code={
                        '<Chapter id="winter" number={1} title="Winter, together." featured\n    note="A quieter kind of adventure."\n    photos={[{ src: "/photos/lake.webp", alt: "Our mountain lake", caption: "The long way home." }]}>\n    <p>Tell the story in semantic paragraphs.</p>\n</Chapter>'
                    }
                >
                    <Disclosure summary="Preview all four photo layouts">
                        <Chapter
                            id="demo-single"
                            number={1}
                            title="One quiet morning."
                            note="Room to breathe."
                            photos={[lake]}
                        >
                            <p>
                                One photograph and one story, with space for
                                both.
                            </p>
                        </Chapter>
                        <Chapter
                            id="demo-pair"
                            number={2}
                            title="Time at the table."
                            photos={[lake, bread]}
                        >
                            <p>
                                A lead image, a smaller detail, and a little
                                context.
                            </p>
                        </Chapter>
                        <Chapter
                            id="demo-trio"
                            number={3}
                            title="The longer way home."
                            photos={[
                                lake,
                                bread,
                                {
                                    ...lake,
                                    caption: 'One last look at the lake.',
                                },
                            ]}
                        >
                            <p>Keep the two supporting images together.</p>
                        </Chapter>
                        <Chapter
                            id="demo-quartet"
                            number={4}
                            title="A few small moments."
                            photos={[lake, bread, lake, bread]}
                        >
                            <p>A story beside four photographs.</p>
                            <p>
                                At smaller widths, the photographs follow the
                                text.
                            </p>
                        </Chapter>
                    </Disclosure>
                </Entry>
                <Entry
                    name="Letter"
                    description="A closing letter with a title, optional decorative year, salutation, prose, and signature slot. Stacks into reading order on small screens."
                    api="organisms.tsx / id, label, salutation: string; title, children, signature: ReactNode; year?: string"
                    code={
                        '<Letter id="letter" label="The last word" title="A note from us"\n    year="2026" salutation="Dear friends and family,"\n    signature={<Signature name="The Six Family" />}>\n    <p>Thank you for being part of our year.</p>\n</Letter>'
                    }
                >
                    <Disclosure summary="Preview the closing letter">
                        <Letter
                            id="demo-letter"
                            label="The last word"
                            title="A note from us"
                            year="2026"
                            salutation="Dear friends and family,"
                            signature={<Signature name="The Six Family" />}
                        >
                            <p>Thank you for being part of our year.</p>
                        </Letter>
                    </Disclosure>
                </Entry>
                <Entry
                    name="Footer"
                    description="The final note and back-to-top link, with an optional credits slot. Supply Disclosure for credits. GazettePage places it outside main."
                    api="organisms.tsx / children: ReactNode; back: { href, label }; credits?: ReactNode"
                    code={
                        '<Footer back={{ href: "#gazette-top", label: "Back to the beginning" }}\n    credits={<Disclosure summary="Credits"><p>Photo sources…</p></Disclosure>}>\n    From our home to yours. Merry Christmas.\n</Footer>'
                    }
                >
                    <p className="docs-caption">
                        This page’s footer is a live Footer component.{' '}
                        <a href="#documentation-footer">See it below.</a>
                    </p>
                </Entry>
            </DocSection>
            <DocSection id="templates" title="Templates">
                <Entry
                    name="GazettePage"
                    description="The warm paper shell, centered measure, one main landmark, shared styles, and skip link. Header and footer are slots; the template has no fixed family name or navigation."
                    api="gazette-page.tsx / skipTo: string; children: ReactNode; header?, footer?: ReactNode; id?, className?, skipLabel?: string"
                    code={
                        '<GazettePage skipTo="#story"\n    header={<Masthead {...edition} />}\n    footer={<Footer back={{ href: "#gazette-top", label: "Back to top" }}>Merry Christmas.</Footer>}>\n    <Cover {...cover}>Our year in a few stories.</Cover>\n    <Contents items={chapters} />\n    <Chapter {...story}><p>What happened…</p></Chapter>\n</GazettePage>'
                    }
                >
                    <p className="docs-caption">
                        Both documentation pages and /option-2 use this
                        template. The default top ID is gazette-top; skipTo must
                        point to content you render.
                    </p>
                </Entry>
            </DocSection>
            <DocSection id="pages" title="Pages & recipes">
                <p>
                    Pages are compositions, not another set of reusable UI.{' '}
                    <a href="/option-2">OptionTwo</a> is the reference edition
                    with all twelve stories and all four Chapter variants.{' '}
                    <a href="/styleguide">Styleguide</a> and this Components
                    page demonstrate a custom documentation layout using the
                    same atoms and template.
                </p>
                <ol>
                    <li>
                        For a complete edition, compose GazettePage → Masthead →
                        Cover → Contents → Chapter(s) → Letter → Footer.
                    </li>
                    <li>
                        For a custom story, use SectionHeading + RichText +
                        Photograph inside a semantic section. Use --gazette-gap
                        for spacing and --gazette-rule-double for the boundary.
                    </li>
                    <li>
                        Keep content, image URLs, licenses, and data loading in
                        the page. Photos accept any source; never add production
                        asset names to the UI library.
                    </li>
                    <li>
                        For zero photos or more than four, compose a custom
                        section rather than forcing Chapter. Its one-to-four
                        photo tuple is the supported contract.
                    </li>
                </ol>
                <p>
                    Documentation, DocSection, and Code in documentation.tsx are
                    helpers for these two reference pages, not public Gazette
                    library exports. No modal, form framework, or CMS
                    integration is implied; introduce those when a real page
                    needs them.
                </p>
                <p id="documentation-footer">
                    Example photographs: Florian Fuchs,{' '}
                    <a href="https://commons.wikimedia.org/wiki/File:Lake_Kinney_mit_Mount_Whitehorn.jpg">
                        Lake Kinney
                    </a>
                    ,{' '}
                    <a href="https://creativecommons.org/licenses/by/3.0/">
                        CC BY 3.0
                    </a>
                    ; Tomascastelazo,{' '}
                    <a href="https://commons.wikimedia.org/wiki/File:Home_made_sour_dough_bread.jpg">
                        sourdough bread
                    </a>
                    ,{' '}
                    <a href="https://creativecommons.org/licenses/by-sa/4.0/">
                        CC BY-SA 4.0
                    </a>
                    . Resized and cropped for these examples.
                </p>
            </DocSection>
        </Documentation>
    );
}
