import React, { useState } from 'react';
import { merge } from 'lodash';
import {
  Modal,
  FormItem,
  Input,
  Select,
  InputPassword,
  Dropdown,
  useForm,
  useWatch,
} from '@kubed/components';
import type { FormItemProps } from '@kubed/components';
import { Human } from '@kubed/icons';
import { isSystemRole, Pattern, PasswordTip } from '@ks-console/shared';

import type { UserFormValues, UserActionValues } from '../../../types/user';
import { useRoles } from '../../../stores/role';
import { StyledForm, Option, OptionName, OptionDescription } from './styles';

type Rules = FormItemProps['rules'];

interface FormFieldProps {
  'metadata.name': {
    disabled?: boolean;
    rules: Rules;
  };
  'spec.email': {
    rules: Rules;
  };
  'spec.password'?: {
    isExclude?: boolean;
  };
}

export interface UserBaseModalProps {
  visible: boolean;
  title: string;
  formFieldProps: FormFieldProps;
  confirmLoading: boolean;
  detail?: Record<string, any>;
  onOk: (formValues: UserActionValues) => void;
  onCancel: () => void;
}

export default function UserBaseModal({
  visible,
  title,
  formFieldProps,
  confirmLoading,
  detail,
  onOk,
  onCancel,
}: UserBaseModalProps) {
  const initialValues = detail?._originData ?? {};
  const [form] = useForm<UserFormValues>();
  const password = useWatch(['spec', 'password'], form) ?? '';
  const [tipVisible, setTipVisible] = useState(false);
  const { formattedRoles } = useRoles({
    params: { limit: -1, sortBy: 'createTime' },
  });
  const roleOptions = formattedRoles
    .filter(item => !isSystemRole(item.name))
    .map(item => ({
      label: (
        <Option>
          <OptionName>{item.name}</OptionName>
          <OptionDescription>{item.description}</OptionDescription>
        </Option>
      ),
      value: item.name,
      item,
    }));

  return (
    <Modal
      visible={visible}
      titleIcon={<Human size={20} />}
      title={title}
      width={691}
      confirmLoading={confirmLoading}
      onOk={form.submit}
      onCancel={onCancel}
    >
      <StyledForm
        form={form}
        initialValues={initialValues}
        onFinish={(formValues: UserFormValues) => {
          const params = merge(
            {
              apiVersion: 'iam.kubesphere.io/v1alpha2',
              kind: 'User',
            } as const,
            formValues,
          );
          onOk(params);
        }}
      >
        <FormItem
          name={['metadata', 'name']}
          label={t('USERNAME')}
          help={t('USERNAME_DESC')}
          rules={formFieldProps['metadata.name'].rules}
        >
          <Input
            autoComplete="off"
            autoFocus={true}
            maxLength={32}
            disabled={formFieldProps['metadata.name'].disabled}
          />
        </FormItem>
        <FormItem
          name={['spec', 'email']}
          label={t('EMAIL')}
          help={t('EMAIL_DESC')}
          rules={formFieldProps['spec.email'].rules}
        >
          <Input placeholder="user@example.com" autoComplete="off" />
        </FormItem>
        <FormItem
          name={['metadata', 'annotations', 'iam.kubesphere.io/globalrole']}
          label={t('PLATFORM_ROLE')}
          help={t('PLATFORM_ROLE_DESC')}
        >
          <Select options={roleOptions} optionLabelProp="value" />
        </FormItem>
        {!formFieldProps?.['spec.password']?.isExclude && (
          <Dropdown
            visible={tipVisible}
            maxWidth={350}
            className="password-tip-dropdown"
            interactive={false}
            content={<PasswordTip password={password} hasProgress />}
          >
            <div>
              <FormItem
                name={['spec', 'password']}
                label={t('PASSWORD')}
                help={t('PASSWORD_DESC')}
                rules={[
                  {
                    required: true,
                    message: t('PASSWORD_EMPTY_DESC'),
                  },
                  {
                    pattern: Pattern.PATTERN_PASSWORD,
                    message: t('PASSWORD_INVALID_DESC'),
                  },
                ]}
              >
                <InputPassword
                  autoComplete="off"
                  onFocus={() => {
                    setTipVisible(true);
                  }}
                  onBlur={() => {
                    setTipVisible(false);
                  }}
                />
              </FormItem>
            </div>
          </Dropdown>
        )}
        <FormItem
          name={['metadata', 'annotations', 'kubesphere.io/description']}
          label={t('DESCRIPTION')}
          help={t('DESCRIPTION_DESC')}
        >
          {/*TODO: textarea*/}
          <textarea maxLength={256} rows={3} />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}
