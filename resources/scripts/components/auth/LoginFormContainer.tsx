import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
    subtitle?: string;
    size?: 'default' | 'wide';
};

const Container = styled.div`
    ${tw`w-full mx-auto max-w-6xl flex flex-col items-center`};
    ${tw`px-4`};

    ${breakpoint('md')`
        ${tw`px-6`}
    `};
`;

const Card = styled.div<{ $wide: boolean }>`
    width: 100%;
    max-width: ${(p: { $wide: boolean }) => (p.$wide ? '42rem' : '26rem')};
    margin-left: auto;
    margin-right: auto;
    position: relative;
    overflow: hidden;
    border-radius: 14px;
    padding: 1.5rem 1.35rem;
    @media (min-width: 640px) {
        padding: 1.75rem 1.6rem;
    }

    background: rgba(14, 16, 22, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.055);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 4px 6px rgba(0, 0, 0, 0.25),
        0 20px 50px rgba(0, 0, 0, 0.55),
        0 0 0 1px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(18px) saturate(1.2);
    -webkit-backdrop-filter: blur(18px) saturate(1.2);
`;

const FormShell = styled.div`
    label {
        display: block;
        margin-bottom: 0.4rem;
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.11em;
        text-transform: uppercase;
        color: #a1a1aa !important;
    }

    input:not([type='checkbox']):not([type='radio']) {
        background: #060709 !important;
        border: 1px solid rgba(63, 63, 70, 0.85) !important;
        border-radius: 9px !important;
        color: #f4f4f5 !important;
        padding: 0.7rem 0.85rem !important;
        font-size: 0.875rem !important;
        line-height: 1.4 !important;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.55) !important;
        transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
    }

    input::placeholder {
        color: #71717a;
    }

    input:not(:disabled):not(:read-only):hover {
        border-color: rgba(82, 82, 91, 0.95) !important;
    }

    input:not(:disabled):not(:read-only):focus {
        border-color: rgba(59, 130, 246, 0.55) !important;
        outline: none !important;
        box-shadow:
            inset 0 1px 2px rgba(0, 0, 0, 0.5),
            0 0 0 2px rgba(37, 99, 235, 0.28),
            0 0 24px rgba(37, 99, 235, 0.12) !important;
    }

    input:disabled,
    input:read-only {
        opacity: 0.72;
        cursor: not-allowed;
    }

    .input-help {
        margin-top: 0.35rem;
        font-size: 0.75rem;
        line-height: 1.35;
        color: #71717a;
    }

    .input-help.error {
        color: #fca5a5;
    }

    button[type='submit'] {
        width: 100%;
        margin-top: 0.15rem;
        padding: 0.72rem 1rem !important;
        border-radius: 9px !important;
        border: 1px solid rgba(96, 165, 250, 0.35) !important;
        background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 55%, #1e40af 100%) !important;
        color: #ffffff !important;
        font-size: 0.8125rem !important;
        font-weight: 650 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.12) inset,
            0 10px 28px rgba(37, 99, 235, 0.28) !important;
        transition:
            background 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease,
            opacity 0.15s ease !important;
    }

    button[type='submit']:hover:not(:disabled) {
        border-color: rgba(147, 197, 253, 0.45) !important;
        background: linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%) !important;
        box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.14) inset,
            0 12px 32px rgba(59, 130, 246, 0.35) !important;
    }

    button[type='submit']:active:not(:disabled) {
        background: linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%) !important;
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08) inset !important;
    }

    button[type='submit']:disabled {
        opacity: 0.55 !important;
        cursor: not-allowed !important;
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, size = 'default', ...props }, ref) => {
    const { css: formCss, ...formRest } = props as Props & { css?: object };
    const formLayoutCss = formCss ? [tw`w-full flex flex-col items-center`, formCss] : tw`w-full flex flex-col items-center`;

    return (
        <Container>
            <div css={tw`w-full flex flex-col items-center text-center mb-5 px-1`}>
                {title && (
                    <h2 css={tw`text-xl sm:text-2xl text-neutral-100 font-semibold tracking-tight`}>{title}</h2>
                )}
                {subtitle && (
                    <p css={tw`mt-2 text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto`}>{subtitle}</p>
                )}
            </div>
            <FlashMessageRender css={tw`mb-4 w-full max-w-2xl mx-auto`} />
            <Form {...formRest} ref={ref} css={formLayoutCss}>
                <Card $wide={size === 'wide'}>
                    <FormShell css={tw`relative`}>{props.children}</FormShell>
                </Card>
            </Form>
            <p css={tw`text-center text-neutral-600 text-2xs mt-6 tracking-wide w-full`}>
                &copy; {new Date().getFullYear()} IdanDev Panel
            </p>
        </Container>
    );
});
