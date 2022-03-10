import styled from 'styled-components';

export const EditorWrapper = styled.div`
  height: 100%;
  .ace_editor {
    min-height: 500px;
    border-radius: 4px;
    line-height: 20px !important;
    font-family: Monaco, Menlo, Consolas, Courier New, monospace;
    -webkit-font-smoothing: antialiased;

    &.ace-chaos {
      color: #ffffff;
      background-color: #242e42;

      .ace_gutter {
        color: #537f7e;
        background-color: #242e42;
        border-right: 1px solid #4a5974;
      }

      .ace_variable,
      .ace_identifier,
      .ace_meta.ace_tag {
        color: #75e0f2;
      }

      .ace_keyword {
        color: #ffffff;
      }

      .ace_string {
        color: #ebe087;
      }

      .ace_constant.ace_numeric {
        color: #bd99ff;
      }

      .ace_marker-layer .ace_active-line {
        background-color: #36435c;
      }

      .ace_indent-guide {
        border-right: 1px dotted #777;
        padding: 2px 0;
      }

      .ace_marker-layer .ace_selection {
        background-color: #4a5974;
      }

      .ace_comment {
        color: #aaa;
      }

      .ace_fold:hover {
        background-color: #fff;
      }

      .ace_line .ace_fold {
        height: auto;
      }
    }

    .ace_search {
      background-color: #f9fbfd;
    }

    .ace_search.right {
      right: 12px;
    }
  }
`;
