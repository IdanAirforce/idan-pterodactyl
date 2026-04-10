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
    ${tw`w-full max-w-5xl mx-auto px-4`};

    ${breakpoint('md')`
        ${tw`px-6`}
    `};
`;

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, ...props }, ref) => (
    <Container>
        <div css={tw`text-center mb-6 px-2`}>
            <p css={tw`inline-flex items-center rounded-full px-3 py-1 text-xs tracking-[0.18em] uppercase text-blue-100 bg-blue-500/10 border border-blue-400/30`}>
                IdanDev Panel
            </p>
            {title && <h2 css={tw`mt-3 text-2xl md:text-3xl text-neutral-100 font-semibold`}>{title}</h2>}
            {subtitle && <p css={tw`mt-2 text-sm text-neutral-400 max-w-lg mx-auto`}>{subtitle}</p>}
        </div>
        <FlashMessageRender css={tw`mb-3 px-1`} />
        <Form {...props} ref={ref}>
            <div
                css={tw`relative overflow-hidden w-full grid md:grid-cols-[minmax(180px,240px),1fr] bg-slate-950/85 border border-slate-700/70 shadow-2xl rounded-2xl p-4 md:p-5 backdrop-blur-md`}
            >
                <div css={tw`absolute inset-0 pointer-events-none`}>
                    <div css={tw`absolute -top-24 -left-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl`} />
                    <div css={tw`absolute -bottom-24 -right-14 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl`} />
                </div>
                <div css={tw`relative mb-4 md:mb-0 md:pr-6`}>
                    <div css={tw`h-full rounded-xl border border-blue-400/20 bg-slate-900/60 p-4 md:p-5`}>
                        <h3 css={tw`text-blue-100 text-sm uppercase tracking-[0.18em] font-semibold`}>IdanDev</h3>
                        <p css={tw`mt-3 text-neutral-200 text-lg font-semibold leading-tight`}>Secure Game Hosting Control</p>
                        <p css={tw`mt-2 text-neutral-400 text-xs leading-relaxed`}>
                            Access your panel with modern, secure account flows built for fast operations.
                        </p>
                    </div>
                </div>
                <div css={tw`relative flex-1`}>{props.children}</div>
            </div>
        </Form>
        <p css={tw`text-center text-neutral-500 text-xs mt-5`}>
            &copy; {new Date().getFullYear()} IdanDev Panel
        </p>
    </Container>
));
