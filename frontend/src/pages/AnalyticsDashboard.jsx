import React, { useState, useEffect } from 'react'
import {
  Grid, Typography, Box, CircularProgress, Alert, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress,
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import CreateIcon from '@mui/icons-material/Create'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../api/axios'
import AppLayout from '../components/layout/AppLayout'
import * as S from '../styles/analyticsStyles'

const COLORS = { 'Pending': '#f5a623', 'In Progress': '#29b6f6', 'Completed': '#4caf7d' }

const STAT_CARDS = [
  { key: 'total_tasks',       label: 'Total Tasks',  color: '#7C6AF7', Icon: AssignmentIcon },
  { key: 'completed_tasks',   label: 'Completed',    color: '#4caf7d', Icon: CheckCircleIcon },
  { key: 'in_progress_tasks', label: 'In Progress',  color: '#29b6f6', Icon: AutorenewIcon },
  { key: 'pending_tasks',     label: 'Pending',      color: '#f5a623', Icon: HourglassEmptyIcon },
]

const SECONDARY_CARDS = [
  { key: 'assigned_to_me', label: 'Assigned to Me', color: '#F06292', Icon: PersonPinIcon },
  { key: 'created_by_me',  label: 'Created by Me',  color: '#a89af9', Icon: CreateIcon },
]

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/tasks')
        setData(res.data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load analytics data.')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) return <AppLayout title="Analytics"><Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box></AppLayout>
  if (error) return <AppLayout title="Analytics"><Alert severity="error">{error}</Alert></AppLayout>
  if (!data) return null

  const barData = (data.tasks_per_project || []).map(p => ({
    name: p.project_name, Pending: p.pending, 'In Progress': p.in_progress, Completed: p.completed,
  }))

  const pieData = (data.status_distribution || []).filter(d => d.count > 0).map(d => ({ name: d.status, value: d.count }))

  const StatCard = ({ card }) => (
    <Box sx={S.statCard(card.color)}>
      <Box sx={S.statCardInner}>
        <Box>
          <Typography variant="h4" fontWeight={700}>{data[card.key]}</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>{card.label}</Typography>
        </Box>
        <Box sx={S.statIconBox(card.color)}>
          <card.Icon sx={{ color: card.color, fontSize: 24 }} />
        </Box>
      </Box>
    </Box>
  )

  return (
    <AppLayout title="Analytics">
      <Box sx={S.pageHeader}>
        <Typography variant="h5" fontWeight={700}>Task Analytics</Typography>
        <Typography variant="body2" color="text.secondary">Overview of your projects and tasks</Typography>
      </Box>

      <Grid container spacing={2} mb={3}>
        {STAT_CARDS.map(card => (
          <Grid item xs={12} sm={6} md={3} key={card.key}><StatCard card={card} /></Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mb={3}>
        {SECONDARY_CARDS.map(card => (
          <Grid item xs={12} sm={6} key={card.key}><StatCard card={card} /></Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={S.chartPaper}>
            <Typography sx={S.chartTitle} variant="h6">Tasks per Project</Typography>
            {!barData.length ? (
              <Typography color="text.secondary">No project data yet</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#9196a8', fontSize: 11 }} tickFormatter={v => v.length > 10 ? v.slice(0, 10) + '…' : v} />
                  <YAxis tick={{ fill: '#9196a8', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={S.tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Pending" fill="#f5a623" stackId="a" />
                  <Bar dataKey="In Progress" fill="#29b6f6" stackId="a" />
                  <Bar dataKey="Completed" fill="#4caf7d" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={S.chartPaper}>
            <Typography sx={S.chartTitle} variant="h6">Status Distribution</Typography>
            {!pieData.length ? (
              <Typography color="text.secondary">No tasks yet</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie dataKey="value" nameKey="name" data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={COLORS[entry.name]} />)}
                  </Pie>
                  <Tooltip contentStyle={S.tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight={600} mb={2}>Project Breakdown</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Pending</TableCell>
              <TableCell align="center">In Progress</TableCell>
              <TableCell align="center">Completed</TableCell>
              <TableCell>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data.tasks_per_project || []).map(row => {
              const pct = row.total > 0 ? Math.round(row.completed / row.total * 100) : 0
              return (
                <TableRow key={row.project_id}>
                  <TableCell>{row.project_name}</TableCell>
                  <TableCell align="center">{row.total}</TableCell>
                  <TableCell align="center">{row.pending}</TableCell>
                  <TableCell align="center">{row.in_progress}</TableCell>
                  <TableCell align="center">{row.completed}</TableCell>
                  <TableCell>
                    <Box sx={S.progressCell}>
                      <LinearProgress variant="determinate" value={pct} color="success" sx={S.progressBar} />
                      <Typography sx={S.progressLabel}>{pct}%</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </AppLayout>
  )
}

export default AnalyticsDashboard
