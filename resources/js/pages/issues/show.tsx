import { Head } from '@inertiajs/react';
import {
    Chapter,
    Contents,
    Footer,
    GazettePage,
    Heading,
    Masthead,
} from '@/components/gazette';
import type { ChapterProps } from '@/components/gazette';

type Issue = {
    name: string;
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
                    name="The Six Family"
                    year={issue.name}
                    left={{ href: '#issue-contents', label: 'Our year' }}
                    right={{ href: '#gazette-footer', label: 'With love' }}
                    motto="People. Places. Ordinary days. Extraordinary meaning."
                    edition={preview ? 'Editor preview' : 'A year in review'}
                />
            }
            footer={
                <div id="gazette-footer">
                    <Footer
                        back={{
                            href: '#gazette-top',
                            label: 'Back to the beginning',
                        }}
                    >
                        From our home to yours. Merry Christmas.
                    </Footer>
                </div>
            }
        >
            <Head title={`The Six Family | ${issue.name}`}>
                {preview && <meta name="robots" content="noindex, nofollow" />}
            </Head>
            <section id="issue-contents" className="gazette-chapter">
                <Heading as="h1">Our {issue.name}</Heading>
                {preview && (
                    <p>
                        Editor preview — unpublished issues are only visible to
                        signed-in editors.
                    </p>
                )}
                {issue.events.length === 0 && (
                    <p>Our stories are still being written.</p>
                )}
            </section>
            {issue.events.length > 0 && (
                <Contents
                    items={issue.events.map((event) => ({
                        href: `#event-${event.id}`,
                        label: event.name,
                    }))}
                />
            )}
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
