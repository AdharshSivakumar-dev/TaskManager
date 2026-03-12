import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'

export default function AppTheme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
