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
import { Helmet } from 'react-helmet'

import styles from './Layout.module.css'

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Helmet titleTemplate="%s | RMDC" defaultTitle="RMDC" />
      <TopAppBar fixed dense className="docs-app-bar">
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
      <TopAppBarFixedAdjust dense>
        <div className="container">{children}</div>
      </TopAppBarFixedAdjust>
    </>
  )
}

export default Layout
