import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import '../../css/option-2.css';

const photographs = {
    cover: {
        alt: 'Snow-dusted mountains and evergreen trees reflected in a quiet alpine lake',
        author: 'Florian Fuchs',
        source: 'Herbert_Lake_beim_Icefields_Parkway.jpg',
        license: 'by/3.0',
    },
    winter: {
        alt: 'A still mountain lake surrounded by a forest and snow-capped peaks',
        author: 'Florian Fuchs',
        source: 'Lake_Kinney_mit_Mount_Whitehorn.jpg',
        license: 'by/3.0',
    },
    pines: {
        alt: 'A trail winding between snow-covered fir trees',
        author: 'Ximeg',
        source: 'Skiing_in_Oberhof_March_2013-12-Ski_track.jpg',
        license: 'by-sa/3.0',
    },
    beach: {
        alt: 'A family walking by the sea as the evening light reflects on the sand',
        author: 'Ferdous',
        source: "Family_walking_at_the_evening,_cox's_bazar_.jpg",
        license: 'by-sa/3.0',
    },
    'beach-huts': {
        alt: 'Little white beach huts standing in a row on the sand',
        author: 'Gzzz',
        source: 'Cabines_de_bain_Berck.jpg',
        license: 'by-sa/3.0',
    },
    autumn: {
        alt: 'Golden sunlight through a woodland path carpeted in autumn leaves',
        author: 'Pudelek (Marcin Szala)',
        source: 'Slezské_Beskydy_-_Rytířská_stezka_(cesta_Nýdek_-_Velká_Čantoryje).JPG',
        license: 'by-sa/4.0',
    },
    baking: {
        alt: 'Hands kneading bread dough on a wooden board in the kitchen',
        author: 'Tim Sackton',
        source: 'Kneading_(18-366)_(24399440891).jpg',
        license: 'by-sa/2.0',
    },
    sourdough: {
        alt: 'A jar of sourdough starter waiting for the next batch of bread',
        author: 'Janus Sandsgaard',
        source: 'Sourdough.jpg',
        license: 'by/4.0',
    },
    breakfast: {
        alt: 'A breakfast table beside a bright window overlooking a garden',
        author: 'Wilfredor',
        source: "Breakfast in Île d'Orléans 072.jpg",
        license: 'CC0',
    },
    cake: {
        alt: 'A slice of apple cake served with vanilla ice cream',
        author: 'W.carter',
        source: 'Apple cake with vanilla ice cream 2.jpg',
        license: 'CC0',
    },
    blossom: {
        alt: 'Pink and white apple blossoms opening against a blue sky',
        author: 'George Chernilevsky',
        source: 'Apple-tree blossoms 2017 G3.jpg',
        license: 'Public domain',
    },
    wildflowers: {
        alt: 'Red poppies and white daisies growing in a sunny meadow',
        author: 'Dietmar Rabich',
        source: 'Dülmen, Brachliegendes Feld mit Wildblumen -- 2021 -- 9756.jpg',
        license: 'by-sa/4.0',
    },
    bee: {
        alt: 'A honeybee gathering pollen from yellow flowers',
        author: 'Ivar Leidus',
        source: 'Apis mellifera - Brassica napus - Valingu.jpg',
        license: 'by-sa/4.0',
    },
    road: {
        alt: 'An open road leading toward distant snow-capped mountains',
        author: 'Timothy A. Gonsalves',
        source: 'Road Padum Zanskar Range Jun24 A7CR 00818.jpg',
        license: 'by-sa/4.0',
    },
    waterfall: {
        alt: 'A waterfall tumbling over moss-covered rocks in a green forest',
        author: 'Dietmar Rabich',
        source: 'Beech Forest (AU), Great Otway National Park, Beauchamp Falls -- 2019 -- 1271.jpg',
        license: 'by-sa/4.0',
    },
    steps: {
        alt: 'Wooden steps climbing through a quiet, leafy forest',
        author: 'Basile Morin',
        source: 'Wooden staircase steps in the forest of Hallasan Park Eorimok Trail at dusk on Jeju Island in South Korea.jpg',
        license: 'by-sa/4.0',
    },
    fields: {
        alt: 'Round hay bales scattered across a field edged with yellow flowers',
        author: 'DimiTalen',
        source: 'Round hay bales on a field, with hawkweed in the foreground, near Durnal, Yvoir, 2025.jpg',
        license: 'CC0',
    },
    heather: {
        alt: 'Early sunlight falling across a heath covered in purple heather',
        author: 'Dietmar Rabich',
        source: 'Haltern am See, Westruper Heide -- 2015 -- 8306-10.jpg',
        license: 'by-sa/4.0',
    },
    tent: {
        alt: 'A small tent pitched on a grassy mountainside in golden light',
        author: 'Vyacheslav Argenberg',
        source: 'Zagedan Ridge, Camping tent, Caucasus Mountains.jpg',
        license: 'by/4.0',
    },
    stars: {
        alt: 'The Milky Way stretching above a glowing tent and mountain ridges',
        author: 'oliwok',
        source: 'Milky way in Elbrus.jpg',
        license: 'by/4.0',
    },
    boots: {
        alt: 'Well-worn hiking boots resting on a wooden deck',
        author: 'W.carter',
        source: 'Boots of a man.jpg',
        license: 'CC0',
    },
    cove: {
        alt: 'Wet sand reflecting a wooded headland beside the ocean at dusk',
        author: 'Michal Klajban',
        source: 'Mystic Beach, Vancouver Island, Canada 10.jpg',
        license: 'by-sa/4.0',
    },
    cliffs: {
        alt: 'White chalk cliffs rising above the sea in warm evening light',
        author: 'kallerna',
        source: 'Dover White Cliffs 1.jpg',
        license: 'by-sa/4.0',
    },
    'sea-cave': {
        alt: 'A natural rock arch framing blue waves and a rugged coastline',
        author: 'kallerna',
        source: 'Sea caves Cape Greco 2.jpg',
        license: 'by-sa/4.0',
    },
    sand: {
        alt: 'Soft ripples in pale beach sand surrounding a smooth pebble',
        author: 'Dietmar Rabich',
        source: 'Morro Jable (Fuerteventura, Spain), Strand -- 2025 -- 2487.jpg',
        license: 'by-sa/4.0',
    },
    bread: {
        alt: 'Freshly baked sourdough rolls nestled in a striped cloth',
        author: 'Tomascastelazo',
        source: 'Home made sour dough bread.jpg',
        license: 'by-sa/4.0',
    },
    forest: {
        alt: 'Sunlight breaking through tall trees onto a carpet of green ferns',
        author: 'Dietmar Rabich',
        source: 'Dülmen, Göversheide -- 2015 -- 7718-22.jpg',
        license: 'by-sa/4.0',
    },
    'apple-basket': {
        alt: 'A wicker basket full of freshly picked red apples on the grass',
        author: 'George Chernilevsky',
        source: 'Apples in basket 2018 G1.jpg',
        license: 'Public domain',
    },
    orchard: {
        alt: 'Rows of apple trees heavy with red fruit',
        author: 'Fischer.H',
        source: 'Äpfel P1260372.jpg',
        license: 'by-sa/4.0',
    },
    'apple-crate': {
        alt: 'Green and russet apples piled together in a wooden crate',
        author: 'Anne Dirkse',
        source: 'Mixed Apples for Cider Pressing.jpg',
        license: 'by-sa/4.0',
    },
    flatbread: {
        alt: 'Hands rolling dough with a wooden rolling pin on a floured board',
        author: 'Ssemmanda will',
        source: 'Kneading Chapati Dough 04.jpg',
        license: 'by-sa/4.0',
    },
};

