import React, { useState } from 'react';
import { trim } from 'lodash';
import { Button, Input } from '@kubed/components';

import { CssContainer } from './styles';

type Props = {
  title?: string;
  className?: string;
  defaultSelectValue?: string;
  onAdd?: (item: string) => any;
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

  function handleKeyUp(e: React.KeyboardEvent): void {
    if (e.key === 'Enter') handleAdd();
  }

  function handleInputChange({ target }: React.ChangeEvent<HTMLInputElement>): void {
    if (target.value) {
      setInputValue(target.value);
      onChange?.(target.value);
    }
  }

  return (
    <CssContainer className={className}>
      {title && <p className="title">{title}</p>}
      <div className="inputWrapper">
        <Input value={inputValue} onKeyUp={handleKeyUp} onChange={handleInputChange} />
        <Button className="ml-12" onClick={handleAdd}>
          {t('ADD')}
        </Button>
      </div>
    </CssContainer>
  );
}

export default BoxInput;
