export const popoverPaper = {
  width: 340, maxHeight: 440,
  display: 'flex', flexDirection: 'column', overflow: 'hidden',
}
export const panelHeader = {
  px: 2, py: 1.5,
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}
export const panelBody = { overflowY: 'auto', flexGrow: 1 }
export const emptyState = { py: 4, textAlign: 'center' }
export const emptyIcon = { fontSize: 36, color: 'text.secondary' }
export const notifItem = (isRead) => ({
  bgcolor: isRead ? 'transparent' : 'rgba(124,106,247,0.06)',
})
export const notifButton = { py: 1.5, px: 2, alignItems: 'flex-start' }
export const notifIcon = { minWidth: 34, mt: 0.25 }
export const notifIconStyle = (isRead) => ({
  fontSize: 18,
  color: isRead ? 'text.secondary' : 'primary.light',
})
export const notifMessage = { lineHeight: 1.4, pr: 1, fontSize: '0.8rem' }
export const deleteBtn = { ml: 'auto', mt: -0.5, flexShrink: 0 }
export const markReadBtn = { fontSize: '0.75rem', p: 0.5 }
