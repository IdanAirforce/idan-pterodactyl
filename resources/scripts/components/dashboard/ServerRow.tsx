import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const UNLIMITED_HE = 'ללא הגבלה';

const GlassCard = styled(Link)`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    align-items: center;
    text-decoration: none;
    color: inherit;
    border-radius: 0.75rem;
    padding: 1rem 1.15rem;
    background: rgba(39, 39, 42, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 10px 40px rgba(0, 0, 0, 0.35),
        0 0 0 1px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(16px) saturate(1.15);
    -webkit-backdrop-filter: blur(16px) saturate(1.15);
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease,
        background 0.2s ease;

    @media (min-width: 1024px) {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.45fr) auto;
        gap: 1.25rem;
        padding: 1.1rem 1.35rem;
    }

    &:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.14);
        background: rgba(47, 47, 52, 0.78);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 16px 48px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(59, 130, 246, 0.12),
            0 0 36px rgba(59, 130, 246, 0.06);
    }
`;

const ThinBar = styled.div<{ $alarm?: boolean; $pct: number }>`
    ${tw`h-1 rounded-full overflow-hidden bg-white/10`};
    width: 100%;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        inset: 0 auto 0 0;
        width: ${(p) => Math.min(100, Math.max(0, p.$pct))}%;
        border-radius: 9999px;
        background: ${(p) =>
            p.$alarm
                ? 'linear-gradient(90deg, #f87171, #ef4444)'
                : 'linear-gradient(90deg, rgba(96, 165, 250, 0.85), rgba(59, 130, 246, 0.95))'};
        transition: width 0.35s ease;
    }
`;

const StatusBadge = styled.span<{ $tone: 'green' | 'red' | 'yellow' | 'neutral' }>`
    ${tw`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg`};
    ${(p) =>
        p.$tone === 'green' &&
        tw`bg-green-500/10 text-green-200 border border-green-400/30`}
    ${(p) =>
        p.$tone === 'red' &&
        tw`bg-red-500/10 text-red-200 border border-red-400/30`}
    ${(p) =>
        p.$tone === 'yellow' &&
        tw`bg-yellow-500/10 text-yellow-100 border border-yellow-400/30`}
    ${(p) =>
        p.$tone === 'neutral' &&
        tw`bg-neutral-500/20 text-neutral-200 border border-white/10`}
`;

const ManageCue = styled.span`
    ${tw`inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg`};
    border: 1px solid rgba(96, 165, 250, 0.35);
    background: linear-gradient(180deg, rgba(37, 99, 235, 0.55) 0%, rgba(29, 78, 216, 0.45) 100%);
    color: #f8fafc;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1) inset, 0 8px 24px rgba(37, 99, 235, 0.2);
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        background 0.15s ease;

    ${GlassCard}:hover & {
        border-color: rgba(147, 197, 253, 0.45);
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.12) inset, 0 10px 28px rgba(59, 130, 246, 0.28);
        background: linear-gradient(180deg, rgba(59, 130, 246, 0.65) 0%, rgba(37, 99, 235, 0.5) 100%);
    }
`;

const RowLabel = styled.span<{ $alarm?: boolean }>`
    ${tw`text-2xs uppercase tracking-wide`};
    ${(p) => (p.$alarm ? tw`text-red-200` : tw`text-neutral-500`)};
`;

type Timer = ReturnType<typeof setInterval>;