type PhotographName = keyof typeof photographs;

type FamilyEvent = {
    id: string;
    indexTitle: string;
    title: string;
    note: string;
    photos: { name: PhotographName; caption?: string }[];
    body: ReactNode;
};

const events: FamilyEvent[] = [
    {
        id: 'gazette-year',
        indexTitle: 'Winter',
        title: 'Winter',
        note: 'A quieter kind of adventure.',
        photos: [
            { name: 'winter', caption: 'A little farther from the everyday.' },
        ],
        body: (
            <>
                <p>
                    Snowy mornings, familiar places, and time well spent. A few
                    days in the mountains reminded us to slow down and notice
                    what was right in front of us.
                </p>
                <p>
                    We took the long way, warmed up with hot chocolate, and
                    stayed out for one last look at the lake.{' '}
                    <strong>The best part was being together.</strong>
                </p>
            </>
        ),
    },
    {
        id: 'gazette-birthday',
        indexTitle: 'Birthday breakfast',
        title: 'Another candle. Another slice.',
        note: 'Make a wish. Stay for seconds.',
        photos: [
            { name: 'breakfast', caption: 'The best seat was at our table.' },
            { name: 'cake', caption: 'Birthday cake counts as breakfast.' },
        ],
        body: (
            <>
                <p>
                    We celebrated a birthday with a slow morning, a crowded
                    table, and absolutely no hurry to clear the plates. Everyone
                    had a different idea of the perfect breakfast, so we made a
                    little of everything.
                </p>
                <p>
                    There were handwritten cards and a very enthusiastic
                    rendition of the birthday song.{' '}
                    <em>A small celebration, with all our favorite people.</em>
                </p>
            </>
        ),
    },
    {
        id: 'gazette-spring',
        indexTitle: 'First blooms',
        title: 'And then, everything bloomed.',
        note: 'A little color after the cold.',
        photos: [
            {
                name: 'blossom',
                caption: 'The first blossoms always feel like good news.',
            },
            { name: 'wildflowers', caption: 'Taking the colorful way home.' },
            { name: 'bee', caption: 'Our busiest neighbor.' },
        ],
        body: (
            <>
                <p>
                    The first warm weekend sent us straight outside. We checked
                    on every new flower, opened all the windows, and remembered
                    just how good an afternoon without coats can feel.
                </p>
                <p>
                    Our walks got longer and our pockets filled with little
                    treasures.{' '}
                    <strong>Spring didn’t need much of a plan.</strong> We were
                    happy just to follow it.
                </p>
            </>
        ),
    },
    {
        id: 'gazette-road-trip',
        indexTitle: 'The long way',
        title: 'The long way was the right way.',
        note: 'Windows down. Snacks within reach.',
        photos: [
            { name: 'road', caption: 'The view ahead.' },
            { name: 'waterfall', caption: 'Worth pulling over for.' },
            { name: 'steps', caption: 'Just one more trail.' },
            { name: 'fields', caption: 'Room to take a breath.' },
        ],
        body: (
            <>
                <p>
                    We packed the car for a little road trip and left plenty of
                    room for detours. A roadside stop turned into a walk, which
                    turned into a much later lunch than anyone had planned.
                </p>
                <p>
                    There were new views, familiar songs, and a running debate
                    about the best road-trip snack.{' '}
                    <em>Getting there was half the fun.</em> Possibly more.
                </p>
            </>
        ),
    },
    {
        id: 'gazette-outside',
        indexTitle: 'An ordinary Sunday',
        title: 'Nothing on the calendar.',
        note: 'No big plans. A very good day.',
        photos: [
            {
                name: 'heather',
                caption: 'Some days are better left wide open.',
            },
        ],
        body: (
            <>
                <p>
                    One Sunday, we decided the only thing on the schedule would
                    be being outside. We brought a picnic, found a good spot,
                    and let the afternoon stretch out in front of us.
                </p>
                <p>
                    We talked, wandered, and stayed a little longer than we
                    meant to.{' '}
                    <strong>
                        It’s funny how the least planned days become the ones
                        you remember.
                    </strong>
                </p>
            </>
        ),
    },
    {
        id: 'gazette-summer',
        indexTitle: 'Beach week',
        title: 'The art of doing very little.',
        note: 'Sandy feet. Full hearts.',
        photos: [
            { name: 'beach', caption: 'Nowhere to be but right here.' },
            { name: 'beach-huts', caption: 'Our kind of neighborhood.' },
        ],
        body: (
            <>
                <p>
                    Our beach week had a very full itinerary: walk to the water,
                    find a good shell, do it all again. We ate dinner with sandy
                    feet and watched the sky change colors.
                </p>
                <p>
                    <em>Nothing particularly extraordinary happened.</em> Which,
                    looking back, was exactly what made it wonderful.
                </p>
            </>
        ),
    },
    {
        id: 'gazette-camping',
        indexTitle: 'Under the stars',
        title: 'A room with a very good view.',
        note: 'Our address, for a little while.',
        photos: [
            { name: 'tent', caption: 'Home is where we put the tent.' },
            { name: 'stars', caption: 'We stayed up for the night show.' },
            { name: 'boots', caption: 'A few more miles together.' },
        ],
        body: (
            <>
                <p>
                    We traded our usual beds for sleeping bags and spent a few
                    nights outside. Putting up the tent was a team effort;
                    deciding where to sit and admire the view was much easier.
                </p>
                <p>
                    We made simple dinners, took muddy walks, and waited for the
                    first stars.{' '}
                    <strong>The quiet was our favorite souvenir.</strong> The
                    muddy boots came home too.
                </p>
            </>
        ),
    },
    {
        id: 'gazette-coast',
        indexTitle: 'Along the coast',
        title: 'One more day by the water.',
        note: 'Salt in the air. Nowhere to rush.',
        photos: [
            { name: 'cove', caption: 'An evening worth lingering over.' },
            { name: 'cliffs', caption: 'A different view around every bend.' },
            { name: 'sea-cave', caption: 'A window onto the sea.' },
            { name: 'sand', caption: 'The little things, too.' },
        ],
        body: (
            <>
                <p>
                    Before summer slipped away, we squeezed in another adventure
                    along the coast. We followed the shoreline, stopped at every
                    lookout, and took far more photographs than we meant to.
                </p>
                <p>
                    Somewhere between the last walk and the last ice cream, we
                    agreed we could get used to this.{' '}
                    <em>We’re already hoping to go back.</em>
                </p>
            </>
        ),
    },
    {
        id: 'gazette-home',
        indexTitle: 'Back at home',
        title: 'Settling into the everyday.',
        note: 'Good things, close to home.',
        photos: [
            {
                name: 'bread',
                caption: 'Something warm to welcome everyone home.',
            },
        ],
        body: (
            <>
                <p>
                    After all the coming and going, it felt good to find our
                    usual rhythm again. We returned to dinners around the table,
                    familiar errands, and catching up at the end of the day.
                </p>
                <p>
                    A batch of warm bread became a good excuse to linger in the
                    kitchen.{' '}
                    <strong>Not every favorite memory needs a suitcase.</strong>{' '}
                    Some just need a little butter.
                </p>
            </>
        ),
    },
    {
        id: 'gazette-autumn',
        indexTitle: 'The scenic route',
        title: 'The scenic route home.',
        note: 'Leaves in our pockets.',
        photos: [
            { name: 'autumn', caption: 'One more walk before heading home.' },
            {
                name: 'forest',
                caption: 'A familiar trail, seen a little differently.',
            },
        ],
        body: (
            <>
                <p>
                    An afternoon walk became a whole day outside. We followed
                    the prettiest leaves and decided the wrong turn was actually
                    the right one.
                </p>
                <p>
                    Hot chocolate on the way home. Leaves in our pockets.{' '}
                    <strong>A Saturday worth keeping.</strong> We’re trying to
                    make more room for days like this.
                </p>
            </>
        ),
    },
    {
        id: 'gazette-orchard',
        indexTitle: 'At the orchard',
        title: 'A basket full of good things.',
        note: 'Picked together. Shared at home.',
        photos: [
            {
                name: 'apple-basket',
                caption: 'More apples than we had recipes for.',
            },
            { name: 'orchard', caption: 'A good afternoon between the rows.' },
            {
                name: 'apple-crate',
                caption: 'The beginnings of something delicious.',
            },
        ],
        body: (
            <>
                <p>
                    A trip to the orchard ended with a very full basket and
                    plans for pie. We sampled, compared, and somehow kept
                    finding room for just a few more apples.
                </p>
                <p>
                    Back home, we put the kettle on and started peeling.{' '}
                    <em>There are worse problems than too many apples</em> and
                    plenty of people to share them with.
                </p>
            </>
        ),
    },
    {
        id: 'gazette-december',
        indexTitle: 'December traditions',
        title: 'A little flour. A lot of love.',
        note: 'From our kitchen, with love.',
        photos: [
            { name: 'baking', caption: 'Everyone had a hand in it.' },
            { name: 'sourdough', caption: 'Something good in the making.' },
            { name: 'flatbread', caption: 'Making room for one more batch.' },
            { name: 'pines', caption: 'A winter walk while the dough rises.' },
        ],
        body: (
            <>
                <p>
                    Our new holiday tradition: baking bread together. There was
                    flour on the floor and more than one loaf we’ll call{' '}
                    <em>rustic.</em> Between batches, we bundled up for a walk
                    in the cold.
                </p>
                <p>
                    Everyone helped. Warm bread never lasted long. Some
                    traditions arrive quietly. Then you can’t imagine December
                    without them.
                </p>
            </>
        ),
    },
];

