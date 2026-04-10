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
    ${tw`w-full mx-auto px-4`};

    ${breakpoint('md')`
        ${tw`px-6`}
    `};
`;

const Card = styled.div<{ size: 'default' | 'wide' }>`
    ${(props) => (props.size === 'wide' ? tw`max-w-2xl` : tw`max-w-lg`)};
    ${tw`w-full mx-auto relative overflow-hidden rounded-2xl border shadow-2xl p-4 md:p-5 bg-neutral-900`};
    border-color: rgba(96, 165, 250, 0.25);
    box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.45),
        0 0 0 1px rgba(59, 130, 246, 0.08);
    backdrop-filter: blur(10px);
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
        background: #0b1220 !important;
        border-color: #334155 !important;
        color: #f9fafb !important;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.45);
    }

    input::placeholder {
        color: #9ca3af;
    }

    input:not(:disabled):not(:read-only):focus {
        border-color: #38bdf8 !important;
        box-shadow:
            0 0 0 2px rgba(56, 189, 248, 0.32),
            0 8px 20px rgba(37, 99, 235, 0.2),
            inset 0 1px 1px rgba(0, 0, 0, 0.2) !important;
    }

    .input-help {
        color: #9ca3af;
    }

    button[type='submit'] {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
        border-color: #60a5fa !important;
        color: #ffffff !important;
        font-weight: 700;
        letter-spacing: 0.04em;
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
    }

    button[type='submit']:hover:not(:disabled) {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
        border-color: #7dd3fc !important;
        box-shadow: 0 12px 28px rgba(59, 130, 246, 0.42);
    }

    button[type='submit']:active:not(:disabled) {
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
        border-color: #3b82f6 !important;
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ title, subtitle, size = 'default', ...props }, ref) => (
    <Container>
        <div css={tw`text-center mb-4 px-2`}>
            <p css={tw`inline-flex items-center rounded-full px-3 py-1 text-xs tracking-wider uppercase text-blue-100 bg-blue-500/10 border border-blue-400/30`}>
                IdanDev Panel Access
            </p>
            {title && <h2 css={tw`mt-3 text-2xl md:text-3xl text-neutral-100 font-bold`}>{title}</h2>}
            {subtitle && <p css={tw`mt-2 text-sm text-neutral-300 max-w-xl mx-auto`}>{subtitle}</p>}
        </div>
        <FlashMessageRender css={tw`mb-3 max-w-3xl mx-auto px-1`} />
        <Form {...props} ref={ref}>
            <Card size={size}>
                <div css={tw`absolute inset-0 pointer-events-none`}>
                    <div css={tw`absolute -top-16 -left-12 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl`} />
                    <div css={tw`absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl`} />
                </div>
                <FormShell css={tw`relative`}>{props.children}</FormShell>
            </Card>
        </Form>
        <p css={tw`text-center text-neutral-500 text-xs mt-5`}>
            &copy; {new Date().getFullYear()} IdanDev Panel
        </p>
    </Container>
));
