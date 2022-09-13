/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useRef, useState } from 'react';
import { Tag } from '@kubed/components';
import { Icon } from '@ks-console/shared';

import Autosuggest from './autosuggest';

import { CssContainer } from './styles';

type Props = {
  name: string;
  value: any;
  placeholder: string;
  onChange?: (val: any) => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>, value: any) => void;
};

function TagInput({ placeholder, onInputChange, onChange }: Props): JSX.Element {
  const ref = useRef<any>();
  const [tags, setTags] = useState<any>();

  // function getDerivedStateFromProps(nextProps: any, prevState: any): any {
  //   if (prevState.tags !== nextProps.value) {
  //     return { tags: nextProps.value };
  //   }
  //   return null;
  // }

  function handleClick(): void {
    ref.current.focus();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, value: any) {
    onInputChange?.(event, value);
  }

  function handleAdd(value: any): void {
    const newTags = [...tags, value];

    setTags(newTags);
    onChange?.(newTags);
  }

  // function handleDelete(): void {
  //   if (tags.length <= 0) return;
  //   const newTags = tags.filter((n: any, index: number) => index !== tags.length - 1);
  //   setTags(newTags);
  //   onChange?.(newTags);
  // }

  // function handleCloseTag({ value, index }: any) {
  //   const newTags = tags.filter((item: any, i: number) => item !== value && i !== index);
  //   setTags(newTags);
  //   onChange?.(newTags);
  // }

  function renderTags() {
    return (
      <React.Fragment>
        {tags.map((item: any, index: number) => (
          <Tag key={`${item}-${index + 1}`}>
            {item}
            <Icon
              name="close"
              // color={{ primary: 'rgb(255,255,255)' }}
              size={16}
              // clickable
              // onClick={() => handleCloseTag({ item, index })}
            ></Icon>
          </Tag>
        ))}
      </React.Fragment>
    );
  }

  return (
    <CssContainer>
      <div className="input filter-input" onClick={handleClick}>
        {renderTags()}
        <Autosuggest
          ref={ref}
          placeholder={placeholder}
          onChange={handleInputChange}
          onAdd={handleAdd}
          // onDelte={handleDelete}
        />
      </div>
    </CssContainer>
  );
}

export default TagInput;
