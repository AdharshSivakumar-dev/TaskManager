import React, { useState, useEffect } from 'react'
import {
  Grid, Typography, Button, Box, CircularProgress, Snackbar, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import FolderOffIcon from '@mui/icons-material/FolderOff'
import api from '../api/axios'
import ProjectCard from '../components/ProjectCard'
import ProjectFormModal from '../components/ProjectFormModal'
import AppLayout from '../components/layout/AppLayout'
import * as S from '../styles/dashboardStyles'

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await api.get('/projects')
      setProjects(response.data)
    } catch (err) {
      showSnackbar('Failed to fetch projects', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity })

  const handleOpenModal = (project = null) => {
    setEditingProject(project)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingProject(null)
  }

  const handleSubmitProject = async (formData) => {
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, formData)
        showSnackbar('Project updated successfully')
      } else {
        await api.post('/projects', formData)
        showSnackbar('Project created successfully')
      }
      handleCloseModal()
      fetchProjects()
    } catch (err) {
      showSnackbar(err.response?.data?.detail || 'Failed to save project', 'error')
    }
  }

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`)
      showSnackbar('Project deleted successfully')
      fetchProjects()
    } catch (err) {
      showSnackbar('Failed to delete project', 'error')
    }
  }

  return (
    <AppLayout title="My Projects">
      <Box sx={S.pageHeader}>
        <Box>
          <Typography variant="h5" fontWeight={700}>My Projects</Typography>
          <Typography variant="body2" color="text.secondary">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          New Project
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      ) : projects.length === 0 ? (
        <Box sx={S.emptyState}>
          <FolderOffIcon sx={S.emptyIcon} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No projects yet</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>Create your first project to get started.</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
            New Project
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map(project => (
            <Grid item key={project.id} xs={12} sm={6} md={4}>
              <ProjectCard project={project} onEdit={handleOpenModal} onDelete={handleDeleteProject} />
            </Grid>
          ))}
        </Grid>
      )}

      <ProjectFormModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmitProject} initialData={editingProject} />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  )
}

export default ProjectDashboard
