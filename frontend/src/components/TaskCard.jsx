import React, { useState } from 'react'
import {
  Card, CardContent, Typography, Box, Stack, Chip, Select, MenuItem,
  IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'
import * as S from '../styles/taskStyles'

const STATUS_COLOR = {
  'Pending': 'warning', 'In Progress': 'info', 'Completed': 'success'
}

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Completed'

  return (
    <>
      <Card sx={S.taskCard}>
        <CardContent sx={S.taskCardContent}>
          <Box sx={S.taskRow1}>
            <Typography variant="subtitle2" fontWeight={600} sx={S.taskTitle}>
              {task.title}
            </Typography>
            <Chip size="small" label={task.status} color={STATUS_COLOR[task.status]} />
          </Box>

          {task.description && (
            <Typography variant="caption" color="text.secondary" mt={1} sx={S.taskDescription}>
              {task.description}
            </Typography>
          )}

          <Box sx={S.taskMeta}>
            {task.due_date && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <CalendarTodayIcon sx={{ fontSize: 12 }} color={isOverdue ? 'error' : 'disabled'} />
                <Typography variant="caption" color={isOverdue ? 'error.main' : 'text.secondary'}>
                  {new Date(task.due_date).toLocaleDateString()}
                </Typography>
              </Stack>
            )}
            {task.assignee_name && (
              <Chip size="small" icon={<PersonIcon />} label={task.assignee_name} variant="outlined" sx={S.assigneeChip} />
            )}
          </Box>

          <Box sx={S.taskActions}>
            <Select value={task.status} size="small" sx={S.statusSelect}
              onChange={e => onStatusChange(task.id, e.target.value)}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
            <IconButton size="small" onClick={() => onEdit(task)}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => setConfirmOpen(true)}>
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={() => { onDelete(task.id); setConfirmOpen(false) }} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TaskCard
