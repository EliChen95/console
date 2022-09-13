import React from 'react';
import cx from 'classnames';
import { Row, Col, FormItem, Input } from '@kubed/components';

import { CssContainer } from './styles';

type Props = {
  hostName: string[];
  portName: string[];
  hostRules?: Array<any>;
  portRules?: Array<any>;
  readonly?: boolean;
  style?: any;
  className?: string;
  defaultPort?: number;
};

function UrlInput({
  hostName,
  portName,
  hostRules,
  portRules,
  readonly,
  className,
  style,
  defaultPort = 9022,
}: Props): JSX.Element {
  return (
    <CssContainer>
      <Row className={cx('url-input-wrapper', className)} style={style} columns={12}>
        <Col span={8} style={{ marginRight: '12px' }}>
          <FormItem name={hostName} rules={hostRules}>
            <Input
              className="gap"
              readOnly={readonly}
              placeholder={`${t('EXAMPLE')}192.168.1.10`}
            />
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem name={portName} rules={portRules}>
            <Input readOnly={readonly} defaultValue={defaultPort} />
          </FormItem>
        </Col>
      </Row>
    </CssContainer>
  );
}

export default UrlInput;
