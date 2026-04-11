import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import loginCheckpoint from '@/api/auth/loginCheckpoint';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { ActionCreator } from 'easy-peasy';
import { StaticContext } from 'react-router';
import { useFormikContext, withFormik } from 'formik';
import useFlash from '@/plugins/useFlash';
import { FlashStore } from '@/state/flashes';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

interface Values {
    code: string;
    recoveryCode: '';
}

type OwnProps = RouteComponentProps<Record<string, string | undefined>, StaticContext, { token?: string }>;

type Props = OwnProps & {
    clearAndAddHttpError: ActionCreator<FlashStore['clearAndAddHttpError']['payload']>;
};

const LoginCheckpointContainer = () => {
    const { isSubmitting, setFieldValue } = useFormikContext<Values>();
    const [isMissingDevice, setIsMissingDevice] = useState(false);

    return (
        <LoginFormContainer
            title={'אימות דו-שלבי'}
            subtitle={'הזן את קוד האימות כדי להמשיך לחשבון שלך.'}
            size={'default'}
        >
            <div css={tw`mt-1`}>
                <Field
                    light
                    name={isMissingDevice ? 'recoveryCode' : 'code'}
                    label={isMissingDevice ? 'קוד שחזור' : 'קוד אימות'}
                    description={
                        isMissingDevice
                            ? 'הזן אחד מקודי הגיבוי שנוצרו בעת הפעלת האימות הדו-שלבי בחשבון זה.'
                            : 'הזן את הקוד בן שש הספרות מהאפליקציה שלך לאימות דו-שלבי.'
                    }
                    type={'text'}
                    autoComplete={'one-time-code'}
                    autoFocus
                />
            </div>
            <div css={tw`mt-5`}>
                <Button size={'xlarge'} type={'submit'} disabled={isSubmitting} isLoading={isSubmitting}>
                    אימות והמשך
                </Button>
            </div>
            <div css={tw`mt-4 text-center`}>
                <span
                    onClick={() => {
                        setFieldValue('code', '');
                        setFieldValue('recoveryCode', '');
                        setIsMissingDevice((s) => !s);
                    }}
                    css={tw`cursor-pointer text-xs text-neutral-400 no-underline hover:text-primary-300`}
                >
                    {!isMissingDevice ? 'איבדתי את המכשיר' : 'יש לי את המכשיר'}
                </span>
            </div>
            <div css={tw`mt-4 text-center`}>
                <Link to={'/auth/login'} css={tw`text-xs text-neutral-400 no-underline hover:text-primary-300`}>
                    חזרה להתחברות
                </Link>
            </div>
        </LoginFormContainer>
    );
};

const EnhancedForm = withFormik<Props, Values>({
    handleSubmit: ({ code, recoveryCode }, { setSubmitting, props: { clearAndAddHttpError, location } }) => {
        loginCheckpoint(location.state?.token || '', code, recoveryCode)
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
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    },

    mapPropsToValues: () => ({
        code: '',
        recoveryCode: '',
    }),
})(LoginCheckpointContainer);

export default ({ history, location, ...props }: OwnProps) => {
    const { clearAndAddHttpError } = useFlash();

    if (!location.state?.token) {
        history.replace('/auth/login');

        return null;
    }

    return (
        <EnhancedForm clearAndAddHttpError={clearAndAddHttpError} history={history} location={location} {...props} />
    );
};
