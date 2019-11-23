import {
  Icon,
  TopAppBar,
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@lucasecdb/rmdc'
import { Link } from 'gatsby'
import * as React from 'react'

import styles from './Layout.module.css'

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <TopAppBar fixed dense>
        <TopAppBarRow>
          <TopAppBarSection>
            <TopAppBarIcon navIcon>
              <Icon icon="menu" />
            </TopAppBarIcon>
            <TopAppBarTitle>
              <Link to="/" className={styles.title}>
                RMDC
              </Link>
            </TopAppBarTitle>
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
