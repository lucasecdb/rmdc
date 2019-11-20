import * as React from 'react'
import {
  Icon,
  TopAppBar,
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@lucasecdb/rmdc'

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <TopAppBar fixed dense>
        <TopAppBarRow>
          <TopAppBarSection>
            <TopAppBarIcon navIcon>
              <Icon icon="menu" />
            </TopAppBarIcon>
            <TopAppBarTitle>RMDC</TopAppBarTitle>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust dense fixed>
        <div className="container">{children}</div>
      </TopAppBarFixedAdjust>
    </>
  )
}

export default Layout
