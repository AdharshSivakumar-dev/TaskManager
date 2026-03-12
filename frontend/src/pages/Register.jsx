import React, { useState } from 'react'
import {
  Box, Button, TextField, Typography, Card, CardContent,
  Stack, IconButton, InputAdornment, Snackbar, Alert,
  CircularProgress, FormLabel, FormHelperText, Link as MuiLink,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import api from '../api/axios'
import * as S from '../styles/authStyles'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' })
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post('/auth/register', { name, email, password })
      setSnackbar({ open: true, message: 'Account created! Please sign in.', severity: 'success' })
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.detail || 'Registration failed.', severity: 'error' })
      setLoading(false)
    }
  }

  return (
    <Box sx={S.pageWrapper}>
      <Stack sx={{ width: '100%', maxWidth: 400 }} spacing={3}>
        <Stack alignItems="center" spacing={1}>
          <Box sx={S.brandMark}>
            <Typography sx={S.brandText}>TM</Typography>
          </Box>
          <Typography variant="h5" fontWeight={700}>TaskManager</Typography>
          <Typography variant="body2" color="text.secondary">Create your account</Typography>
        </Stack>

        <Card sx={S.card}>
          <CardContent sx={S.cardContent}>
            <Stack spacing={2.5}>
              <Stack spacing={0.75}>
                <FormLabel sx={S.fieldLabel}>Full name</FormLabel>
                <TextField fullWidth placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
              </Stack>
              <Stack spacing={0.75}>
                <FormLabel sx={S.fieldLabel}>Email address</FormLabel>
                <TextField fullWidth type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </Stack>
              <Stack spacing={0.75}>
                <FormLabel sx={S.fieldLabel}>Password</FormLabel>
                <TextField
                  fullWidth
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShow(!show)}>
                          {show ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText>At least 6 characters</FormHelperText>
              </Stack>
              <Button fullWidth variant="contained" size="large" onClick={handleSubmit} disabled={loading} sx={S.submitButton}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Create account'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Typography sx={S.bottomLink}>
          Already have an account?{' '}
          <MuiLink component={RouterLink} to="/login" color="primary.light" underline="hover">
            Sign in
          </MuiLink>
        </Typography>
      </Stack>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Register
