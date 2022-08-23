import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { get } from 'lodash';
import { Button, Card, Form, FormItem, InputPassword, Alert } from '@kubed/components';
import { request, Pattern, PasswordTip } from '@ks-console/shared';

import {
  LoginHeader,
  LoginWrapper,
  WelcomeTitle,
  LoginDivider,
  LoginButton,
} from '../Login/styles';

const LoginConfirm = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const name = get(globals, 'user.username');

  const handleRequest = (data: Array<any>) => {
    return request.patch(`apis/iam.kubesphere.io/v1alpha2/users/${name}`, data, {
      headers: {
        'content-type': 'application/json-patch+json',
      },
    });
  };

  const resetPasswdMutation = useMutation(
    (data: any) => {
      return handleRequest([
        {
          op: 'remove',
          path: '/metadata/annotations/iam.kubesphere.io~1uninitialized',
        },
        {
          op: 'replace',
          path: '/spec/password',
          value: data.password,
        },
      ]);
    },
    {
      onSuccess: () => {
        navigate('/');
      },
    },
  );

  const skipMutation = useMutation(
    () => {
      return handleRequest([
        {
          op: 'remove',
          path: '/metadata/annotations/iam.kubesphere.io~1uninitialized',
        },
      ]);
    },
    {
      onSuccess: () => {
        navigate('/');
      },
    },
  );

  const handleFormChange = (data: any) => {
    setPassword(data.password);
  };

  return (
    <LoginWrapper>
      <LoginHeader href="/">
        <img src="/assets/logo.svg" alt="logo" />
      </LoginHeader>
      <Card className="login-box" contentClassName="login-card">
        <WelcomeTitle>{t('Please reset your password')}</WelcomeTitle>
        <LoginDivider />
        <Alert showIcon={false} className="mb12">
          {t('CHANGE_PASSWORD_TIP')}
        </Alert>
        <Form
          className="login-form"
          size="md"
          onValuesChange={handleFormChange}
          onFinish={resetPasswdMutation.mutate}
        >
          <FormItem
            label={t('PASSWORD')}
            name="password"
            className="username"
            rules={[
              { required: true, message: t('PASSWORD_EMPTY_DESC') },
              {
                pattern: Pattern.PATTERN_PASSWORD,
                message: t('PASSWORD_DESC'),
              },
            ]}
          >
            <InputPassword name="password" />
          </FormItem>
          <PasswordTip password={password} className="mt12" />
          <LoginButton>
            <Button
              color="secondary"
              block
              shadow
              radius="xl"
              className="mb12"
              loading={resetPasswdMutation.isLoading}
            >
              {t('Submit')}
            </Button>
            <Button
              variant="text"
              block
              radius="xl"
              as="div"
              // @ts-ignore
              onClick={skipMutation.mutate}
              loading={skipMutation.isLoading}
            >
              {t('Modify Later')}
            </Button>
          </LoginButton>
        </Form>
      </Card>
    </LoginWrapper>
  );
};

export default LoginConfirm;
