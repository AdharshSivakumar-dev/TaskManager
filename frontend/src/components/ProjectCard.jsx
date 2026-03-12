import React, { useState } from 'react'
import {
  Card, CardContent, CardActions, Typography, Box, Stack,
  IconButton, Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import FolderIcon from '@mui/icons-material/Folder'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import * as S from '../styles/dashboardStyles'

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <Card sx={S.projectCard}>
        <CardContent sx={S.projectCardContent}>
          <Box sx={S.projectCardHeader}>
            <Box sx={S.projectIconBox}>
              <FolderIcon sx={S.projectIcon} />
            </Box>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(project)}>
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => setConfirmOpen(true)}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
          </Box>
          <Typography variant="subtitle1" fontWeight={600} noWrap gutterBottom>
            {project.project_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={S.projectDescription}>
            {project.description || 'No description'}
          </Typography>
        </CardContent>
        <CardActions sx={S.projectCardActions}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(project.created_at).toLocaleDateString()}
            </Typography>
          </Stack>
          <Button size="small" variant="outlined" endIcon={<ArrowForwardIcon />}
            onClick={() => navigate(`/projects/${project.id}/tasks`)}>
            View Tasks
          </Button>
        </CardActions>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete project?</DialogTitle>
        <DialogContent>
          <DialogContentText>All tasks in this project will be deleted.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={() => { onDelete(project.id); setConfirmOpen(false) }} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProjectCard
