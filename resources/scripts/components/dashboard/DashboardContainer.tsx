import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { NavLink, useLocation } from 'react-router-dom';

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
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            <div css={tw`grid md:grid-cols-[64px,1fr] gap-4 md:gap-6`}>
                <aside css={tw`hidden md:flex flex-col gap-2 sticky top-24 self-start`}>
                    <NavLink
                        to={'/'}
                        exact
                        css={tw`h-12 w-12 rounded-xl bg-neutral-900 border border-blue-400/20 text-neutral-300 flex items-center justify-center no-underline hover:text-white hover:border-blue-400/40`}
                        activeStyle={{
                            color: '#fff',
                            boxShadow: '0 0 0 1px rgba(59,130,246,0.28), inset 0 -2px rgba(59,130,246,1)',
                        }}
                    >
                        <FontAwesomeIcon icon={faLayerGroup} />
                    </NavLink>
                    <NavLink
                        to={'/account'}
                        css={tw`h-12 w-12 rounded-xl bg-neutral-900 border border-blue-400/20 text-neutral-300 flex items-center justify-center no-underline hover:text-white hover:border-blue-400/40`}
                        activeStyle={{
                            color: '#fff',
                            boxShadow: '0 0 0 1px rgba(59,130,246,0.28), inset 0 -2px rgba(59,130,246,1)',
                        }}
                    >
                        <FontAwesomeIcon icon={faUserCircle} />
                    </NavLink>
                    {rootAdmin && (
                        <a
                            href={'/admin'}
                            css={tw`h-12 w-12 rounded-xl bg-neutral-900 border border-blue-400/20 text-neutral-300 flex items-center justify-center no-underline hover:text-white hover:border-blue-400/40`}
                        >
                            <FontAwesomeIcon icon={faCogs} />
                        </a>
                    )}
                </aside>
                <main>
                    <section css={tw`rounded-2xl bg-neutral-900 border border-blue-400/20 p-5 shadow-2xl`}>
                        <div css={tw`flex items-start justify-between gap-4`}>
                            <div>
                                <p css={tw`text-xs uppercase tracking-wider text-blue-200`}>IdanDev Panel</p>
                                <h1 css={tw`mt-2 text-2xl md:text-3xl font-bold text-neutral-100`}>Hosting Dashboard</h1>
                                <p css={tw`mt-1 text-sm text-neutral-400`}>
                                    Manage your game servers with a compact, premium control surface.
                                </p>
                            </div>
                            {rootAdmin && (
                                <div css={tw`flex items-center bg-neutral-800 border border-blue-400/20 rounded-lg px-3 py-2`}>
                                    <p css={tw`uppercase text-xs tracking-wider text-neutral-400 mr-2`}>
                                        {showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}
                                    </p>
                                    <Switch
                                        name={'show_all_servers'}
                                        defaultChecked={showOnlyAdmin}
                                        onChange={() => setShowOnlyAdmin((s) => !s)}
                                    />
                                </div>
                            )}
                        </div>
                        {!!servers && (
                            <div css={tw`mt-4 grid grid-cols-2 md:grid-cols-4 gap-3`}>
                                <div css={tw`rounded-lg bg-neutral-800 border border-blue-400/20 px-3 py-2`}>
                                    <p css={tw`text-[10px] uppercase tracking-wider text-neutral-400`}>Total Servers</p>
                                    <p css={tw`mt-1 text-xl font-semibold text-neutral-100`}>{servers.pagination.total}</p>
                                </div>
                                <div css={tw`rounded-lg bg-neutral-800 border border-blue-400/20 px-3 py-2`}>
                                    <p css={tw`text-[10px] uppercase tracking-wider text-neutral-400`}>Listed This Page</p>
                                    <p css={tw`mt-1 text-xl font-semibold text-neutral-100`}>{servers.items.length}</p>
                                </div>
                                <div css={tw`rounded-lg bg-neutral-800 border border-blue-400/20 px-3 py-2`}>
                                    <p css={tw`text-[10px] uppercase tracking-wider text-neutral-400`}>Suspended</p>
                                    <p css={tw`mt-1 text-xl font-semibold text-neutral-100`}>
                                        {servers.items.filter((s) => s.status === 'suspended').length}
                                    </p>
                                </div>
                                <div css={tw`rounded-lg bg-neutral-800 border border-blue-400/20 px-3 py-2`}>
                                    <p css={tw`text-[10px] uppercase tracking-wider text-neutral-400`}>Operational</p>
                                    <p css={tw`mt-1 text-xl font-semibold text-neutral-100`}>
                                        {servers.items.filter((s) => s.status !== 'suspended').length}
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                    <section css={tw`mt-4`}>
                        {!servers ? (
                            <Spinner centered size={'large'} />
                        ) : (
                            <Pagination data={servers} onPageSelect={setPage}>
                                {({ items }) =>
                                    items.length > 0 ? (
                                        items.map((server, index) => (
                                            <ServerRow
                                                key={server.uuid}
                                                server={server}
                                                css={index > 0 ? tw`mt-3` : undefined}
                                            />
                                        ))
                                    ) : (
                                        <p css={tw`text-center text-sm text-neutral-400 bg-neutral-900 border border-blue-400/20 rounded-lg p-6`}>
                                            {showOnlyAdmin
                                                ? 'There are no other servers to display.'
                                                : 'There are no servers associated with your account.'}
                                        </p>
                                    )
                                }
                            </Pagination>
                        )}
                    </section>
                </main>
            </div>
        </PageContentBlock>
    );
};
