import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Stack, Typography, IconButton, CircularProgress,
  FormLabel, Grid, Select, MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import * as S from '../styles/modalStyles'

const TaskFormModal = ({ open, onClose, onSubmit, initialData, projectId, users }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', status: 'Pending', due_date: '', assigned_to: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'Pending',
        due_date: initialData.due_date || '',
        assigned_to: initialData.assigned_to || '',
      })
    } else {
      setFormData({ title: '', description: '', status: 'Pending', due_date: '', assigned_to: '' })
    }
  }, [initialData, open])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      due_date: formData.due_date || null,
      assigned_to: formData.assigned_to || null,
    }
    if (!initialData) payload.project_id = projectId
    await onSubmit(payload)
    setLoading(false)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={S.dialogTitle}>
        <Typography variant="h6" fontWeight={600}>
          {initialData ? 'Edit Task' : 'New Task'}
        </Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={S.dialogContent}>
        <Stack spacing={2}>
          <Stack spacing={0.75}>
            <FormLabel sx={S.fieldLabel}>Task Title</FormLabel>
            <TextField fullWidth name="title" placeholder="What needs to be done?" value={formData.title} onChange={handleChange} />
          </Stack>
          <Stack spacing={0.75}>
            <FormLabel sx={S.fieldLabel}>Description</FormLabel>
            <TextField fullWidth name="description" multiline rows={2} value={formData.description} onChange={handleChange} />
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.75}>
                <FormLabel sx={S.fieldLabel}>Status</FormLabel>
                <Select fullWidth name="status" value={formData.status} onChange={handleChange} size="small">
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.75}>
                <FormLabel sx={S.fieldLabel}>Due Date</FormLabel>
                <TextField fullWidth name="due_date" type="date" value={formData.due_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              </Stack>
            </Grid>
          </Grid>
          <Stack spacing={0.75}>
            <FormLabel sx={S.fieldLabel}>Assign To</FormLabel>
            <Select fullWidth name="assigned_to" value={formData.assigned_to} onChange={handleChange} size="small">
              <MenuItem value="">Unassigned</MenuItem>
              {users && users.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
            </Select>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={S.dialogActions}>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {loading ? <CircularProgress size={18} color="inherit" /> : (initialData ? 'Save Changes' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskFormModal
