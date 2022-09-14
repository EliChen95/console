import React from 'react';

import Item from './ListItem';
import type { ListItem } from '../../../../../types';

import { CssContainer } from '../styles';

type Props = {
  items: Array<ListItem>;
  className?: string;
  itemClassName?: string;
  onClick?: (item: ListItem) => void;
  onDelete?: (item: ListItem) => void;
  onEdite?: (item: ListItem) => void;
};

function List({ items, className, itemClassName, onClick, onDelete, onEdite }: Props): JSX.Element {
  return (
    <CssContainer className={className}>
      {items.map((item: ListItem, index) => (
        <Item
          key={`${item.title}_${index}`}
          item={item}
          className={itemClassName}
          onClick={onClick}
          onDelete={onDelete}
          onEdit={onEdite}
        />
      ))}
    </CssContainer>
  );
}

export default List;
