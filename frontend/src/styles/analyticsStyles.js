export const pageHeader = { mb: 3 }
export const statCard = (color) => ({
  p: 2.5, borderRadius: 2,
  bgcolor: 'background.paper',
  border: '1px solid rgba(255,255,255,0.06)',
  borderLeftColor: color,
  borderLeftWidth: 3,
  borderLeftStyle: 'solid',
})
export const statCardInner = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
}
export const statIconBox = (color) => ({
  p: 1, borderRadius: 2,
  bgcolor: `${color}1a`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
})
export const chartPaper = { p: 3, borderRadius: 2 }
export const chartTitle = { fontWeight: 600, mb: 2 }
export const tooltipStyle = {
  backgroundColor: '#1a1d27',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, fontSize: 12,
}
export const progressCell = {
  display: 'flex', alignItems: 'center', gap: 1,
}
export const progressBar = { flexGrow: 1, height: 5, borderRadius: 3 }
export const progressLabel = { minWidth: 32, fontSize: '0.75rem' }
