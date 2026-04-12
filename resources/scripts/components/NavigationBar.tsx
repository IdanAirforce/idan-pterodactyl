import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const Shell = styled.header`
    ${tw`w-full overflow-x-auto`};
    background: rgba(9, 9, 11, 0.72);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(16px) saturate(1.15);
    -webkit-backdrop-filter: blur(16px) saturate(1.15);
`;

const Inner = styled.div`
    ${tw`mx-auto w-full flex items-center h-[3.5rem] max-w-6xl px-3 sm:px-5`};
`;

const Brand = styled(Link)`
    ${tw`flex-1 no-underline transition-colors duration-150`};
    font-size: 1.125rem;
    font-weight: 600;
    color: #f4f4f5;
    letter-spacing: -0.02em;

    &:hover {
        color: #ffffff;
    }
`;

const NavCluster = styled.div`
    ${tw`flex h-full items-center gap-0.5 sm:gap-1`};

    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center justify-center h-full min-w-[2.75rem] no-underline text-neutral-400 px-2 sm:px-3 cursor-pointer transition-all duration-150 rounded-lg border border-transparent`};

        &:hover {
            ${tw`text-neutral-100 bg-white/5 border-white/10`};
        }

        &.active {
            ${tw`text-neutral-100 bg-white/10 border-white/10`};
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
        <Shell dir={'rtl'} lang={'he'}>
            <SpinnerOverlay visible={isLoggingOut} />
            <Inner>
                <Brand to={'/'}>איידן דב פאנל</Brand>
                <NavCluster>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'לוח בקרה'}>
                        <NavLink to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'ניהול מערכת'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'הגדרות חשבון'}>
                        <NavLink to={'/account'}>
                            <span className={'flex items-center w-5 h-5'}>
                                <Avatar.User />
                            </span>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'התנתקות'}>
                        <button type={'button'} onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </NavCluster>
            </Inner>
        </Shell>
    );
};
