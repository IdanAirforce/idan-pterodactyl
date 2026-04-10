import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
    subtitle?: string;
};

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, ...props }, ref) => (
    <Container>
        <div css={tw`text-center mb-6 px-2`}>
            <p css={tw`inline-flex items-center rounded-full px-3 py-1 text-xs tracking-[0.18em] uppercase text-primary-200 bg-primary-500/10 border border-primary-400/30`}>
                Pterodactyl Panel
            </p>
            {title && <h2 css={tw`mt-4 text-3xl md:text-4xl text-neutral-100 font-semibold`}>{title}</h2>}
            {subtitle && <p css={tw`mt-2 text-sm text-neutral-400 max-w-md mx-auto`}>{subtitle}</p>}
        </div>
        <FlashMessageRender css={tw`mb-4 px-1`} />
        <Form {...props} ref={ref}>
            <div css={tw`relative overflow-hidden md:flex w-full bg-neutral-900/90 border border-neutral-700/70 shadow-2xl rounded-2xl p-6 md:p-8 mx-1 backdrop-blur-sm`}>
                <div css={tw`absolute inset-0 pointer-events-none`}>
                    <div css={tw`absolute -top-24 -left-12 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl`} />
                    <div css={tw`absolute -bottom-24 -right-8 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl`} />
                </div>
                <div css={tw`relative flex-none select-none mb-6 md:mb-0 self-center md:pr-8`}>
                    <img src={'/assets/svgs/pterodactyl.svg'} css={tw`block w-40 md:w-56 mx-auto drop-shadow-xl`} />
                </div>
                <div css={tw`relative flex-1`}>{props.children}</div>
            </div>
        </Form>
        <p css={tw`text-center text-neutral-500 text-xs mt-5`}>
            &copy; 2015 - {new Date().getFullYear()}&nbsp;
            <a
                rel={'noopener nofollow noreferrer'}
                href={'https://pterodactyl.io'}
                target={'_blank'}
                css={tw`no-underline text-neutral-400 hover:text-neutral-200`}
            >
                Pterodactyl Software
            </a>
        </p>
    </Container>
));
