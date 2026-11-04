import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import '../../css/option-1/page.css';

const photos = {
    winter: {
        alt: 'A quiet trail between snow-covered fir trees',
        caption: 'A little winter quiet.',
        author: 'Ximeg',
        license: 'CC BY-SA 3.0',
        source: 'Skiing_in_Oberhof_March_2013-12-Ski_track.jpg',
    },
    mountains: {
        alt: 'Evening light falling on mountains above a still alpine lake',
        caption: 'The kind of view you take the long way for.',
        author: 'Vyacheslav Argenberg',
        license: 'CC BY 4.0',
        source: 'Mountain_lake,_Mylgval_mountain_cirque_before_sunset,_Caucasus_Mountains.jpg',
    },
    stars: {
        alt: 'The Milky Way reflected in a mountain lake after dark',
        caption: 'And then the stars came out.',
        author: 'Giles Laurent',
        license: 'CC BY-SA 4.0',
        source: '036_Milky_Way_during_Perseids_seen_from_Oeschinensee_with_water_reflections_Photo_by_Giles_Laurent.jpg',
    },
    beach: {
        alt: 'Two people walking along the water at sunset',
        caption: 'Nowhere to be but right here.',
        author: 'Ferdous',
        license: 'CC BY-SA 3.0',
        source: "Family_walking_at_the_evening,_cox's_bazar_.jpg",
    },
    'beach-huts': {
        alt: 'A row of little beach huts tucked into the sand',
        caption: 'Our sort of summer neighborhood.',
        author: 'Gzzz',
        license: 'CC BY-SA 3.0',
        source: 'Cabines_de_bain_Berck.jpg',
    },
    autumn: {
        alt: 'Sunlight through a forest with a path covered in fallen leaves',
        caption: 'One more walk before heading home.',
        author: 'Pudelek (Marcin Szala)',
        license: 'CC BY-SA 4.0',
        source: 'Slezské_Beskydy_-_Rytířská_stezka_(cesta_Nýdek_-_Velká_Čantoryje).JPG',
    },
    baking: {
        alt: 'Hands kneading bread dough on a wooden kitchen board',
        caption: 'Made with love. And a little too much flour.',
        author: 'Tim Sackton',
        license: 'CC BY-SA 2.0',
        source: 'Kneading_(18-366)_(24399440891).jpg',
    },
    sourdough: {
        alt: 'A glass jar of sourdough starter, ready for another loaf',
        caption: 'Something good in the making.',
        author: 'Janus Sandsgaard',
        license: 'CC BY 4.0',
        source: 'Sourdough.jpg',
    },
};

type PhotoName = keyof typeof photos;

function Photo({
    name,
    className = '',
    priority = false,
}: {
    name: PhotoName;
    className?: string;
    priority?: boolean;
}) {
    const photo = photos[name];

    return (
        <figure className={`annual-photo ${className}`}>
            <div className="photo-frame" data-slot={name} data-alt={photo.alt}>
                <img
                    src={`/images/option-1/${name}-1920.webp`}
                    srcSet={`/images/option-1/${name}-960.webp 960w, /images/option-1/${name}-1920.webp 1920w`}
                    sizes="(max-width: 760px) 92vw, 50vw"
                    alt={photo.alt}
                    width={1920}
                    height={name === 'winter' ? 2887 : 1280}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'auto'}
                />
            </div>
            <figcaption>{photo.caption}</figcaption>
        </figure>
    );
}

