import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import performPasswordReset from '@/api/auth/performPasswordReset';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Formik, FormikHelpers } from 'formik';
import { object, ref, string } from 'yup';
import Field from '@/components/elements/Field';
import Input from '@/components/elements/Input';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

interface Values {
    password: string;
    passwordConfirmation: string;
}

export default ({ match, location }: RouteComponentProps<{ token: string }>) => {
    const [email, setEmail] = useState('');

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const parsed = new URLSearchParams(location.search);
    if (email.length === 0 && parsed.get('email')) {
        setEmail(parsed.get('email') || '');
    }

    const submit = ({ password, passwordConfirmation }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();
        performPasswordReset(email, { token: match.params.token, password, passwordConfirmation })
            .then(() => {
                // @ts-expect-error this is valid
                window.location = '/';
            })
            .catch((error) => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'error', title: 'שגיאה', message: httpErrorToHuman(error) });
            });
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                password: '',
                passwordConfirmation: '',
            }}
            validationSchema={object().shape({
                password: string()
                    .required('נדרשת סיסמה חדשה.')
                    .min(8, 'הסיסמה החדשה חייבת לכלול לפחות 8 תווים.'),
                passwordConfirmation: string()
                    .required('נא לאמת את הסיסמה החדשה.')
                    // @ts-expect-error this is valid
                    .oneOf([ref('password'), null], 'הסיסמאות אינן תואמות.'),
            })}
        >
            {({ isSubmitting }) => (
                <LoginFormContainer
                    title={'הגדרת סיסמה חדשה'}
                    subtitle={'הזן סיסמה חדשה לחשבון שלך.'}
                    size={'default'}
                >
                    <div>
                        <label>אימייל</label>
                        <Input value={email} isLight disabled />
                    </div>
                    <div css={tw`mt-3`}>
                        <Field
                            light
                            label={'סיסמה חדשה'}
                            name={'password'}
                            type={'password'}
                            description={'הסיסמה חייבת לכלול לפחות 8 תווים.'}
                        />
                    </div>
                    <div css={tw`mt-3`}>
                        <Field light label={'אימות סיסמה חדשה'} name={'passwordConfirmation'} type={'password'} />
                    </div>
                    <div css={tw`mt-5`}>
                        <Button size={'xlarge'} type={'submit'} disabled={isSubmitting} isLoading={isSubmitting}>
                            שמירת סיסמה חדשה
                        </Button>
                    </div>
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
