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
        <div className={'relative min-h-screen flex items-center py-3 md:py-5 bg-neutral-900 overflow-hidden'}>
            <div className={'absolute inset-0 pointer-events-none'}>
                <div className={'absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900 to-gray-900'} />
                <div className={'absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-500 opacity-10 blur-3xl'} />
                <div className={'absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyan-500 opacity-10 blur-3xl'} />
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
