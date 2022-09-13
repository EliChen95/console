import React from 'react';
import cx from 'classnames';
import { Button } from '@kubed/components';

import ConditionSelect from './condition-select';

export type ConditionItem = {
  key?: string;
  operator?: string;
  values?: string[];
};

type Props = {
  conditions?: Array<ConditionItem>;
  desc?: React.ReactNode;
  addText?: string;
  className?: string;
};

function ArrayInput({ desc, addText, className, conditions }: Props): JSX.Element {
  function handleAdd(): void {
    console.log('add condition');
  }

  function handleDelete(): void {
    console.log('delete condition');
  }

  return (
    <div className={cx('wrapper', className)}>
      {conditions?.map((item, index) => {
        return <ConditionSelect item={item} handleDelete={handleDelete} key={index} />;
      })}
      <div className="footer">
        {desc}
        <Button className="add" onClick={handleAdd}>
          {addText}
        </Button>
      </div>
    </div>
  );
}

export default ArrayInput;
