import React, { forwardRef, useRef, useState } from 'react';
import { notify, Input } from '@kubed/components';

import { PATTERN_TAG } from '../../../../../constants';

type Props = {
  placeholder?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  onAdd?: (val: any) => void;
  onDelete?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, val: any) => void;
};

function Autosuggest({ placeholder, onChange, onAdd, onDelete, style }: Props, ref: any) {
  const [value, setValue] = useState<any>();
  const inputBoxRef = useRef<any>();

  // function focus(): void {
  //   inputBoxRef.current.focus();
  // }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.value);
    onChange?.(event, value);
  }

  function handlePressEnter(event: React.KeyboardEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (event.key === 'Enter') {
      if (value.trim() !== '') {
        if (!PATTERN_TAG.test(value) || value.length > 63) {
          notify.error(t({ content: t('PATTERN_TAG_VALUE_INVALID_TIP') }));
          return;
        }
        onAdd?.(value);
        setValue('');
      }
    } else if (event.key === 'Backspace') {
      onDelete?.();
    }
  }

  return (
    <div style={style} className="autosuggest" ref={inputBoxRef}>
      <Input
        type="text"
        className="autosuggestInput"
        ref={inputBoxRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        onKeyDown={handlePressEnter}
      />
    </div>
  );
}

export default forwardRef(Autosuggest);
