import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#7C6AF7', light: '#a89af9', dark: '#5a48d4', contrastText: '#fff' },
    background: { default: '#0f1117', paper: '#1a1d27' },
    text:       { primary: '#e8eaf0', secondary: '#9196a8' },
    divider:    'rgba(255,255,255,0.07)',
    success:    { main: '#4caf7d' },
    warning:    { main: '#f5a623' },
    info:       { main: '#29b6f6' },
    error:      { main: '#f44336' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0f1117',
          scrollbarWidth: 'thin',
          scrollbarColor: '#2e3347 #1a1d27',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 18px' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7C6AF7, #5a48d4)',
          boxShadow: '0 4px 14px rgba(124,106,247,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9d8ef9, #7C6AF7)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a1d27',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: '#1a1d27' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.22)' },
            '&.Mui-focused fieldset': { borderColor: '#7C6AF7' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500, fontSize: '0.75rem' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1d27',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(124,106,247,0.14)',
            color: '#a89af9',
            '& .MuiListItemIcon-root': { color: '#a89af9' },
            '&:hover': { backgroundColor: 'rgba(124,106,247,0.2)' },
          },
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1d27',
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1d27',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.07)' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.06)' },
        head: {
          color: '#9196a8', fontWeight: 600,
          fontSize: '0.72rem', textTransform: 'uppercase',
          letterSpacing: '0.07em',
        },
      },
    },
  },
})

export default theme
