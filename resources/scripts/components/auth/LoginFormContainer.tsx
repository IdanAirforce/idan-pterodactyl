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

const AuthFormShell = styled.div`
    label {
        ${tw`text-neutral-100 text-xs uppercase tracking-wide font-medium`};
    }

    input {
        ${tw`bg-neutral-800 border-neutral-600 text-neutral-100 shadow-inner`};
    }

    input::placeholder {
        ${tw`text-neutral-400`};
    }

    input:not(:disabled):not(:read-only):focus {
        ${tw`border-blue-400 ring-2 ring-blue-500 ring-opacity-50`};
    }

    .input-help {
        ${tw`text-neutral-300`};
    }

    button[type='submit'] {
        ${tw`bg-primary-500 border-primary-400 text-white font-semibold shadow-lg`};
    }

    button[type='submit']:hover:not(:disabled) {
        ${tw`bg-blue-500 border-blue-400`};
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, ...props }, ref) => (
    <Container>
        <div css={tw`text-center mb-5 px-2`}>
            <p css={tw`inline-flex items-center rounded-full px-3 py-1 text-xs tracking-wider uppercase text-blue-100 bg-blue-500/10 border border-blue-400/30`}>
                IdanDev Panel
            </p>
            {title && <h2 css={tw`mt-3 text-3xl md:text-4xl text-neutral-100 font-bold`}>{title}</h2>}
            {subtitle && <p css={tw`mt-2 text-sm text-neutral-300 max-w-xl mx-auto`}>{subtitle}</p>}
        </div>
        <FlashMessageRender css={tw`mb-3 px-1`} />
        <Form {...props} ref={ref}>
            <div
                css={tw`relative overflow-hidden w-full grid md:grid-cols-[minmax(190px,250px),1fr] bg-neutral-900/90 border border-blue-400/20 shadow-2xl rounded-2xl p-4 md:p-5 backdrop-blur-md`}
            >
                <div css={tw`absolute inset-0 pointer-events-none`}>
                    <div css={tw`absolute -top-20 -left-12 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl`} />
                    <div css={tw`absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl`} />
                </div>
                <div css={tw`relative mb-4 md:mb-0 md:pr-6`}>
                    <div css={tw`h-full rounded-xl border border-blue-400/20 bg-neutral-800/70 p-4 md:p-5`}>
                        <h3 css={tw`text-blue-100 text-xs uppercase tracking-widest font-semibold`}>IdanDev</h3>
                        <p css={tw`mt-2 text-neutral-100 text-lg font-semibold leading-tight`}>Premium Control Access</p>
                        <p css={tw`mt-2 text-neutral-300 text-xs leading-relaxed`}>
                            Fast, secure authentication for your hosting operations.
                        </p>
                    </div>
                </div>
                <AuthFormShell css={tw`relative flex-1`}>
                    {props.children}
                </AuthFormShell>
            </div>
        </Form>
        <p css={tw`text-center text-neutral-500 text-xs mt-5`}>
            &copy; {new Date().getFullYear()} IdanDev Panel
        </p>
    </Container>
));