export default function OptionOne() {
    useEffect(() => {
        document.documentElement.classList.add('family-annual-page');

        return () => {
            document.documentElement.classList.remove('family-annual-page');
        };
    }, []);

    return (
        <div className="family-annual" id="top">
            <Head title="Christmas 2026 | The Six Family">
                <meta
                    name="description"
                    content="A little look back at a year together. Adventures, everyday moments, and a Christmas note from the Six family."
                />
            </Head>
            <a className="skip-link" href="#our-year">
                Skip to our year
            </a>
            <header className="annual-masthead annual-container">
                <a className="annual-wordmark" href="#top">
                    The Six Family
                </a>
                <nav aria-label="Main navigation">
                    <a href="#our-year">Our year</a>
                    <a href="#family-note">A note from us</a>
                </nav>
                <span className="masthead-year">Christmas 2026</span>
            </header>

            <main>
                <section
                    className="annual-cover annual-container"
                    aria-labelledby="cover-title"
                >
                    <div className="cover-type">
                        <h1 id="cover-title">
                            <span className="cover-merry">Merry</span>
                            <span className="cover-everything">
                                everything.
                            </span>
                        </h1>
                        <p className="cover-lead">
                            The big adventures. The little things. Our 2026,
                            together.
                        </p>
                        <a className="annual-button" href="#our-year">
                            Step inside our year
                        </a>
                    </div>
                    <Photo name="winter" className="cover-photo" priority />
                </section>

                <nav
                    id="our-year"
                    className="year-index annual-container"
                    aria-label="Stories from our year"
                >
                    <p>A few pages from 2026</p>
                    <div className="index-links">
                        <a href="#spring">
                            <span>Spring</span>The great outdoors
                        </a>
                        <a href="#summer">
                            <span>Summer</span>A slower kind of week
                        </a>
                        <a href="#autumn">
                            <span>Autumn</span>Our favorite detour
                        </a>
                        <a href="#december">
                            <span>December</span>Home for the holidays
                        </a>
                    </div>
                </nav>

                <section
                    id="spring"
                    className="spring-story annual-container"
                    aria-labelledby="spring-title"
                >
                    <div className="story-copy">
                        <div className="story-folio">
                            <span>01</span>
                            <p>Out into the world, this spring</p>
                        </div>
                        <h2 id="spring-title">The long way to the lake</h2>
                        <div className="rich-text">
                            <p>
                                We packed the car, forgot something important,
                                and went anyway. A few days in the mountains
                                brought muddy shoes, picnic lunches, and the
                                sort of quiet you don’t realize you’ve been
                                missing.
                            </p>
                            <p>
                                The best part? Staying up past bedtime to see
                                the stars.{' '}
                                <strong>
                                    Some things are worth being a little tired
                                    for.
                                </strong>
                            </p>
                        </div>
                    </div>
                    <div className="spring-photos">
                        <Photo name="mountains" />
                        <Photo name="stars" className="stars-photo" />
                    </div>
                </section>

                <section
                    id="summer"
                    className="summer-story"
                    aria-labelledby="summer-title"
                >
                    <div className="annual-container">
                        <div className="summer-heading">
                            <h2 id="summer-title">
                                Saltwater.
                                <br />
                                No schedule.
                            </h2>
                            <div className="story-folio">
                                <span>02</span>
                                <p>A little summer escape</p>
                            </div>
                        </div>
                        <div className="summer-spread">
                            <Photo name="beach" className="beach-photo" />
                            <div className="summer-aside">
                                <Photo name="beach-huts" />
                                <div className="rich-text">
                                    <p>
                                        Our beach week had a very full
                                        itinerary: walk to the water, find a
                                        good shell, do it all again. We ate
                                        dinner with sandy feet and watched the
                                        sky change colors.
                                    </p>
                                    <p>
                                        <em>
                                            Nothing particularly extraordinary
                                            happened.
                                        </em>{' '}
                                        Which, looking back, was exactly what
                                        made it wonderful.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="autumn"
                    className="autumn-story annual-container"
                    aria-labelledby="autumn-title"
                >
                    <div className="autumn-heading">
                        <div className="story-folio">
                            <span>03</span>
                            <p>A Saturday in October</p>
                        </div>
                        <h2 id="autumn-title">Taking the scenic route</h2>
                    </div>
                    <Photo name="autumn" />
                    <div className="autumn-postscript">
                        <p className="story-pull">
                            No big plans.
                            <br />A very good day.
                        </p>
                        <div className="rich-text">
                            <p>
                                An afternoon walk became a whole day outside. We
                                followed the prettiest leaves and decided the
                                wrong turn was actually the right one.
                            </p>
                            <p>
                                Hot chocolate on the way home. Leaves in our
                                pockets.{' '}
                                <strong>A Saturday worth keeping.</strong>
                            </p>
                        </div>
                    </div>
                </section>

                <section
                    id="december"
                    className="december-story annual-container"
                    aria-labelledby="december-title"
                >
                    <div className="december-heading">
                        <div className="story-copy">
                            <div className="story-folio">
                                <span>04</span>
                                <p>Back in the kitchen, this December</p>
                            </div>
                            <h2 id="december-title">
                                A little flour.
                                <br />A lot of love.
                            </h2>
                        </div>
                        <div className="rich-text">
                            <p>
                                Our new holiday tradition: baking bread
                                together. There was flour on the floor and more
                                than one loaf we’ll call <em>rustic.</em>
                            </p>
                            <p>
                                Everyone helped. Warm bread never lasted long.
                                We’re already looking forward to next time.
                            </p>
                        </div>
                    </div>
                    <div className="december-photos">
                        <Photo name="baking" />
                        <Photo name="sourdough" />
                    </div>
                </section>

                <section
                    id="family-note"
                    className="family-letter"
                    aria-labelledby="letter-title"
                >
                    <div className="letter-layout annual-container">
                        <h2 id="letter-title">
                            A note from
                            <br />
                            the family
                        </h2>
                        <div className="letter-body">
                            <p>Dear friends and family,</p>
                            <p>
                                What a gift to look back on another year
                                together. For all the places we went, it’s the
                                people who made it feel full. That includes you.
                            </p>
                            <p>
                                Thank you for being part of our lives, whether
                                you’re down the road or far away. Wishing you a
                                peaceful Christmas and a new year full of good
                                things.
                            </p>
                            <p className="letter-signature">
                                With love,
                                <br />
                                <span>The Six Family</span>
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="annual-footer annual-container">
                <div className="footer-goodbye">
                    <p>From our home to yours. Merry Christmas.</p>
                    <a href="#top">Back to the top</a>
                </div>
                <div className="photo-credits" data-credits>
                    <p>
                        Preview stories and photographs are stand-ins for your
                        family’s year.
                    </p>
                    <p>
                        Photographs, via Wikimedia Commons:{' '}
                        {Object.entries(photos).map(([name, photo], index) => (
                            <span key={name}>
                                {index > 0 && '; '}
                                <a
                                    href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(photo.source)}`}
                                >
                                    {photo.author}
                                </a>{' '}
                                (
                                <a
                                    href={`https://creativecommons.org/licenses/${photo.license.includes('BY-SA') ? 'by-sa' : 'by'}/${photo.license.slice(-3)}/`}
                                >
                                    {photo.license}
                                </a>
                                )
                            </span>
                        ))}
                        . Photographs cropped and converted to monochrome.
                    </p>
                </div>
            </footer>
        </div>
    );
}
