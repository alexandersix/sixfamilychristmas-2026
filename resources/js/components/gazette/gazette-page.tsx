import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SkipLink } from './atoms';
import '../../../css/gazette.css';

export function GazettePage({
    id = 'gazette-top',
    className,
    skipTo,
    skipLabel = 'Skip to content',
    header,
    footer,
    children,
}: {
    id?: string;
    className?: string;
    skipTo: string;
    skipLabel?: string;
    header?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className={cn('family-gazette', className)} id={id}>
            <SkipLink href={skipTo}>{skipLabel}</SkipLink>
            <div className="gazette-paper">
                {header}
                <main>{children}</main>
                {footer}
            </div>
        </div>
    );
}
