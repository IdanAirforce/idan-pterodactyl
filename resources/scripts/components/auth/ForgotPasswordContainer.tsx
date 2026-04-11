import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import requestPasswordResetEmail from '@/api/auth/requestPasswordResetEmail';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import Field from '@/components/elements/Field';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import AuthRecaptchaPortal from '@/components/auth/AuthRecaptchaPortal';

interface Values {
    email: string;
}

export default () => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const handleSubmission = ({ email }: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'error', title: 'שגיאה', message: httpErrorToHuman(error) });
            });

            return;
        }

        requestPasswordResetEmail(email, token)
            .then((response) => {
                resetForm();
                addFlash({ type: 'success', title: 'הצלחה', message: response });
            })
            .catch((error) => {
                console.error(error);
                addFlash({ type: 'error', title: 'שגיאה', message: httpErrorToHuman(error) });
            })
            .then(() => {
                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
            });
    };

    return (
        <Formik
            onSubmit={handleSubmission}
            initialValues={{ email: '' }}
            validationSchema={object().shape({
                email: string()
                    .email('יש להזין כתובת אימייל תקינה.')
                    .required('יש להזין כתובת אימייל תקינה.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer
                    title={'איפוס גישה'}
                    subtitle={'הזן את כתובת האימייל שלך ונשלח לך הוראות לאיפוס הסיסמה.'}
                    size={'default'}
                >
                    <Field
                        light
                        label={'אימייל'}
                        description={
                            'הזן את כתובת האימייל של החשבון כדי לקבל הוראות לאיפוס הסיסמה.'
                        }
                        name={'email'}
                        type={'email'}
                    />
                    <div css={tw`mt-5`}>
                        <Button type={'submit'} size={'xlarge'} disabled={isSubmitting} isLoading={isSubmitting}>
                            שליחת אימייל
                        </Button>
                    </div>
                    {recaptchaEnabled && (
                        <AuthRecaptchaPortal>
                            <Reaptcha
                                ref={ref}
                                size={'invisible'}
                                sitekey={siteKey || '_invalid_key'}
                                onVerify={(response) => {
                                    setToken(response);
                                    submitForm();
                                }}
                                onExpire={() => {
                                    setSubmitting(false);
                                    setToken('');
                                }}
                            />
                        </AuthRecaptchaPortal>
                    )}
                    <div css={tw`mt-5 text-center`}>
                        <Link to={'/auth/login'} css={tw`text-xs text-neutral-400 no-underline hover:text-primary-300`}>
                            חזרה להתחברות
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};
