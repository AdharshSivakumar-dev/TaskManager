import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Tooltip } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationPanel from '../NotificationPanel'
import * as S from '../../styles/layoutStyles'

export default function TopBar({ onMenuOpen, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <AppBar position="fixed" elevation={0} sx={{ ml: { sm: `${S.DRAWER_WIDTH}px` }, width: { sm: `calc(100% - ${S.DRAWER_WIDTH}px)` } }}>
      <Toolbar>
        <IconButton color="inherit" onClick={onMenuOpen} sx={{ mr: 1, display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={S.topBarTitle}>{title}</Typography>
        <Box sx={S.topBarRight}>
          <NotificationPanel />
          <Avatar sx={S.topBarAvatar}>{user?.name?.[0]?.toUpperCase()}</Avatar>
          <Tooltip title="Sign out">
            <IconButton color="inherit" size="small" onClick={() => { logout(); navigate('/login') }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
