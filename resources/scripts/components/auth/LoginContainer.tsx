import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import AuthRecaptchaPortal from '@/components/auth/AuthRecaptchaPortal';

interface Values {
    username: string;
    password: string;
}

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('נא להזין שם משתמש או אימייל.'),
                password: string().required('נא להזין את סיסמת החשבון.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer
                    title={'ברוך הבא'}
                    subtitle={'התחבר כדי לנהל את השרתים, ההקצאות והגדרות החשבון שלך.'}
                    size={'default'}
                >
                    <Field light type={'text'} label={'שם משתמש או אימייל'} name={'username'} disabled={isSubmitting} />
                    <div css={tw`mt-3`}>
                        <Field light type={'password'} label={'סיסמה'} name={'password'} disabled={isSubmitting} />
                    </div>
                    <div css={tw`mt-5`}>
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                            התחברות
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
                    <div
                        css={tw`mt-5 flex flex-row flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-1 text-center`}
                    >
                        <Link
                            to={'/auth/register'}
                            css={tw`text-xs text-neutral-400 no-underline hover:text-primary-300`}
                        >
                            צור חשבון
                        </Link>
                        <span css={tw`text-neutral-600 select-none`} aria-hidden>
                            |
                        </span>
                        <Link
                            to={'/auth/password'}
                            css={tw`text-xs text-neutral-400 no-underline hover:text-primary-300`}
                        >
                            שכחת סיסמה?
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default LoginContainer;
