import React, { useState } from 'react';
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

import { useRoles } from '../../../stores/role';
import type { UserCreateParams } from '../../../stores/user';
import { StyledForm, Option, OptionName, OptionDescription } from './styles';

type Rules = FormItemProps['rules'];

interface FormFields {
  'metadata.name': {
    disabled?: boolean;
    rules: Rules;
  };
  'spec.email': {
    rules: Rules;
  };
}

export interface UserBaseModalProps {
  title: string;
  formFields: FormFields;
  confirmLoading: boolean;
  onOk: (formValues: UserCreateParams) => void;
}

export default function UserBaseModal({
  title,
  formFields,
  confirmLoading,
  onOk,
}: UserBaseModalProps) {
  const [form] = useForm();
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
      visible
      titleIcon={<Human size={20} />}
      title={title}
      width={691}
      confirmLoading={confirmLoading}
      onOk={form.submit}
    >
      <StyledForm
        form={form}
        initialValues={{
          metadata: {
            name: '123',
          },
        }}
        onFinish={(formValues: UserCreateParams) => {
          console.log(formValues);
          onOk(formValues);
        }}
      >
        <FormItem
          name={['metadata', 'name']}
          label={t('USERNAME')}
          help={t('USERNAME_DESC')}
          rules={formFields['metadata.name'].rules}
        >
          <Input
            autoComplete="off"
            autoFocus={true}
            maxLength={32}
            disabled={formFields['metadata.name'].disabled}
          />
        </FormItem>
        <FormItem
          name={['spec', 'email']}
          label={t('EMAIL')}
          help={t('EMAIL_DESC')}
          rules={formFields['spec.email'].rules}
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
                { required: true, message: t('PASSWORD_EMPTY_DESC') },
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
        <FormItem
          name={['metadata', 'annotations', 'kubesphere.io/description']}
          label={t('DESCRIPTION')}
          help={t('DESCRIPTION_DESC')}
        >
          <textarea placeholder="user@example.com" autoComplete="off" />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}
