import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Stack, Typography, IconButton, CircularProgress,
  FormLabel, Grid, Select, MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import * as S from '../styles/modalStyles'

const ProjectFormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setName(initialData.project_name || '')
      setDescription(initialData.description || '')
    } else {
      setName('')
      setDescription('')
    }
  }, [initialData, open])

  const handleSubmit = async () => {
    setLoading(true)
    await onSubmit({ project_name: name, description })
    setLoading(false)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={S.dialogTitle}>
        <Typography variant="h6" fontWeight={600}>
          {initialData ? 'Edit Project' : 'New Project'}
        </Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={S.dialogContent}>
        <Stack spacing={2.5}>
          <Stack spacing={0.75}>
            <FormLabel sx={S.fieldLabel}>Project Name</FormLabel>
            <TextField fullWidth placeholder="e.g. Website Redesign" value={name} onChange={e => setName(e.target.value)} />
          </Stack>
          <Stack spacing={0.75}>
            <FormLabel sx={S.fieldLabel}>Description</FormLabel>
            <TextField fullWidth multiline rows={3} placeholder="What is this project about?" value={description} onChange={e => setDescription(e.target.value)} />
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

export default ProjectFormModal
