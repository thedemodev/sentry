import React from 'react';
import styled from '@emotion/styled';

import {tct} from 'app/locale';
import {IconEllipsis} from 'app/icons';
import space from 'app/styles/space';

import {GridCellLeft, IconWrapper, Grid} from './styles';

type Props = {
  onClick: () => void;
  quantity: number;
  hasBeenExpanded: boolean;
};

const ListCollapse = ({quantity, onClick, hasBeenExpanded}: Props) => {
  if (quantity === 0) {
    return null;
  }

  return (
    <StyledGrid>
      <Wrapper data-test-id="breadcrumb-collapsed" onClick={onClick}>
        <IconWrapper>
          <IconEllipsis />
        </IconWrapper>
        {hasBeenExpanded
          ? tct('Hide [quantity] expanded crumbs', {quantity})
          : tct('Show [quantity] collapsed crumbs', {quantity})}
      </Wrapper>
    </StyledGrid>
  );
};

export default ListCollapse;

const Wrapper = styled(GridCellLeft)`
  cursor: pointer;
  background: ${p => p.theme.gray100};
  font-size: ${p => p.theme.fontSizeMedium};
  grid-column-start: 1;
  grid-column-end: -1;
  display: grid;
  grid-gap: ${space(1.5)};
  grid-template-columns: max-content 1fr;
`;

const StyledGrid = styled(Grid)`
  border-top: 0;
  position: relative;
  margin-bottom: -1px;
  z-index: 1;
`;
