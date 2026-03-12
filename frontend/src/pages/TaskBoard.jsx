import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Grid, Typography, Button, Box, Paper, Stack, CircularProgress, Snackbar, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import api from '../api/axios'
import TaskCard from '../components/TaskCard'
import TaskFormModal from '../components/TaskFormModal'
import AppLayout from '../components/layout/AppLayout'
import * as S from '../styles/taskStyles'

const STATUS_META = {
  'Pending':     { color: '#f5a623', bg: 'rgba(245,166,35,0.1)' },
  'In Progress': { color: '#29b6f6', bg: 'rgba(41,182,246,0.1)' },
  'Completed':   { color: '#4caf7d', bg: 'rgba(76,175,125,0.1)' },
}

const TaskBoard = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [projectName, setProjectName] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const [taskRes, projRes, userRes] = await Promise.all([
        api.get(`/projects/${projectId}/tasks`),
        api.get(`/projects/${projectId}`),
        api.get('/users'),
      ])
      setTasks(taskRes.data)
      setProjectName(projRes.data.project_name)
      setUsers(userRes.data)
    } catch (err) {
      showSnackbar('Failed to load tasks', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [projectId])

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity })

  const handleOpenModal = (task = null) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  const handleSubmitTask = async (formData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, formData)
        if (formData.assigned_to && formData.assigned_to !== editingTask.assigned_to) {
          await api.post(`/tasks/${editingTask.id}/assign`, { user_id: formData.assigned_to })
        }
        showSnackbar('Task updated')
      } else {
        const res = await api.post('/tasks', formData)
        if (formData.assigned_to) {
          await api.post(`/tasks/${res.data.id}/assign`, { user_id: formData.assigned_to })
        }
        showSnackbar('Task created')
      }
      handleCloseModal()
      fetchTasks()
    } catch (err) {
      showSnackbar(err.response?.data?.detail || 'Failed to save task', 'error')
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
      showSnackbar('Task deleted')
      fetchTasks()
    } catch (err) {
      showSnackbar('Failed to delete task', 'error')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus })
      fetchTasks()
    } catch (err) {
      showSnackbar('Failed to update status', 'error')
    }
  }

  if (loading) {
    return (
      <AppLayout title="Tasks">
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={projectName || 'Tasks'}>
      <Box sx={S.boardHeader}>
        <Box sx={S.boardHeaderLeft}>
          <Button startIcon={<ArrowBackIcon />} color="inherit" onClick={() => navigate('/projects')}>
            Back
          </Button>
          <Box ml={1}>
            <Typography variant="h5" fontWeight={700}>{projectName}</Typography>
            <Typography variant="body2" color="text.secondary">{tasks.length} tasks</Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Add Task
        </Button>
      </Box>

      <Grid container spacing={2} alignItems="flex-start">
        {['Pending', 'In Progress', 'Completed'].map(col => {
          const colTasks = tasks.filter(t => t.status === col)
          return (
            <Grid item xs={12} md={4} key={col}>
              <Paper sx={S.column}>
                <Box sx={S.columnHeader}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ ...S.columnDot, bgcolor: STATUS_META[col].color }} />
                    <Typography variant="subtitle2" fontWeight={600}>{col}</Typography>
                  </Stack>
                  <Box sx={{ ...S.columnBadge, bgcolor: STATUS_META[col].bg }}>
                    <Typography variant="caption" fontWeight={600} sx={{ color: STATUS_META[col].color }}>
                      {colTasks.length}
                    </Typography>
                  </Box>
                </Box>
                {colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
                {colTasks.length === 0 && (
                  <Box py={4} textAlign="center">
                    <Typography variant="body2" color="text.secondary">No tasks</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      <TaskFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
        projectId={parseInt(projectId)}
        users={users}
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  )
}

export default TaskBoard
