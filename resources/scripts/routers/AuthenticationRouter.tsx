import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import LoginContainer from '@/components/auth/LoginContainer';
import RegisterContainer from '@/components/auth/RegisterContainer';
import ForgotPasswordContainer from '@/components/auth/ForgotPasswordContainer';
import ResetPasswordContainer from '@/components/auth/ResetPasswordContainer';
import LoginCheckpointContainer from '@/components/auth/LoginCheckpointContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import { useHistory, useLocation } from 'react-router';

export default () => {
    const history = useHistory();
    const location = useLocation();
    const { path } = useRouteMatch();

    return (
        <div className={'relative min-h-screen flex items-center py-3 md:py-5 bg-[#0a0b0f] overflow-hidden'}>
            <div className={'absolute inset-0 pointer-events-none'}>
                <div className={'absolute inset-0 bg-gradient-to-b from-[#0a0b0f] via-[#0c0d12] to-neutral-950'} />
                <div className={'absolute -top-24 -left-24 w-80 h-80 rounded-full bg-orange-600/20 blur-3xl'} />
                <div className={'absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-red-600/10 blur-3xl'} />
                <div className={'absolute -bottom-28 left-1/4 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl'} />
            </div>
            <Switch location={location}>
                <Route path={`${path}/login`} component={LoginContainer} exact />
                <Route path={`${path}/register`} component={RegisterContainer} exact />
                <Route path={`${path}/login/checkpoint`} component={LoginCheckpointContainer} />
                <Route path={`${path}/password`} component={ForgotPasswordContainer} exact />
                <Route path={`${path}/password/reset/:token`} component={ResetPasswordContainer} />
                <Route path={`${path}/checkpoint`} />
                <Route path={'*'}>
                    <NotFound onBack={() => history.push('/auth/login')} />
                </Route>
            </Switch>
        </div>
    );
};
