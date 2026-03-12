import React, { useState } from 'react'
import { Box } from '@mui/material'
import Sidebar, { DRAWER_WIDTH } from './Sidebar'
import TopBar from './TopBar'
import * as S from '../../styles/layoutStyles'

export default function AppLayout({ children, title }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={S.appShell}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box sx={{ ...S.mainArea, ml: { sm: `${DRAWER_WIDTH}px` } }}>
        <TopBar onMenuOpen={() => setMobileOpen(true)} title={title} />
        <Box component="main" sx={S.mainContent}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