function powerStateLabel(status: ServerPowerState | undefined): { text: string; tone: 'green' | 'red' | 'yellow' | 'neutral' } {
    if (!status || status === 'offline') {
        return { text: 'כבוי', tone: 'red' };
    }
    if (status === 'running') {
        return { text: 'פעיל', tone: 'green' };
    }
    if (status === 'starting' || status === 'stopping') {
        return { text: status === 'starting' ? 'מפעיל' : 'כובה', tone: 'yellow' };
    }
    return { text: 'לא זמין', tone: 'neutral' };
}

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimitBytes = server.limits.disk !== 0 ? mbToBytes(server.limits.disk) : 0;
    const memoryLimitBytes = server.limits.memory !== 0 ? mbToBytes(server.limits.memory) : 0;

    const diskLimitLabel = server.limits.disk !== 0 ? bytesToString(diskLimitBytes) : UNLIMITED_HE;
    const memoryLimitLabel = server.limits.memory !== 0 ? bytesToString(memoryLimitBytes) : UNLIMITED_HE;
    const cpuLimitLabel = server.limits.cpu !== 0 ? `${server.limits.cpu}%` : UNLIMITED_HE;

    const cpuPctBar =
        stats && !isSuspended
            ? server.limits.cpu > 0
                ? (stats.cpuUsagePercent / server.limits.cpu) * 100
                : Math.min(100, stats.cpuUsagePercent)
            : 0;

    const memoryPctBar =
        stats && !isSuspended && memoryLimitBytes > 0
            ? (stats.memoryUsageInBytes / memoryLimitBytes) * 100
            : stats && !isSuspended
              ? Math.min(100, (stats.memoryUsageInBytes / (512 * 1024 * 1024)) * 100)
              : 0;

    const diskPctBar =
        stats && !isSuspended && diskLimitBytes > 0
            ? (stats.diskUsageInBytes / diskLimitBytes) * 100
            : stats && !isSuspended
              ? Math.min(100, (stats.diskUsageInBytes / (1024 * 1024 * 1024)) * 100)
              : 0;

    const defaultAlloc = server.allocations.filter((alloc) => alloc.isDefault);

    const statusBlock = () => {
        if (isSuspended) {
            return <StatusBadge $tone={'red'}>מושעה</StatusBadge>;
        }
        if (!stats) {
            if (server.isTransferring) {
                return <StatusBadge $tone={'yellow'}>בהעברה</StatusBadge>;
            }
            if (server.status === 'installing') {
                return <StatusBadge $tone={'yellow'}>בהתקנה</StatusBadge>;
            }
            if (server.status === 'restoring_backup') {
                return <StatusBadge $tone={'yellow'}>משחזר גיבוי</StatusBadge>;
            }
            if (server.status) {
                return <StatusBadge $tone={'neutral'}>לא זמין</StatusBadge>;
            }
            return null;
        }
        const { text, tone } = powerStateLabel(stats.status);
        return <StatusBadge $tone={tone}>{text}</StatusBadge>;
    };

    const showResourceBars = stats && !isSuspended;
    const showMiddleSpinner =
        !isSuspended && !stats && !server.isTransferring && !server.status;

    return (
        <GlassCard to={`/server/${server.id}`} className={className}>
            <div css={tw`min-w-0 text-right`}>
                <p css={tw`text-lg font-bold text-neutral-100 break-words`}>{server.name}</p>
                <p css={tw`mt-1 text-sm text-neutral-400`} dir={'ltr'} style={{ unicodeBidi: 'plaintext' }}>
                    {defaultAlloc.map((allocation) => (
                        <React.Fragment key={allocation.ip + allocation.port.toString()}>
                            {allocation.alias || ip(allocation.ip)}:{allocation.port}
                        </React.Fragment>
                    ))}
                </p>
                {!!server.description && (
                    <p css={tw`mt-1.5 text-xs text-neutral-500 break-words line-clamp-2`}>{server.description}</p>
                )}
            </div>

            <div css={tw`min-w-0 space-y-3 flex flex-col justify-center`}>
                {showMiddleSpinner ? (
                    <div css={tw`flex justify-center py-4`}>
                        <Spinner size={'small'} />
                    </div>
                ) : showResourceBars ? (
                    <>
                        <div>
                            <div css={tw`flex justify-between items-baseline gap-2 mb-1`}>
                                <RowLabel $alarm={alarms.cpu}>מעבד</RowLabel>
                                <span css={tw`text-xs text-neutral-300 tabular-nums`} dir={'ltr'}>
                                    {stats.cpuUsagePercent.toFixed(1)}% / {cpuLimitLabel}
                                </span>
                            </div>
                            <ThinBar $pct={cpuPctBar} $alarm={alarms.cpu} />
                        </div>
                        <div>
                            <div css={tw`flex justify-between items-baseline gap-2 mb-1`}>
                                <RowLabel $alarm={alarms.memory}>זיכרון</RowLabel>
                                <span css={tw`text-xs text-neutral-300 tabular-nums`} dir={'ltr'}>
                                    {bytesToString(stats.memoryUsageInBytes)} / {memoryLimitLabel}
                                </span>
                            </div>
                            <ThinBar $pct={memoryPctBar} $alarm={alarms.memory} />
                        </div>
                        <div>
                            <div css={tw`flex justify-between items-baseline gap-2 mb-1`}>
                                <RowLabel $alarm={alarms.disk}>אחסון</RowLabel>
                                <span css={tw`text-xs text-neutral-300 tabular-nums`} dir={'ltr'}>
                                    {bytesToString(stats.diskUsageInBytes)} / {diskLimitLabel}
                                </span>
                            </div>
                            <ThinBar $pct={diskPctBar} $alarm={alarms.disk} />
                        </div>
                    </>
                ) : (
                    <div css={tw`hidden lg:block min-h-[4.5rem]`} aria-hidden />
                )}
            </div>

            <div css={tw`flex flex-col items-center gap-3 lg:items-end flex-flex-shrink-0`}>
                {statusBlock()}
                <ManageCue>ניהול</ManageCue>
            </div>
        </GlassCard>
    );
};
