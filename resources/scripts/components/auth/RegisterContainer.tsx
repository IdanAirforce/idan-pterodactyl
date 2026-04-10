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
                    .required('A username is required.')
                    .min(1, 'A username is required.')
                    .max(191, 'Username may not be greater than 191 characters.'),
                email: string().email('A valid email address must be provided.').required('A valid email address must be provided.'),
                first_name: string().required('Please enter your first name.').max(191),
                last_name: string().required('Please enter your last name.').max(191),
                password: string().required('Please choose a password.').min(8, 'Your password should be at least 8 characters in length.'),
                passwordConfirmation: string()
                    .required('Please confirm your password.')
                    // @ts-expect-error this is valid
                    .oneOf([ref('password'), null], 'Password confirmation does not match.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer
                    title={'Create Your Panel Account'}
                    subtitle={'Join your hosting control panel with secure account access.'}
                    css={tw`w-full flex`}
                >
                    <div css={tw`grid md:grid-cols-2 gap-3`}>
                        <Field light type={'text'} label={'Username'} name={'username'} disabled={isSubmitting} />
                        <Field light type={'email'} label={'Email'} name={'email'} disabled={isSubmitting} />
                    </div>
                    <div css={tw`mt-3 grid md:grid-cols-2 gap-3`}>
                        <Field light type={'text'} label={'First name'} name={'first_name'} disabled={isSubmitting} />
                        <Field light type={'text'} label={'Last name'} name={'last_name'} disabled={isSubmitting} />
                    </div>
                    <div css={tw`mt-3 grid md:grid-cols-2 gap-3`}>
                        <Field light type={'password'} label={'Password'} name={'password'} disabled={isSubmitting} />
                        <Field
                            light
                            type={'password'}
                            label={'Confirm password'}
                            name={'passwordConfirmation'}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div css={tw`mt-3`}>
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                            Register
                        </Button>
                    </div>
                    {recaptchaEnabled && (
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
                    )}
                    <div css={tw`mt-4 text-center`}>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-xs text-neutral-400 tracking-[0.18em] no-underline uppercase hover:text-primary-300`}
                        >
                            Already have an account?
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};
