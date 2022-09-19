import React, { useState } from 'react';
import { Icon } from '@ks-console/shared';
import { Button, Input, Select } from '@kubed/components';

// import TagInput from '../TagInput';
import type { Condition } from './ConditionEditor';

import { ErrorText, ConditionWrapper, SelectWrapper } from './styles';

type Props = {
  item: Condition;
  handleDelete: () => void;
};

function ConditionSelect({ item, handleDelete }: Props): JSX.Element {
  const [keyErrorTip] = useState('');

  function handleKeyChange(): void {}

  // function handleValueChange(): void {}

  function handleOperatorChange(): void {}

  function renderValues() {
    const { operator, key, values } = item;

    if (operator === 'Exists' || operator === 'DoesNotExist') {
      return null;
    }

    if (key === 'severity') {
      return (
        <Select
          name="values"
          value={values}
          // options={this.severities}
          multi
          // onChange={this.handleValueChange}
          placeholder={t('VALUES')}
        />
      );
    }

    return (
      // <TagInput
      //   name="values"
      //   placeholder={t('VALUES')}
      //   value={values}
      //   onChange={handleValueChange}
      // />
      <Input />
    );
  }

  return (
    <>
      <ConditionWrapper>
        <SelectWrapper>
          <Select
            name="key"
            // value={key}
            // options={[]}
            placeholder={t('LABEL')}
            onChange={handleKeyChange}
          />
          <Select
            name="operator"
            // value={operator}
            // options={operators}
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
