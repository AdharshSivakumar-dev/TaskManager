import React, { useState, useEffect } from 'react'
import {
  IconButton, Badge, Popover, Typography, Box, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, Button,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import * as S from '../styles/notificationStyles'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60)     return 'Just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(dateStr).toLocaleDateString()
}

const NotificationPanel = () => {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)

  const fetchNotifications = async () => {
    if (!isAuthenticated) return
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.notifications)
      setUnreadCount(res.data.unread_count)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    if (unreadIds.length === 0) return
    try {
      await api.put('/notifications/mark-read', { notification_ids: unreadIds })
      fetchNotifications()
    } catch (err) {
      console.error('Failed to mark all read', err)
    }
  }

  const markOneRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to read notification', err)
    }
  }

  const deleteOne = async (id, e) => {
    e?.stopPropagation()
    try {
      const target = notifications.find(n => n.id === id)
      await api.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n.id !== id))
      if (target && !target.is_read) setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to delete notification', err)
    }
  }

  if (!isAuthenticated) return null

  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton color="inherit" onClick={e => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0} max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: S.popoverPaper }}
      >
        <Box sx={S.panelHeader}>
          <Typography variant="subtitle2" fontWeight={600}>Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" variant="text" sx={S.markReadBtn} onClick={markAllRead}>Mark all read</Button>
          )}
        </Box>

        <Box sx={S.panelBody}>
          {notifications.length === 0 ? (
            <Box sx={S.emptyState}>
              <NotificationsOffIcon sx={S.emptyIcon} />
              <Typography variant="body2" color="text.secondary" mt={1}>All caught up</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((n, i) => (
                <React.Fragment key={n.id}>
                  <ListItem disablePadding sx={S.notifItem(n.is_read)}>
                    <ListItemButton sx={S.notifButton} onClick={() => !n.is_read && markOneRead(n.id)}>
                      <ListItemIcon sx={S.notifIcon}>
                        {n.is_read
                          ? <NotificationsIcon sx={S.notifIconStyle(true)} />
                          : <NotificationsActiveIcon sx={S.notifIconStyle(false)} />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" sx={S.notifMessage}>{n.message}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{timeAgo(n.created_at)}</Typography>}
                      />
                      <IconButton size="small" sx={S.deleteBtn} onClick={e => deleteOne(n.id, e)}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>
                  {i < notifications.length - 1 && <Divider component="li" sx={{ mx: 2 }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  )
}

export default NotificationPanel
