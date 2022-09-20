import React, { ChangeEvent, useState } from 'react';
import { isEmpty } from 'lodash';
import { Icon } from '@ks-console/shared';
import { Button, Input, notify, Select } from '@kubed/components';

import type { Condition } from './types';
// todo ues the alias path
import type { LabelValue } from '../../../../../types';
import { PATTERN_TAG } from '../../../../../constants';

import {
  ErrorText,
  ConditionWrapper,
  SelectWrapper,
  OptionsContainer,
  OptionsListWrapper,
  CustomSelect,
  IconWrapper,
} from './styles';

type Props = {
  item: Condition;
  handleDelete: () => void;
};

type ConditionItem = Condition & {
  keyName?: string;
  keyItems?: LabelValue[];
};

function initConditionItem(keys: LabelValue[], item: Condition): ConditionItem {
  const { key, operator, values } = item;

  // todo consider key is empty string, which keyItems type it is ?
  return {
    key,
    operator,
    values,
    keyName: '',
    keyItems:
      key && isEmpty(keys.find((keyItem: any) => keyItem.value === key))
        ? [...keys, { label: key, value: key }]
        : [...keys],
  };
}

function ConditionSelect({ item, handleDelete }: Props): JSX.Element {
  const keys: LabelValue[] = [
    {
      label: t('ALERTING_NAME'),
      value: 'alertname',
    },
    {
      label: t('ALERTING_SEVERITY'),
      value: 'severity',
    },
    {
      label: t('PROJECT'),
      value: 'namespace',
    },
    {
      label: t('POD'),
      value: 'pod',
    },
    {
      label: t('CONTAINER'),
      value: 'container',
    },
  ];
  const operators = [
    {
      label: t('INCLUDES_VALUES'),
      value: 'In',
    },
    {
      label: t('DOES_NOT_INCLUDE_VALUES'),
      value: 'NotIn',
    },
    {
      label: t('EXISTS'),
      value: 'Exists',
    },
    {
      label: t('DOES_NOT_EXIST'),
      value: 'DoesNotExist',
    },
  ];
  const [conditionItem, setConditionItem] = useState<ConditionItem>(initConditionItem(keys, item));
  const [keyErrorTip] = useState('');

  function handleKeyChange(key: string): void {
    setConditionItem(prevConditionItem => {
      return { ...prevConditionItem, key };
    });
  }

  function handleValuesChange({ target }: ChangeEvent<HTMLInputElement>): void {
    setConditionItem(prevConditionItem => {
      return { ...prevConditionItem, values: [target.value] };
    });
  }

  function handleOperatorChange(operator: string): void {
    setConditionItem(prevConditionItem => {
      return { ...prevConditionItem, operator };
    });
  }

  function handleAddItem(): void {
    const { keyItems = [], keyName = '' } = conditionItem;

    if (!PATTERN_TAG.test(keyName)) {
      notify.error(t('PATTERN_TAG_INVALID_TIP'));
      return;
    }

    setConditionItem(prevConditionItem => {
      return {
        ...prevConditionItem,
        keyItems: [...keyItems, { label: keyName, value: keyName }],
        keyName: '',
      };
    });
  }

  function handleNameChange({ target }: ChangeEvent<HTMLInputElement>): void {
    setConditionItem(prevConditionItem => {
      return { ...prevConditionItem, keyName: target.value };
    });
  }

  function dropDownRender(options: any): JSX.Element {
    return (
      <OptionsContainer>
        <OptionsListWrapper>{options}</OptionsListWrapper>
        <CustomSelect>
          {/* to fix the value isn't change when keyName is empty string */}
          <Input value={conditionItem.keyName} onChange={handleNameChange} />
          <IconWrapper onClick={handleAddItem}>
            <Icon name="add" variant="light" size={12} />
          </IconWrapper>
        </CustomSelect>
      </OptionsContainer>
    );
  }

  function valuesRender() {
    const { key, operator, values } = conditionItem;
    if (operator === 'Exists' || operator === 'DoesNotExist') {
      return null;
    }

    if (key === 'severity') {
      // const severities = SEVERITY_LEVEL.map((level: SeverityLevel) => ({
      //   label: t(level.label),
      //   value: level.value,
      //   level: level,
      // }));
      //
      // return (
      //   <Select
      //     multi
      //     name="values"
      //     value={values}
      //     placeholder={t('VALUES')}
      //     options={severities}
      //     onChange={handleValuesChange}
      //   />
      // );
    }

    // todo use TagInput component
    return (
      <Input name="values" placeholder={t('VALUES')} value={values} onChange={handleValuesChange} />
    );
  }

  return (
    <>
      <ConditionWrapper>
        <SelectWrapper>
          <Select
            name="key"
            value={conditionItem.key}
            options={conditionItem.keyItems}
            placeholder={t('LABEL')}
            onChange={handleKeyChange}
            dropdownRender={dropDownRender}
          />
          <Select
            name="operator"
            value={conditionItem.operator}
            options={operators}
            onChange={handleOperatorChange}
            placeholder={t('CONDITION_OPERATOR')}
          />
          {valuesRender()}
        </SelectWrapper>
        <Button className="button-flat" onClick={handleDelete}>
          <Icon name="trash" />
        </Button>
      </ConditionWrapper>
      {keyErrorTip !== '' && <ErrorText>{keyErrorTip}</ErrorText>}
    </>
  );
}

export default ConditionSelect;
