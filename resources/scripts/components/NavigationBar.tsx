import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-neutral-300 px-4 cursor-pointer transition-all duration-150 rounded-lg`};

        &:active,
        &:hover {
            ${tw`text-white bg-neutral-800`};
        }

        &:active,
        &:hover,
        &.active {
            box-shadow:
                inset 0 -2px ${theme`colors.blue.400`.toString()},
                0 0 0 1px rgba(59, 130, 246, 0.22);
        }
    }
`;

export default () => {
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <div className={'w-full bg-neutral-900 border-b border-blue-400/20 shadow-xl overflow-x-auto'}>
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-16 max-w-[1280px] px-3'}>
                <div id={'logo'} className={'flex-1'}>
                    <Link
                        to={'/'}
                        className={
                            'inline-flex items-center no-underline'
                        }
                    >
                        <span className={'text-sm uppercase tracking-wider text-blue-200 bg-blue-500/10 border border-blue-400/30 px-2 py-1 rounded-md mr-3'}>
                            IdanDev
                        </span>
                        <span className={'text-xl font-header font-semibold text-neutral-100 hover:text-white transition-colors duration-150'}>
                            Panel
                        </span>
                    </Link>
                </div>
                <RightNavigation className={'flex h-full items-center justify-center gap-1'}>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'}>
                            <span className={'flex items-center w-5 h-5'}>
                                <Avatar.User />
                            </span>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </div>
        </div>
    );
};
