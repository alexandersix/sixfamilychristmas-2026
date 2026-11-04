import type { CSSProperties } from 'react';
import { ActionLink, Label, RichText, Rule } from '@/components/gazette';
import {
    Code,
    DocSection,
    Documentation,
} from '@/components/gazette/documentation';
import tokenSource from '../../css/gazette-tokens.css?raw';

const tokens = Array.from(
    tokenSource.matchAll(/(--gazette-[\w-]+):\s*([^;]+);/g),
    ([, name, value]) => ({ name, value }),
);
const palette = [
    ['paper', 'Paper', 'The page surface. Keep it warm, never pure white.'],
    ['edge', 'Paper edge', 'Subtle shading and code-example backgrounds.'],
    ['ink', 'Ink', 'Headlines, prose, and strong dividers.'],
    ['muted', 'Pencil', 'Captions and secondary text.'],
    ['rule', 'Rule', 'Quiet separators; never use for body text.'],
    [
        'accent',
        'Sealing red',
        'Links, focus rings, and the edition year. Use sparingly.',
    ],
];

export default function Styleguide() {
    return (
        <Documentation
            title="Styleguide"
            intro="A family newspaper, made for the web. The visual rules behind our year in review, and the ingredients for every page that follows."
            sections={[
                { id: 'identity', label: 'Identity' },
                { id: 'color', label: 'Color' },
                { id: 'type', label: 'Typography' },
                { id: 'spacing', label: 'Spacing & layout' },
                { id: 'details', label: 'Rules & imagery' },
                { id: 'accessibility', label: 'Accessibility' },
                { id: 'building', label: 'Build a page' },
            ]}
        >
            <DocSection id="identity" title="Keep it personal.">
                <p>
                    The Six Family Gazette is an editorial Christmas letter:
                    warm, confident, a little nostalgic. Photographs and stories
                    carry the page. Typography and rules organize it.
                </p>
                <ul>
                    <li>
                        Write like a letter to someone you know. Prefer specific
                        memories to marketing language.
                    </li>
                    <li>
                        Use warm paper, dark ink, full-color photographs, and
                        square edges.
                    </li>
                    <li>
                        Let one headline or photograph lead each spread. Leave
                        space between stories.
                    </li>
                    <li>
                        Avoid rounded cards, shadows, gradients as decoration,
                        icon tiles, and competing accent colors. The existing
                        subtle paper-edge wash is the exception.
                    </li>
                </ul>
                <ActionLink href="/option-2">
                    Read the reference edition
                </ActionLink>
            </DocSection>
            <DocSection id="color" title="Paper, ink, a little red.">
                <dl className="docs-swatches">
                    {palette.map(([token, name, description]) => (
                        <div key={token}>
                            <div
                                className="docs-swatch"
                                style={{
                                    background: `var(--gazette-${token})`,
                                }}
                            />
                            <dt>{name}</dt>
                            <dd>
                                <code>--gazette-{token}</code>
                                <br />
                                {
                                    tokens.find(
                                        (item) =>
                                            item.name === `--gazette-${token}`,
                                    )?.value
                                }
                                <br />
                                {description}
                            </dd>
                        </div>
                    ))}
                </dl>
                <p>
                    Use ink or pencil text on paper. Red works for text on paper
                    and paper works on ink for buttons. The rule color is
                    decorative, not a text color. Do not communicate state
                    through color alone.
                </p>
                <p className="docs-caption">
                    Values below are read directly from gazette-tokens.css; that
                    file is the source of truth. This theme is intentionally
                    light, even when the device prefers dark mode.
                </p>
            </DocSection>
            <DocSection id="type" title="Three voices. Clear roles.">
                <div className="docs-specimen">
                    <div className="docs-specimen-display">
                        A year to hold on to
                    </div>
                    <p className="docs-caption">
                        Bodoni Moda / --gazette-display / 900 for masthead,
                        cover, year, and signature; 400 for a postscript.
                    </p>
                </div>
                <div className="docs-specimen">
                    <div className="docs-specimen-slab">
                        The stories we keep.
                    </div>
                    <p className="docs-caption">
                        Bevan / --gazette-slab / 400 for chapter and section
                        headings. Do not synthesize bold.
                    </p>
                </div>
                <div className="docs-specimen">
                    <RichText>
                        <p>
                            Georgia makes room for the ordinary days. Use{' '}
                            <strong>bold for emphasis</strong>,{' '}
                            <em>italics for an aside</em>, and short paragraphs
                            that invite reading.
                        </p>
                    </RichText>
                    <p className="docs-caption">
                        Georgia / --gazette-body / 400 and 700 for prose,
                        navigation, labels, and captions. Fallback: Times New
                        Roman, then serif.
                    </p>
                </div>
                <p>
                    Bodoni Moda (400, 900) and Bevan (400) are self-hosted by
                    the existing Bunny/Vite font pipeline in vite.config.ts. Do
                    not add a remote font stylesheet. Display fallback: Times
                    New Roman; slab fallback: Georgia.
                </p>
                <table className="docs-table">
                    <caption>
                        Type scale / CSS token suffix after --gazette-text-
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">Role</th>
                            <th scope="col">Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens
                            .filter((token) =>
                                token.name.startsWith('--gazette-text-'),
                            )
                            .map((token) => (
                                <tr key={token.name}>
                                    <th scope="row">
                                        {token.name.replace(
                                            '--gazette-text-',
                                            '',
                                        )}
                                    </th>
                                    <td>{token.value}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <p>
                    Body line-height: 1.7, at most 52ch wide. Headings: 1.12,
                    tracking −0.045em. Labels: 1.5, bold, uppercase, tracking
                    0.23em. Reserve tracked capitals for short newspaper
                    furniture, never paragraphs. Captions use 1.7 and 0.15em
                    tracking; compact photo grids use 10px and 0.1em.
                </p>
                <Label>Chapter 01</Label>
                <p>
                    The masthead and cover use container-relative type, not the
                    general scale. Masthead: 22cqi, horizontal scale 0.55.
                    Cover: 36cqi (20cqi on narrow screens), with fitted lines.
                    These are art-directed treatments: keep the masthead short
                    and cover lines brief; check longer copy at every
                    breakpoint.
                </p>
            </DocSection>
            <DocSection id="spacing" title="An editorial rhythm.">
                <p>
                    Use the named spacing tokens instead of inventing a new gap.
                    Most increments are 4px; the 42px chapter rhythm is
                    deliberately preserved from the mockup, not a strict
                    mathematical scale.
                </p>
                {tokens
                    .filter((token) =>
                        token.name.startsWith('--gazette-space-'),
                    )
                    .map((token) => (
                        <div className="docs-space-row" key={token.name}>
                            <code>{token.name}</code>
                            <span>{token.value}</span>
                            <span
                                className="docs-space-mark"
                                style={
                                    {
                                        width: `var(${token.name})`,
                                    } as CSSProperties
                                }
                            />
                        </div>
                    ))}
                <ul>
                    <li>
                        Paper: centered, 1040px maximum width including its
                        border and padding. At wide viewports the gutters grow,
                        not the content.
                    </li>
                    <li>
                        Outer gutter: 24px desktop, 12px at ≤680px. Inner paper:
                        clamp(18px, 2.5vw, 32px), then 14px at ≤680px.
                    </li>
                    <li>
                        Column gap: clamp(20px, 3vw, 38px). Chapter spacing:
                        42px above and below, then 28px at ≤680px. Letter
                        spacing: 64px, then 36px.
                    </li>
                    <li>
                        At ≤900px, headings simplify and four-photo stories put
                        prose above the photos. At ≤680px, stories and the
                        letter stack into one column; contents become two
                        columns.
                    </li>
                    <li>
                        Two small photos stay paired in the three-photo layout.
                        Four-photo grids stack at ≤680px. Keep image grid tracks
                        minmax(0, 1fr) so content can shrink.
                    </li>
                </ul>
            </DocSection>
            <DocSection id="details" title="The details make the newspaper.">
                <p>
                    Radius: 0. Shadows: none. No decorative animation. Use rules
                    to separate content instead of cards.
                </p>
                <Rule />
                <p className="docs-caption">
                    Thin / 1px rule color / minor divisions
                </p>
                <Rule variant="ink" />
                <p className="docs-caption">
                    Ink / 1px ink / masthead and strong boundaries
                </p>
                <Rule variant="double" />
                <p className="docs-caption">
                    Double / 4px double ink / chapters, cover, and closing
                    letter
                </p>
                <h3>Photographs</h3>
                <p>
                    Use full-color documentary images, no filters or rounded
                    corners. Default ratio: 4:3. Leading chapter photos: 4:5 on
                    desktop, 4:3 on narrow screens. Cover: 1.36 with a 360px
                    minimum desktop height (320px at ≤900px); 1.25 with no
                    minimum at ≤680px. Set object-position for the subject when
                    necessary.
                </p>
                <p>
                    Supply meaningful alt text, responsive srcSet and sizes, and
                    an optional caption. Use priority only above the fold; other
                    images lazy-load. Keep rights and source credits with the
                    content, not inside a generic image component. Reference
                    photos are placeholders from Wikimedia Commons, not family
                    photographs.
                </p>
                <h3>Links and actions</h3>
                <p>
                    Use an underlined text link inside prose. ActionLink is the
                    red editorial invitation. Button is a square, ink-filled
                    action control for work on the current page; it is an
                    extension of the brand, not an element in the original
                    mockup. Never substitute a button for navigation.
                </p>
            </DocSection>
            <DocSection id="accessibility" title="Make room for every reader.">
                <ul>
                    <li>
                        Use one h1 per page, then h2 sections and h3
                        subsections. Heading’s as prop chooses semantics; do not
                        choose it for visual size.
                    </li>
                    <li>
                        GazettePage provides one main landmark and a
                        keyboard-visible SkipLink. Its target must exist. Use
                        unique IDs for chapters, headings, and previews.
                    </li>
                    <li>
                        Focus uses a 2px red outline with 5px offset. Do not
                        remove it. Links underline or have a clear action
                        treatment; buttons have a 44px minimum height.
                    </li>
                    <li>
                        Use native Disclosure for keyboard and screen-reader
                        support. Use a visible “Saving…” label with aria-busy
                        and disabled when an action is pending.
                    </li>
                    <li>
                        The inherited 10–13px newspaper furniture is for short
                        secondary content only. Prose remains 17px (16px at
                        ≤680px); do not shrink essential instructions into
                        captions.
                    </li>
                    <li>
                        There is no motion to reduce. Any future motion must
                        honor prefers-reduced-motion and must not hide content
                        while waiting for animation.
                    </li>
                    <li>
                        Test keyboard navigation, 200% zoom, long headings, and
                        widths around 680px and 900px. Keep text readable
                        without horizontal page scrolling.
                    </li>
                </ul>
            </DocSection>
            <DocSection id="building" title="Build from the library.">
                <p>
                    Import from <code>@/components/gazette</code>. GazettePage
                    loads the shared stylesheet and tokens; do not import the
                    old mockup stylesheet. Start with organisms, compose
                    molecules when a layout is custom, and use atoms for the
                    smallest details.
                </p>
                <Code>{`import { GazettePage, Heading, RichText, Rule } from '@/components/gazette';

export default function FamilyPage() {
    return (
        <GazettePage skipTo="#story">
            <section id="story" tabIndex={-1}>
                <Heading as="h1">A day worth keeping.</Heading>
                <Rule variant="double" />
                <RichText><p>Your family’s story goes here.</p></RichText>
            </section>
        </GazettePage>
    );
}`}</Code>
                <p>
                    Add the page’s Inertia Head title and a route in
                    routes/web.php. Page components own content and data
                    fetching; the UI library has no CMS, photo-path, year, or
                    family-name dependency. Do not wrap the page in another
                    main.
                </p>
                <p>
                    Shared tokens: <code>resources/css/gazette-tokens.css</code>
                    . Shared styles: <code>resources/css/gazette.css</code>.
                    Components: <code>resources/js/components/gazette/</code>.
                    Update these guides when the system changes.
                </p>
                <ActionLink href="/components">
                    Explore the component library
                </ActionLink>
            </DocSection>
        </Documentation>
    );
}
