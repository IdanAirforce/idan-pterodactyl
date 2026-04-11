import React, { forwardRef } from 'react';
import { Form } from 'formik';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
    subtitle?: string;
    size?: 'default' | 'wide';
};

const PageWrap = styled.div`
    ${tw`w-full mx-auto px-4`};

    ${breakpoint('md')`
        ${tw`px-6`}
    `};
`;

const ShellCard = styled.div<{ $wide: boolean }>`
    ${(p) => (p.$wide ? tw`max-w-6xl` : tw`max-w-5xl`)};
    ${tw`w-full mx-auto relative overflow-hidden rounded-2xl border border-neutral-700/90 bg-neutral-900/70 shadow-2xl`};
    box-shadow:
        0 24px 64px rgba(0, 0, 0, 0.55),
        0 0 0 1px rgba(249, 115, 22, 0.06);
`;

const FormShell = styled.div`
    label {
        color: #e5e7eb;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 600;
    }

    input {
        background: #0c0f14 !important;
        border-color: #3f3f46 !important;
        color: #fafafa !important;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    input::placeholder {
        color: #9ca3af;
    }

    input:not(:disabled):not(:read-only):focus {
        border-color: #fb923c !important;
        box-shadow:
            0 0 0 2px rgba(251, 146, 60, 0.35),
            0 8px 22px rgba(234, 88, 12, 0.18),
            inset 0 1px 1px rgba(0, 0, 0, 0.25) !important;
    }

    .input-help {
        color: #9ca3af;
    }

    button[type='submit'] {
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
        border-color: #fb923c !important;
        color: #ffffff !important;
        font-weight: 700;
        letter-spacing: 0.04em;
        box-shadow: 0 12px 28px rgba(234, 88, 12, 0.4);
    }

    button[type='submit']:hover:not(:disabled) {
        background: linear-gradient(135deg, #fb923c 0%, #f97316 100%) !important;
        border-color: #fdba74 !important;
        box-shadow: 0 14px 32px rgba(249, 115, 22, 0.48);
    }

    button[type='submit']:active:not(:disabled) {
        background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%) !important;
        border-color: #f97316 !important;
    }
`;

const navLinkClass =
    'relative pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400 no-underline transition-colors hover:text-neutral-200';
const navLinkActiveClass =
    "text-orange-400 after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-orange-400 after:content-['']";

const AuthTopNav = () => (
    <nav
        css={tw`flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 md:px-6 border-b border-neutral-800 bg-black/25`}
    >
        <div css={tw`flex flex-wrap items-center gap-5 md:gap-7`}>
            <Link to={'/'} className={navLinkClass}>
                Home
            </Link>
            <NavLink
                to={'/auth/login'}
                className={navLinkClass}
                activeClassName={navLinkActiveClass}
                isActive={(match, location) =>
                    !!match || location.pathname.startsWith('/auth/login')
                }
            >
                Sign in
            </NavLink>
            <NavLink to={'/auth/register'} className={navLinkClass} activeClassName={navLinkActiveClass}>
                Register
            </NavLink>
            <NavLink
                to={'/auth/password'}
                className={navLinkClass}
                activeClassName={navLinkActiveClass}
                isActive={(match, location) =>
                    !!match || location.pathname.startsWith('/auth/password')
                }
            >
                Forgot password
            </NavLink>
        </div>
        <Link
            to={'/'}
            css={tw`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-neutral-600 text-neutral-200 bg-neutral-800/80 no-underline hover:border-orange-500/50 hover:text-orange-100 transition-colors`}
        >
            Panel
        </Link>
    </nav>
);

const BrandingPanel = () => (
    <div
        css={tw`relative flex flex-col justify-between p-6 md:p-8 lg:p-10 min-h-[220px] lg:min-h-[min(100%,28rem)] lg:w-[42%] flex-shrink-0 overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-[#0f0d0c]`}
    >
        <div css={tw`absolute inset-0 pointer-events-none`}>
            <div css={tw`absolute -top-20 -left-16 h-56 w-56 rounded-full bg-orange-600/25 blur-3xl`} />
            <div css={tw`absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-red-600/20 blur-3xl`} />
            <div css={tw`absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl`} />
        </div>
        <div css={tw`relative`}>
            <p
                css={tw`text-3xl md:text-4xl font-extrabold tracking-tight text-white`}
                style={{ fontFamily: 'inherit' }}
            >
                <span css={tw`text-orange-500`}>Idan</span>
                <span css={tw`text-neutral-100`}>Dev</span>
            </p>
            <p css={tw`mt-1 text-sm font-medium text-neutral-500 uppercase tracking-[0.2em]`}>Panel</p>
        </div>
        <div css={tw`relative mt-8 lg:mt-0`}>
            <p css={tw`flex items-start gap-2 text-sm text-neutral-400 leading-relaxed max-w-xs`}>
                <svg
                    css={tw`w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5`}
                    viewBox={'0 0 24 24'}
                    fill={'currentColor'}
                    aria-hidden
                >
                    <path d={'M13 2L3 14h8l-1 8 10-12h-8l1-8z'} />
                </svg>
                <span>Manage your servers easily and quickly from one place.</span>
            </p>
        </div>
    </div>
);

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, size = 'default', ...props }, ref) => {
    const { children, css: formCss, ...formRest } = props as Props & { css?: object };

    return (
        <PageWrap>
            <FlashMessageRender css={tw`mb-4 max-w-5xl mx-auto px-1`} />
            <Form {...formRest} ref={ref} css={[tw`block w-full`, formCss]}>
                <ShellCard $wide={size === 'wide'}>
                    <AuthTopNav />
                    <div css={tw`flex flex-col lg:flex-row`}>
                        <BrandingPanel />
                        <div
                            css={tw`relative flex-1 p-5 md:p-7 lg:p-9 bg-neutral-950/60 border-t lg:border-t-0 lg:border-l border-neutral-800`}
                        >
                            <div css={tw`absolute inset-0 pointer-events-none opacity-40`}>
                                <div css={tw`absolute top-0 right-0 h-32 w-32 rounded-full bg-orange-500/15 blur-2xl`} />
                            </div>
                            <div css={tw`relative`}>
                                {title && (
                                    <h2 css={tw`text-2xl md:text-3xl font-bold text-white tracking-tight`}>{title}</h2>
                                )}
                                {subtitle && <p css={tw`mt-2 text-sm text-neutral-400 max-w-lg`}>{subtitle}</p>}
                                <div css={tw`mt-6`}>
                                    <FormShell>{children}</FormShell>
                                </div>
                            </div>
                        </div>
                    </div>
                </ShellCard>
            </Form>
            <p css={tw`text-center text-neutral-600 text-xs mt-6`}>
                &copy; {new Date().getFullYear()} IdanDev Panel
            </p>
        </PageWrap>
    );
});
