import { Head } from '@inertiajs/react';
import {
    Chapter,
    Contents,
    Cover,
    Disclosure,
    DisplayLine,
    Footer,
    GazettePage,
    Masthead,
} from '@/components/gazette';
import type { ChapterProps } from '@/components/gazette';

type Issue = {
    name: string;
    publication_name: string;
    motto: string;
    edition_description: string;
    left_navigation_label: string;
    right_navigation_label: string;
    cover_photo: { src: string; alt: string } | null;
    cover_photo_alt: string;
    cover_headline: string;
    cover_introduction: string;
    cover_link_label: string;
    events: {
        id: number;
        name: string;
        title: string;
        note: string | null;
        body: string;
        photos: ChapterProps['photos'];
    }[];
};

export default function IssuePage({
    issue,
    preview,
}: {
    issue: Issue;
    preview: boolean;
}) {
    return (
        <GazettePage
            skipTo="#issue-contents"
            skipLabel="Skip to this issue"
            header={
                <Masthead
                    name={issue.publication_name}
                    year={issue.name}
                    left={{
                        href: '#issue-contents',
                        label: issue.left_navigation_label,
                    }}
                    right={{
                        href: '#gazette-footer',
                        label: issue.right_navigation_label,
                    }}
                    motto={issue.motto}
                    edition={
                        preview ? 'Editor preview' : issue.edition_description
                    }
                />
            }
            footer={
                <div id="gazette-footer">
                    <Footer
                        back={{
                            href: '#gazette-top',
                            label: 'Back to the beginning',
                        }}
                        credits={
                            !issue.cover_photo && (
                                <Disclosure summary="Cover photograph credit">
                                    <p>
                                        Photograph by{' '}
                                        <a href="https://commons.wikimedia.org/wiki/File:Herbert_Lake_beim_Icefields_Parkway.jpg">
                                            Florian Fuchs
                                        </a>
                                        , licensed under{' '}
                                        <a href="https://creativecommons.org/licenses/by/3.0/">
                                            CC BY 3.0
                                        </a>
                                        . Resized and cropped for this edition.
                                    </p>
                                </Disclosure>
                            )
                        }
                    >
                        From our home to yours. Merry Christmas.
                    </Footer>
                </div>
            }
        >
            <Head title={`${issue.publication_name} | ${issue.name}`}>
                {preview && <meta name="robots" content="noindex, nofollow" />}
            </Head>
            <Cover
                id="gazette-cover-title"
                title={
                    <>
                        {issue.cover_headline.split('\n').map((line, index) => (
                            <DisplayLine key={index}>{line}</DisplayLine>
                        ))}
                    </>
                }
                photograph={
                    issue.cover_photo ?? {
                        src: '/images/option-2/cover-1920.webp',
                        srcSet: '/images/option-2/cover-960.webp 960w, /images/option-2/cover-1920.webp 1920w',
                        sizes: '(max-width: 680px) 92vw, (max-width: 1100px) 55vw, 650px',
                        alt: issue.cover_photo_alt,
                    }
                }
                action={{
                    href: '#issue-contents',
                    label: issue.cover_link_label,
                }}
            >
                {issue.cover_introduction}
            </Cover>
            <div id="issue-contents">
                {preview && (
                    <p>
                        Editor preview — unpublished issues are only visible to
                        signed-in editors.
                    </p>
                )}
                {issue.events.length === 0 && (
                    <p>Our stories are still being written.</p>
                )}
                {issue.events.length > 0 && (
                    <Contents
                        items={issue.events.map((event) => ({
                            href: `#event-${event.id}`,
                            label: event.name,
                        }))}
                    />
                )}
            </div>
            {issue.events.map((event, index) => (
                <Chapter
                    key={event.id}
                    id={`event-${event.id}`}
                    number={index + 1}
                    title={event.title}
                    note={event.note ?? undefined}
                    featured={index === 0}
                    photos={event.photos}
                >
                    <div
                        className="contents"
                        dangerouslySetInnerHTML={{ __html: event.body }}
                    />
                </Chapter>
            ))}
        </GazettePage>
    );
}
