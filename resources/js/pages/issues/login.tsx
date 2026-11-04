import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { Button, DisplayLine, GazettePage } from '@/components/gazette';

export default function IssueLogin({
    loginUrl,
    issueName,
}: {
    loginUrl: string;
    issueName: string;
}) {
    const form = useForm({ password: '' });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(loginUrl, {
            onFinish: () => form.reset('password'),
        });
    }

    return (
        <GazettePage
            className="gazette-login"
            skipTo="#issue-password"
            header={
                <header className="gazette-name gazette-login-name">
                    <DisplayLine>The Six Family</DisplayLine>
                </header>
            }
        >
            <Head title="Welcome, friends & family">
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="gazette-login-content">
                <form
                    onSubmit={submit}
                    className="gazette-login-form"
                    aria-label={`Unlock ${issueName} Issue`}
                >
                    <label htmlFor="issue-password">
                        Your invitation password
                    </label>
                    <input
                        id="issue-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={form.data.password}
                        onChange={(event) => {
                            form.setData('password', event.target.value);
                            form.clearErrors('password');
                        }}
                        aria-invalid={!!form.errors.password}
                        aria-describedby={
                            form.errors.password ? 'password-help' : undefined
                        }
                    />
                    {form.errors.password && (
                        <p
                            id="password-help"
                            className="gazette-login-help"
                            role="alert"
                        >
                            {form.errors.password}
                        </p>
                    )}
                    <Button
                        type="submit"
                        disabled={form.processing}
                        aria-busy={form.processing}
                    >
                        {form.processing
                            ? 'Unlocking…'
                            : `Unlock ${issueName} Issue`}
                    </Button>
                </form>
            </div>
        </GazettePage>
    );
}
