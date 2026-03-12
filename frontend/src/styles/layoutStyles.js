export const DRAWER_WIDTH = 240

export const appShell = {
  display: 'flex', bgcolor: 'background.default', minHeight: '100vh',
}
export const mainArea = {
  flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
}
export const mainContent = {
  flexGrow: 1, p: 3, pt: 11,
  bgcolor: 'background.default', minHeight: '100vh',
}
export const drawerHeader = {
  px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5,
}
export const logoMark = {
  width: 34, height: 34, borderRadius: 2,
  background: 'linear-gradient(135deg, #7C6AF7, #5a48d4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
}
export const logoText = { fontWeight: 800, fontSize: 13, color: '#fff' }
export const navList = { px: 1.5, pt: 1, flexGrow: 1 }
export const navItem = { borderRadius: 2, mb: 0.5, py: 1 }
export const navIcon = { minWidth: 36 }
export const userSection = {
  px: 2, py: 2, borderTop: '1px solid rgba(255,255,255,0.07)',
  display: 'flex', alignItems: 'center', gap: 1.5,
}
export const userAvatar = {
  width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13,
}
export const topBarTitle = { flexGrow: 1, fontWeight: 600 }
export const topBarRight = {
  display: 'flex', alignItems: 'center', gap: 0.5,
}
export const topBarAvatar = {
  width: 34, height: 34, bgcolor: 'primary.main',
  fontSize: 13, cursor: 'default',
}
