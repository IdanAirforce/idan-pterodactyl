import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';

const ScopeSegmentTrack = styled.div`
    display: inline-flex;
    align-items: stretch;
    padding: 3px;
    gap: 2px;
    border-radius: 10px;
    background: rgba(39, 39, 42, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
`;

const ScopeSegmentBtn = styled.button<{ $active: boolean }>`
    ${tw`relative rounded-lg border text-sm font-medium transition-all duration-150 whitespace-nowrap`};
    padding: 0.4rem 0.75rem;

    ${(p) =>
        p.$active
            ? tw`text-neutral-100 bg-primary-600/20 border-primary-500/30 shadow-sm`
            : tw`text-neutral-400 border-transparent hover:text-neutral-200 hover:bg-white/5`};

    &:focus-visible {
        outline: 2px solid rgba(59, 130, 246, 0.45);
        outline-offset: 1px;
    }
`;

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    return (
        <PageContentBlock title={'השרתים שלי'} showFlashKey={'dashboard'}>
            <div css={tw`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4 mb-6`}>
                <h1 css={tw`text-2xl sm:text-3xl font-semibold text-neutral-100 tracking-tight text-right`}>
                    השרתים שלי
                </h1>
                {rootAdmin && (
                    <ScopeSegmentTrack role={'group'} aria-label={'בחירת היקף רשימת שרתים'}>
                        <ScopeSegmentBtn
                            type={'button'}
                            $active={!showOnlyAdmin}
                            onClick={() => setShowOnlyAdmin(false)}
                            aria-pressed={!showOnlyAdmin}
                        >
                            השרתים שלי
                        </ScopeSegmentBtn>
                        <ScopeSegmentBtn
                            type={'button'}
                            $active={showOnlyAdmin}
                            onClick={() => setShowOnlyAdmin(true)}
                            aria-pressed={showOnlyAdmin}
                        >
                            כל השרתים
                        </ScopeSegmentBtn>
                    </ScopeSegmentTrack>
                )}
            </div>
            {!servers ? (
                <Spinner centered size={'large'} />
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) =>
                        items.length > 0 ? (
                            <div css={tw`flex flex-col gap-4`}>
                                {items.map((server) => (
                                    <ServerRow key={server.uuid} server={server} />
                                ))}
                            </div>
                        ) : (
                            <p css={tw`text-center text-sm text-neutral-500 py-8`}>
                                {showOnlyAdmin ? 'אין שרתים נוספים להצגה.' : 'אין שרתים המקושרים לחשבון שלך.'}
                            </p>
                        )
                    }
                </Pagination>
            )}
        </PageContentBlock>
    );
};
