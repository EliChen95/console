import React from 'react';
import { Button } from '@kubed/components';

import ConditionSelect from './ConditionSelect';

import { Wrapper, Footer } from './styles';

export type Condition = {
  key?: string;
  operator?: string;
  values?: string[];
};

type Props = {
  conditions?: Array<Condition>;
  desc?: React.ReactNode;
  addText?: string;
  className?: string;
};

function ArrayInput({ desc, addText, className, conditions }: Props): JSX.Element {
  function handleAdd(): void {
    // todo: add condition
    console.log('add condition');
  }

  function handleDelete(): void {
    // todo: delete condition
    console.log('delete condition');
  }

  return (
    <Wrapper className={className}>
      {conditions?.map((item, index) => {
        return <ConditionSelect item={item} handleDelete={handleDelete} key={index} />;
      })}
      <Footer>
        {desc}
        <Button className="add" onClick={handleAdd}>
          {addText}
        </Button>
      </Footer>
    </Wrapper>
  );
}

export default ArrayInput;
