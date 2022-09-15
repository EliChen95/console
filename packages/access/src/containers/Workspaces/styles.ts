import styled from 'styled-components';
import { Form } from '@kubed/components';

export const DescribleWrapper = styled.div`
  margin-top: 12px;
`;

export const StyledForm = styled(Form)`
  padding: 20px;
  .form-item {
    .input-wrapper,
    .kubed-select,
    textarea {
      width: 100%;
      max-width: 455px;
    }
  }
`;
