import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders children fixed to the viewport bottom-right, outside the auth card.
 * reCAPTCHA (including invisible) stays mounted with the same ref/callbacks as before.
 */
export default function AuthRecaptchaPortal({ children }: { children: React.ReactNode }) {
    const [target, setTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setTarget(document.body);
    }, []);

    if (!target) {
        return null;
    }

    return createPortal(
        <div
            className={
                'fixed z-[200] bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-auto max-w-[calc(100vw-2rem)]'
            }
        >
            {children}
        </div>,
        target
    );
}
