import styled from 'styled-components';
import { Form, Text } from '@kubed/components';

export const StyledForm = styled(Form)`
  padding: 20px;

  .form-item {
    .input-wrapper,
    .kubed-select {
      width: 100%;
      max-width: 455px;
    }
  }
`;

export const Option = styled.div`
  overflow: hidden;
`;

export const OptionName = styled(Text)`
  font-size: 12px;
  line-height: 1.67;
  font-weight: bold;
  color: #fff;
`;

export const OptionDescription = styled(Text)`
  font-size: 12px;
  line-height: 1.67;
  color: ${props => props.theme.palette.accents_5};
`;
