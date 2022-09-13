import React from 'react';
import { Button } from '@kubed/components';

import { CssContainer } from '../../styles';

type Props = {
  isLoading: boolean;
  onCancel: () => void;
  handleSubmit: () => void;
};

function FooterBtn({ isLoading, onCancel, handleSubmit }: Props): JSX.Element {
  return (
    <CssContainer className="footer-btn">
      <Button className="gap" onClick={onCancel}>
        {t('CANCEL')}
      </Button>
      <Button color="secondary" loading={isLoading} onClick={handleSubmit} shadow>
        {t('OK')}
      </Button>
    </CssContainer>
  );
}

export default FooterBtn;
