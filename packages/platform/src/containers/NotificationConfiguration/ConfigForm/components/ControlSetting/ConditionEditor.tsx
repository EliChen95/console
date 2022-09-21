import React, { ReactNode } from 'react';
import { Button } from '@kubed/components';

import type { Condition } from './types';
import ConditionSelect from './ConditionSelect';

import { ConditionEditorWrapper, ConditionsFooter } from './styles';

type Props = {
  conditions: Condition[];
  desc?: ReactNode;
  addText?: string;
  className?: string;
};

function ConditionEditor({ desc, addText, className, conditions }: Props): JSX.Element {
  function handleAdd(): void {
    // todo: add condition
    console.log('add condition');
  }

  function handleDelete(): void {
    // todo: delete condition
    console.log('delete condition');
  }

  return (
    <ConditionEditorWrapper className={className}>
      {conditions.map((item, index) => {
        return <ConditionSelect item={item} handleDelete={handleDelete} key={index} />;
      })}
      <ConditionsFooter>
        {desc}
        <Button onClick={handleAdd}>{addText}</Button>
      </ConditionsFooter>
    </ConditionEditorWrapper>
  );
}

export default ConditionEditor;
