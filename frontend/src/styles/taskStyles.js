export const boardHeader = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', mb: 3,
}
export const boardHeaderLeft = {
  display: 'flex', alignItems: 'center', gap: 1,
}
export const column = { p: 2, borderRadius: 2, minHeight: 480 }
export const columnHeader = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', mb: 2,
}
export const columnDot = { width: 8, height: 8, borderRadius: '50%' }
export const columnBadge = { px: 1.5, py: 0.25, borderRadius: 10 }
export const taskCard = { mb: 1.5 }
export const taskCardContent = { p: 2, '&:last-child': { pb: 2 } }
export const taskRow1 = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'flex-start',
}
export const taskTitle = { flexGrow: 1, mr: 1, lineHeight: 1.4 }
export const taskDescription = {
  display: '-webkit-box', WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical', overflow: 'hidden',
}
export const taskMeta = {
  mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1,
  alignItems: 'center',
}
export const taskActions = {
  mt: 1.5, display: 'flex', justifyContent: 'flex-end',
  alignItems: 'center', gap: 0.5,
}
export const statusSelect = {
  fontSize: '0.75rem', height: 28,
  '& .MuiSelect-select': { py: 0.5, pr: 3 },
}
export const assigneeChip = { height: 22, fontSize: '0.7rem' }
