import React, { useState, useEffect } from 'react'
import {
  Box, Stack, Typography, Paper, Chip, Snackbar, Alert, CircularProgress, Button
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FolderIcon from '@mui/icons-material/Folder'
import PersonIcon from '@mui/icons-material/Person'
import AssignmentIcon from '@mui/icons-material/Assignment'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'

const STATUS_COLOR = {
  'Pending': '#f5a623',
  'In Progress': '#29b6f6',
  'Completed': '#4caf7d'
}

const MyTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/assigned')
      setTasks(res.data)
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load assigned tasks', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus })
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      setSnackbar({ open: true, message: 'Task status updated', severity: 'success' })
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update status'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    }
  }

  const filteredTasks = activeFilter === 'All' 
    ? tasks 
    : tasks.filter(t => t.status === activeFilter)

  if (loading) {
    return (
      <AppLayout title="My Tasks">
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="My Tasks">
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>My Tasks</Typography>
          <Typography variant="body2" color="text.secondary">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you
          </Typography>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Stack direction="row" spacing={1} mb={3}>
        {['All', 'Pending', 'In Progress', 'Completed'].map(filter => (
          <Chip
            key={filter}
            label={filter}
            onClick={() => setActiveFilter(filter)}
            variant={activeFilter === filter ? 'filled' : 'outlined'}
            color={activeFilter === filter ? 'primary' : 'default'}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>

      {/* Task List */}
      <Stack spacing={1.5}>
        {filteredTasks.length === 0 ? (
          <Box textAlign="center" py={6}>
            <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
            <Typography variant="h6" color="text.secondary">
              {activeFilter === 'All' ? "No tasks assigned to you yet" : `No ${activeFilter} tasks`}
            </Typography>
          </Box>
        ) : (
          filteredTasks.map(task => {
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Completed'
            
            return (
              <Paper 
                key={task.id} 
                sx={{ 
                  p: 2.5, borderRadius: 2, 
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: `3px solid ${STATUS_COLOR[task.status]}` 
                }}
              >
                {/* Row 1: Title and Status */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>{task.title}</Typography>
                    {task.description && (
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {task.description}
                      </Typography>
                    )}
                  </Box>
                  <Chip 
                    label={task.status} 
                    size="small" 
                    color={
                      task.status === 'Completed' ? 'success' :
                      task.status === 'In Progress' ? 'info' : 'warning'
                    } 
                  />
                </Box>

                {/* Row 2: Metadata */}
                <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap" mt={2}>
                  {task.due_date && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <CalendarTodayIcon sx={{ fontSize: 14, color: isOverdue ? 'error.main' : 'text.secondary' }} />
                      <Typography variant="caption" color={isOverdue ? 'error.main' : 'text.secondary'}>
                        {new Date(task.due_date).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  )}
                  
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <FolderIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Project #{task.project_id}
                    </Typography>
                  </Stack>

                  {task.creator_name && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Created by {task.creator_name}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                {/* Row 3: Status Update Controls */}
                <Box mt={2} display="flex" alignItems="center">
                  <Typography variant="caption" color="text.secondary" mr={1}>
                    Update status:
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {['Pending', 'In Progress', 'Completed'].map(s => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        onClick={() => handleStatusChange(task.id, s)}
                        variant={task.status === s ? 'filled' : 'outlined'}
                        sx={{ 
                          cursor: 'pointer',
                          bgcolor: task.status === s ? `${STATUS_COLOR[s]}20` : 'transparent',
                          color: task.status === s ? STATUS_COLOR[s] : 'text.primary',
                          borderColor: task.status === s ? STATUS_COLOR[s] : 'rgba(255,255,255,0.2)'
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Paper>
            )
          })
        )}
      </Stack>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  )
}

export default MyTasks
