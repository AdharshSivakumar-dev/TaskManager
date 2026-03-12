import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Drawer, Box, Typography, List, ListItemButton, ListItemIcon,
  ListItemText, Avatar, IconButton, Tooltip, Divider,
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import BarChartIcon from '@mui/icons-material/BarChart'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import * as S from '../../styles/layoutStyles'

export const DRAWER_WIDTH = S.DRAWER_WIDTH

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard',  Icon: DashboardIcon  },
  { label: 'Projects',  path: '/projects',   Icon: FolderIcon     },
  { label: 'My Tasks',  path: '/my-tasks',   Icon: AssignmentIcon },
  { label: 'Analytics', path: '/analytics',  Icon: BarChartIcon   },
]

function DrawerContent({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={S.drawerHeader}>
        <Box sx={S.logoMark}>
          <Typography sx={S.logoText}>TM</Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
          TaskManager
        </Typography>
      </Box>
      <Divider />
      <List sx={S.navList} disablePadding>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => { navigate(item.path); onClose?.() }}
            sx={S.navItem}
          >
            <ListItemIcon sx={S.navIcon}>
              <item.Icon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={S.userSection}>
        <Avatar sx={S.userAvatar}>{user?.name?.[0]?.toUpperCase()}</Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>{user?.email}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' } }}
        PaperProps={{ sx: { width: DRAWER_WIDTH } }}
      >
        <DrawerContent onClose={onClose} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' } }}
        PaperProps={{ sx: { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        open
      >
        <DrawerContent onClose={() => {}} />
      </Drawer>
    </>
  )
}
