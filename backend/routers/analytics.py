from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, auth, database

router = APIRouter()

@router.get("/analytics/tasks", response_model=dict)
def get_task_analytics(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    
    # 1. Fetch user's projects
    user_projects = db.query(models.Project).filter(models.Project.owner_id == current_user.id).all()
    project_ids = [p.id for p in user_projects]
    
    if not project_ids:
        return {
            "total_tasks": 0,
            "completed_tasks": 0,
            "pending_tasks": 0,
            "in_progress_tasks": 0,
            "tasks_per_project": [],
            "status_distribution": [],
            "assigned_to_me": 0,
            "created_by_me": 0
        }

    # 2. Fetch scoped tasks
    tasks = db.query(models.Task).filter(models.Task.project_id.in_(project_ids)).all()
    
    # Analyze
    total_tasks = len(tasks)
    pending_tasks = len([t for t in tasks if t.status == 'Pending'])
    in_progress_tasks = len([t for t in tasks if t.status == 'In Progress'])
    completed_tasks = len([t for t in tasks if t.status == 'Completed'])
    
    assigned_to_me = db.query(models.Task).filter(models.Task.assigned_to == current_user.id).count()
    created_by_me = db.query(models.Task).filter(models.Task.created_by == current_user.id).count()

    tasks_per_project = []
    for proj in user_projects:
        proj_tasks = [t for t in tasks if t.project_id == proj.id]
        tasks_per_project.append({
            "project_id": proj.id,
            "project_name": proj.project_name,
            "total": len(proj_tasks),
            "completed": len([t for t in proj_tasks if t.status == 'Completed']),
            "in_progress": len([t for t in proj_tasks if t.status == 'In Progress']),
            "pending": len([t for t in proj_tasks if t.status == 'Pending'])
        })

    status_distribution = [
        {"status": "Pending", "count": pending_tasks},
        {"status": "In Progress", "count": in_progress_tasks},
        {"status": "Completed", "count": completed_tasks}
    ]

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "in_progress_tasks": in_progress_tasks,
        "tasks_per_project": tasks_per_project,
        "status_distribution": status_distribution,
        "assigned_to_me": assigned_to_me,
        "created_by_me": created_by_me
    }
