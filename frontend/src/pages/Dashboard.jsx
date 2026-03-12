import React, { useState, useEffect } from 'react'
import {
  Grid, Typography, Box, Paper, CircularProgress, Alert,
  ListItemButton, ListItemIcon, ListItemText, List, ListItem, Chip, Button
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [projects, setProjects] = useState([])
  const [assignedTasks, setAssignedTasks] = useState([])
  const [analytics, setAnalytics] = useState(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, tasksRes, statsRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks/assigned'),
          api.get('/analytics/tasks')
        ])
        setProjects(projRes.data)
        setAssignedTasks(tasksRes.data)
        setAnalytics(statsRes.data)
      } catch (err) {
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout title="Dashboard">
        <Alert severity="error">{error}</Alert>
      </AppLayout>
    )
  }

  const STAT_CARDS = [
    { value: projects.length, label: 'My Projects', color: '#7C6AF7', Icon: FolderIcon },
    { value: analytics?.created_by_me || 0, label: 'Tasks Created', color: '#29b6f6', Icon: AssignmentIcon },
    { value: analytics?.assigned_to_me || 0, label: 'Assigned to Me', color: '#F06292', Icon: PersonPinIcon },
    { value: analytics?.completed_tasks || 0, label: 'Completed', color: '#4caf7d', Icon: CheckCircleIcon },
  ]

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'success'
    if (status === 'In Progress') return 'info'
    return 'warning'
  }

  return (
    <AppLayout title="Dashboard">
      {/* Welcome Row */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Welcome back, {user?.name || 'User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's what's happening with your work today.
        </Typography>
      </Box>

      {/* Stat Cards Row */}
      <Grid container spacing={2} mb={3}>
        {STAT_CARDS.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Box sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: `4px solid ${card.color}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <Box>
                <Typography variant="h4" fontWeight={700}>{card.value}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>{card.label}</Typography>
              </Box>
              <Box sx={{
                width: 40, height: 40, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: `${card.color}15`
              }}>
                <card.Icon sx={{ color: card.color, fontSize: 24 }} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Two Column Row */}
      <Grid container spacing={3}>
        
        {/* Left Column: Recent Projects */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={600}>Recent Projects</Typography>
              <Button size="small" onClick={() => navigate('/projects')}>View all</Button>
            </Box>
            
            {projects.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No projects yet</Typography>
            ) : (
              <List disablePadding>
                {projects.slice(0, 4).map(p => (
                  <ListItemButton
                    key={p.id}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                    onClick={() => navigate(`/projects/${p.id}/tasks`)}
                  >
                    <ListItemIcon>
                      <FolderIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={p.project_name}
                      secondary={p.description || 'No description'}
                      primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ noWrap: true, fontSize: '0.78rem' }}
                    />
                    <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Right Column: Assigned Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={600}>Assigned to Me</Typography>
              <Button size="small" onClick={() => navigate('/my-tasks')}>View all</Button>
            </Box>

            {assignedTasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No tasks assigned to you</Typography>
            ) : (
              <List disablePadding>
                {assignedTasks.slice(0, 4).map(task => (
                  <ListItem
                    key={task.id}
                    sx={{ px: 0, py: 0.75, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    secondaryAction={
                      <Chip size="small" label={task.status} color={getStatusColor(task.status)} />
                    }
                  >
                    <ListItemText
                      primary={task.title}
                      secondary={`Project #${task.project_id}`}
                      primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem', pr: 10 }}
                      secondaryTypographyProps={{ fontSize: '0.78rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

      </Grid>
    </AppLayout>
  )
}

export default Dashboard