function Photograph({
    name,
    caption,
    priority = false,
}: {
    name: PhotographName;
    caption?: string;
    priority?: boolean;
}) {
    return (
        <figure className={`gazette-photograph gazette-photo-${name}`}>
            <img
                src={`/images/option-2/${name}-1920.webp`}
                srcSet={`/images/option-2/${name}-960.webp 960w, /images/option-2/${name}-1920.webp 1920w`}
                sizes="(max-width: 680px) 92vw, (max-width: 1100px) 55vw, 650px"
                alt={photographs[name].alt}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
            />
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    );
}

function EventSection({
    event,
    number,
}: {
    event: FamilyEvent;
    number: number;
}) {
    const heading = (
        <div className="gazette-section-heading">
            <p className="gazette-label">
                Chapter {String(number).padStart(2, '0')}
            </p>
            <h2 id={`${event.id}-title`}>{event.title}</h2>
            <p className="gazette-margin-note">{event.note}</p>
        </div>
    );
    const body = <div className="gazette-rich-text">{event.body}</div>;
    const photos = event.photos.map((photo) => (
        <Photograph key={photo.name} {...photo} />
    ));

    return (
        <section
            className={`gazette-chapter gazette-event-${photos.length}`}
            id={event.id}
            aria-labelledby={`${event.id}-title`}
        >
            {photos.length === 1 ? (
                <div className="gazette-single-layout">
                    <div className="gazette-single-copy">
                        {heading}
                        {body}
                        <p className="gazette-postscript">{event.note}</p>
                    </div>
                    {photos}
                </div>
            ) : (
                <>
                    {heading}
                    {photos.length === 2 && (
                        <div className="gazette-pair-layout">
                            {photos[0]}
                            <div className="gazette-pair-aside">
                                {photos[1]}
                                {body}
                            </div>
                        </div>
                    )}
                    {photos.length === 3 && (
                        <div className="gazette-trio-layout">
                            {photos[0]}
                            <div className="gazette-trio-aside">
                                {body}
                                <div className="gazette-photo-pair">
                                    {photos.slice(1)}
                                </div>
                            </div>
                        </div>
                    )}
                    {photos.length === 4 && (
                        <div className="gazette-four-layout">
                            {body}
                            <div className="gazette-photo-quartet">
                                {photos}
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default function OptionTwo() {
    return (
        <div className="family-gazette" id="gazette-top">
            <Head title="The Six Family | A Year in Review, 2026">
                <meta
                    name="description"
                    content="The moments, big and small, that made our 2026. A Christmas letter from the Six family."
                />
            </Head>
            <a className="gazette-skip" href="#gazette-year">
                Skip to our year
            </a>

            <div className="gazette-paper">
                <header className="gazette-masthead">
                    <nav
                        className="gazette-topline"
                        aria-label="Main navigation"
                    >
                        <a href="#gazette-year">Our year</a>
                        <span className="gazette-date">2026</span>
                        <a href="#gazette-note">A note from us</a>
                    </nav>
                    <div className="gazette-name">
                        <span>The Six Family</span>
                    </div>
                    <div className="gazette-running-line">
                        <p>
                            People. Places. Ordinary days. Extraordinary
                            meaning.
                        </p>
                        <p>A year in review</p>
                    </div>
                </header>

                <main>
                    <section
                        className="gazette-cover"
                        aria-labelledby="gazette-cover-title"
                    >
                        <Photograph name="cover" priority />
                        <div className="gazette-cover-copy">
                            <h1 id="gazette-cover-title">
                                <span>A year to</span>
                                <span>hold on to</span>
                            </h1>
                            <div className="gazette-cover-invitation">
                                <p>
                                    The moments, big and small, that made our
                                    2026.
                                </p>
                                <a
                                    className="gazette-link"
                                    href="#gazette-year"
                                >
                                    Open our year
                                </a>
                            </div>
                        </div>
                    </section>

                    <nav
                        className="gazette-contents"
                        aria-label="Chapters in our year"
                    >
                        <p>In this edition</p>
                        {events.map((event, index) => (
                            <a key={event.id} href={`#${event.id}`}>
                                {String(index + 1).padStart(2, '0')}{' '}
                                <span>{event.indexTitle}</span>
                            </a>
                        ))}
                    </nav>

                    {events.map((event, index) => (
                        <EventSection
                            key={event.id}
                            event={event}
                            number={index + 1}
                        />
                    ))}

                    <section
                        className="gazette-letter"
                        id="gazette-note"
                        aria-labelledby="gazette-note-title"
                    >
                        <div className="gazette-letter-heading">
                            <p className="gazette-label">The last word</p>
                            <h2 id="gazette-note-title">
                                A note from
                                <br />
                                the family
                            </h2>
                            <span
                                className="gazette-letter-year"
                                aria-hidden="true"
                            >
                                2026
                            </span>
                        </div>
                        <div className="gazette-letter-body">
                            <p className="gazette-salutation">
                                Dear friends and family,
                            </p>
                            <div className="gazette-rich-text">
                                <p>
                                    What a gift to look back on another year
                                    together. For all the places we went, it’s
                                    the people who made it feel full. That
                                    includes you.
                                </p>
                                <p>
                                    Thank you for being part of our lives,
                                    whether you’re down the road or far away.
                                    Wishing you a peaceful Christmas and a new
                                    year full of good things.
                                </p>
                            </div>
                            <p className="gazette-signature">
                                With love,
                                <br />
                                <span>The Six Family</span>
                            </p>
                        </div>
                    </section>
                </main>

                <footer className="gazette-footer">
                    <div className="gazette-footer-line">
                        <p>From our home to yours. Merry Christmas.</p>
                        <a href="#gazette-top">Back to the beginning</a>
                    </div>
                    <details className="gazette-credits">
                        <summary>
                            About this preview &amp; photograph credits
                        </summary>
                        <p>
                            Stories and photographs are placeholders for your
                            family’s year. Photographs via Wikimedia Commons,
                            resized and cropped for this edition:
                        </p>
                        <ul>
                            {Object.entries(photographs).map(
                                ([name, photograph]) => (
                                    <li key={name}>
                                        <a
                                            href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(photograph.source)}`}
                                        >
                                            {photograph.author}
                                        </a>{' '}
                                        (
                                        {photograph.license ===
                                        'Public domain' ? (
                                            'Public domain'
                                        ) : (
                                            <a
                                                href={
                                                    photograph.license === 'CC0'
                                                        ? 'https://creativecommons.org/publicdomain/zero/1.0/'
                                                        : `https://creativecommons.org/licenses/${photograph.license}/`
                                                }
                                            >
                                                {photograph.license === 'CC0'
                                                    ? 'CC0'
                                                    : `CC ${photograph.license.startsWith('by-sa') ? 'BY-SA' : 'BY'} ${photograph.license.split('/')[1]}`}
                                            </a>
                                        )}
                                        )
                                    </li>
                                ),
                            )}
                        </ul>
                    </details>
                </footer>
            </div>
        </div>
    );
}
