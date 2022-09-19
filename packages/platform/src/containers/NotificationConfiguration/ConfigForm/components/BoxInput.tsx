import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { trim } from 'lodash';
import { Button, Input } from '@kubed/components';

import { BoxInputWrapper, InputWrapper } from './styles';

type Props = {
  title?: string;
  className?: string;
  defaultSelectValue?: string;
  onAdd?: (item: string) => void;
  onChange?: (value: string) => void;
  validate?: (value: string) => void;
  onSelectChange?: (key: string) => void;
};

function BoxInput({ title, className, validate, onAdd, onChange }: Props): JSX.Element {
  const [inputValue, setInputValue] = useState<string>();

  function handleAdd(): void {
    if (validate?.(trim(inputValue))) {
      onAdd?.(trim(inputValue));
    }
  }

  function handleKeyUp(e: KeyboardEvent): void {
    if (e.key === 'Enter') handleAdd();
  }

  function handleInputChange({ target }: ChangeEvent<HTMLInputElement>): void {
    if (target.value) {
      setInputValue(target.value);
      onChange?.(target.value);
    }
  }

  return (
    <BoxInputWrapper className={className}>
      {title && <p className="title">{title}</p>}
      <InputWrapper>
        <Input value={inputValue} onKeyUp={handleKeyUp} onChange={handleInputChange} />
        <Button className="ml12" onClick={handleAdd}>
          {t('ADD')}
        </Button>
      </InputWrapper>
    </BoxInputWrapper>
  );
}

export default BoxInput;
