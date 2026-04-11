import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, FormikHelpers } from 'formik';
import { object, ref, string } from 'yup';
import { useStoreState } from 'easy-peasy';
import tw from 'twin.macro';
import Reaptcha from 'reaptcha';
import register from '@/api/auth/register';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import Field from '@/components/elements/Field';
import Button from '@/components/elements/Button';
import useFlash from '@/plugins/useFlash';
import AuthRecaptchaPortal from '@/components/auth/AuthRecaptchaPortal';

interface Values {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    passwordConfirmation: string;
}

export default () => {
    const refInstance = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            refInstance.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        register({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                setSubmitting(false);
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (refInstance.current) refInstance.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                password: '',
                passwordConfirmation: '',
            }}
            validationSchema={object().shape({
                username: string()
                    .required('נדרש שם משתמש.')
                    .min(1, 'נדרש שם משתמש.')
                    .max(191, 'שם המשתמש לא יעלה על 191 תווים.'),
                email: string()
                    .email('יש להזין כתובת אימייל תקינה.')
                    .required('יש להזין כתובת אימייל תקינה.'),
                first_name: string().required('נא להזין שם פרטי.').max(191, 'שם פרטי ארוך מדי.'),
                last_name: string().required('נא להזין שם משפחה.').max(191, 'שם משפחה ארוך מדי.'),
                password: string()
                    .required('נא לבחור סיסמה.')
                    .min(8, 'הסיסמה חייבת לכלול לפחות 8 תווים.'),
                passwordConfirmation: string()
                    .required('נא לאמת את הסיסמה.')
                    // @ts-expect-error this is valid
                    .oneOf([ref('password'), null], 'הסיסמאות אינן תואמות.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer
                    title={'יצירת חשבון חדש'}
                    subtitle={'פתח חשבון חדש כדי לגשת לפאנל הניהול שלך.'}
                    size={'wide'}
                >
                    <div css={tw`grid md:grid-cols-2 gap-2 md:gap-3`}>
                        <Field light type={'text'} label={'שם משתמש'} name={'username'} disabled={isSubmitting} />
                        <Field light type={'email'} label={'אימייל'} name={'email'} disabled={isSubmitting} />
                    </div>
                    <div css={tw`mt-2 md:mt-3 grid md:grid-cols-2 gap-2 md:gap-3`}>
                        <Field light type={'text'} label={'שם פרטי'} name={'first_name'} disabled={isSubmitting} />
                        <Field light type={'text'} label={'שם משפחה'} name={'last_name'} disabled={isSubmitting} />
                    </div>
                    <div css={tw`mt-2 md:mt-3 grid md:grid-cols-2 gap-2 md:gap-3`}>
                        <Field light type={'password'} label={'סיסמה'} name={'password'} disabled={isSubmitting} />
                        <Field
                            light
                            type={'password'}
                            label={'אימות סיסמה'}
                            name={'passwordConfirmation'}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div css={tw`mt-2 md:mt-3`}>
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                            יצירת חשבון
                        </Button>
                    </div>
                    {recaptchaEnabled && (
                        <AuthRecaptchaPortal>
                            <Reaptcha
                                ref={refInstance}
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
                    <div css={tw`mt-3 text-center`}>
                        <Link to={'/auth/login'} css={tw`text-xs text-neutral-400 no-underline hover:text-primary-300`}>
                            כבר יש לך חשבון?
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};
