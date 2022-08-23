import React, { useState } from 'react';
import {
  Modal,
  FormItem,
  Input,
  Select,
  InputPassword,
  Dropdown,
  useForm,
} from '@kubed/components';
import type { FormItemProps } from '@kubed/components';
import { Human } from '@kubed/icons';
import { isSystemRole, Pattern, PasswordTip } from '@ks-console/shared';

import { useRoles } from '../../../stores/role';
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
}

export default function UserBaseModal({ title, formFields }: UserBaseModalProps) {
  const [form] = useForm();
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
    <Modal visible titleIcon={<Human size={20} />} title={title} width={691} onOk={form.submit}>
      <StyledForm
        form={form}
        onFinish={(values: any) => {
          console.log(values);
        }}
      >
        <FormItem
          name="metadata.name"
          label={t('USERNAME')}
          help={t('USERNAME_DESC')}
          rules={formFields['metadata.name'].rules}
        >
          <Input
            name="metadata.name"
            autoComplete="off"
            autoFocus={true}
            maxLength={32}
            disabled={formFields['metadata.name'].disabled}
          />
        </FormItem>
        <FormItem
          name="spec.email"
          label={t('EMAIL')}
          help={t('EMAIL_DESC')}
          rules={formFields['spec.email'].rules}
        >
          <Input name="spec.email" placeholder="user@example.com" autoComplete="off" />
        </FormItem>
        <FormItem
          name="metadata.annotations['iam.kubesphere.io/globalrole']"
          label={t('PLATFORM_ROLE')}
          help={t('PLATFORM_ROLE_DESC')}
        >
          <Select
            name="metadata.annotations['iam.kubesphere.io/globalrole']"
            options={roleOptions}
            optionLabelProp="value"
          />
        </FormItem>
        <Dropdown
          visible={tipVisible}
          maxWidth={350}
          className="password-tip-dropdown"
          interactive={false}
          content={<PasswordTip password={'123'} hasProgress />}
        >
          <div>
            <FormItem
              name="spec.password"
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
                name="spec.password"
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
          name="metadata.annotations['kubesphere.io/description']"
          label={t('DESCRIPTION')}
          help={t('DESCRIPTION_DESC')}
        >
          <textarea
            name="metadata.annotations['kubesphere.io/description']"
            placeholder="user@example.com"
            autoComplete="off"
          />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}
