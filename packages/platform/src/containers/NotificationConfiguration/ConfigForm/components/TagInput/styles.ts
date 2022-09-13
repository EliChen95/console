import styled from 'styled-components';

export const CssContainer = styled.div`
  .filterInput {
    display: flex;
    flex-wrap: wrap;
    min-height: 32px;
    padding: 0px 8px 6px;
    border-radius: 4px;
    border: solid 1px $light-color08;
    background-color: white;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    color: $dark-color06;
    outline: none;
    height: 32px;

    :global {
      .tag {
        padding: 0 8px;
        margin-right: 8px;
        margin-top: 6px;
        font-weight: 400;
      }

      .icon {
        margin-left: 6px;
      }
      .icon-clickable:hover,
      .icon-clickable:active {
        background-color: transparent;
      }
    }
  }

  .autosuggest {
    position: relative;
    margin-top: 6px;
  }

  .autosuggestInput > input {
    position: relative;
    display: inline-block;
    height: 20px;
    padding: 0;
    border: 0;
    outline: none;
    font-family: $font-family;
    font-size: 12px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    color: $dark-color06;
    caret-color: $dark-color06;
    cursor: text;
    pointer-events: auto;
    z-index: 1;
    &::placeholder {
      color: $dark-color01;
      font-weight: 400;
    }
  }

  .form-item.error-item .filterInput {
    border: solid 1px #ca2621 !important;
  }
`;
