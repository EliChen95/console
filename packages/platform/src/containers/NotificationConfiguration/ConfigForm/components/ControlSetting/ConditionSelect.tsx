import React, { useState } from 'react';
import { Icon } from '@ks-console/shared';
import { Button, Input, Select } from '@kubed/components';

import { SEVERITY_LEVEL } from './constants';
import type { Condition, SeverityLevel } from './types';

import { ErrorText, ConditionWrapper, SelectWrapper } from './styles';

type Props = {
  item: Condition;
  handleDelete: () => void;
};

function ConditionSelect({ item, handleDelete }: Props): JSX.Element {
  const { operator, key, values } = item;
  const keys = [
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
  const severities = SEVERITY_LEVEL.map((level: SeverityLevel) => ({
    label: t(level.label),
    value: level.value,
    level: level,
  }));
  const [keyErrorTip] = useState('');

  function handleKeyChange(): void {}

  function handleValueChange(): void {}

  function handleOperatorChange(): void {}

  function renderValues() {
    if (operator === 'Exists' || operator === 'DoesNotExist') {
      return null;
    }

    if (key === 'severity') {
      return (
        <Select
          multi
          name="values"
          value={values}
          placeholder={t('VALUES')}
          options={severities}
          onChange={handleValueChange}
        />
      );
    }

    // todo use TagInput component
    return (
      <Input name="values" placeholder={t('VALUES')} value={values} onChange={handleValueChange} />
    );
  }

  return (
    <>
      <ConditionWrapper>
        <SelectWrapper>
          <Select
            name="key"
            value={key}
            options={keys}
            placeholder={t('LABEL')}
            onChange={handleKeyChange}
          />
          <Select
            name="operator"
            value={operator}
            options={operators}
            onChange={handleOperatorChange}
            placeholder={t('CONDITION_OPERATOR')}
          />
          {renderValues()}
        </SelectWrapper>
        <Button className="delete" onClick={handleDelete}>
          <Icon name="trash" />
        </Button>
      </ConditionWrapper>
      {keyErrorTip !== '' && <ErrorText>{keyErrorTip}</ErrorText>}
    </>
  );
}

export default ConditionSelect;
