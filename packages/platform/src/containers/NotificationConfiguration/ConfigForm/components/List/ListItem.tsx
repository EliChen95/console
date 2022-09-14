import React from 'react';
import cx from 'classnames';
import { Icon } from '@ks-console/shared';
import { Button } from '@kubed/components';

import type { ListItem } from '../../../../../types';

type Props = {
  item: ListItem;
  className?: string;
  onClick?: (item: ListItem) => void;
  onDelete?: (item: ListItem) => void;
  onEdit?: (item: ListItem) => void;
};

function Item({ item, className, onDelete, onEdit, onClick }: Props): JSX.Element {
  const { title, details, description, titleClass, operations, ...rest } = item;

  return (
    <div className={cx('list-item', className)} onClick={() => onClick?.(item)} {...rest}>
      <div className="texts">
        <div className={cx('text', titleClass)}>
          <div className="ellipsis title">{title}</div>
          <div className="ellipsis description">{description}</div>
        </div>
        {details &&
          details.map((detail: any, index: number) => (
            <div key={index} className={cx('text', detail.className)}>
              <div className="ellipsis title">{detail.title}</div>
              {detail.description && (
                <div className="ellipsis description">{detail.description}</div>
              )}
            </div>
          ))}
      </div>
      {operations || (
        <div className="buttons">
          {onDelete && (
            <Button
              className="button-flat"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(item);
              }}
            >
              <Icon name="trash" />
            </Button>
          )}
          {onEdit && (
            <Button
              className="button-flat"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onEdit(item);
              }}
            >
              <Icon name="pen" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default Item;
