from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database

router = APIRouter()

@router.get("/tasks/assigned", response_model=List[schemas.TaskOut])
def get_assigned_tasks(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    tasks = db.query(models.Task).filter(models.Task.assigned_to == current_user.id).all()
    return tasks

@router.post("/tasks", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == task.project_id).first()
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to add tasks to this project")
        
    new_task = models.Task(
        title=task.title,
        description=task.description,
        status=task.status,
        due_date=task.due_date,
        project_id=task.project_id,
        created_by=current_user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/projects/{project_id}/tasks", response_model=List[schemas.TaskOut])
def get_project_tasks(project_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    # allow project owner OR anyone assigned a task to view project tasks
    if project.owner_id != current_user.id:
        has_task = db.query(models.Task).filter(models.Task.project_id == project_id, models.Task.assigned_to == current_user.id).first()
        if not has_task:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view tasks for this project")
            
    tasks = db.query(models.Task).filter(models.Task.project_id == project_id).all()
    return tasks

@router.put("/tasks/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    task_query = db.query(models.Task).filter(models.Task.id == task_id)
    task = task_query.first()
    
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    is_creator = task.created_by == current_user.id
    is_assignee = task.assigned_to == current_user.id
    
    if not is_creator and not is_assignee:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this task")
        
    if not is_creator and is_assignee:
        # Check if they are trying to update restricted fields
        if task_update.title is not None or task_update.description is not None or task_update.due_date is not None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Assignees can only update task status")
        if task_update.status is not None:
            task.status = task_update.status
            db.commit()
            db.refresh(task)
        return task
        
    # Creator can update all fields
    update_data = task_update.dict(exclude_unset=True)
    task_query.update(update_data, synchronize_session=False)
    db.commit()
    return task_query.first()

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    task_query = db.query(models.Task).filter(models.Task.id == task_id)
    task = task_query.first()
    
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    if task.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this task")
        
    task_query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Task deleted successfully"}

# TASK ASSIGNMENT (Module 4)

@router.post("/tasks/{task_id}/assign", response_model=schemas.TaskOut)
def assign_task(task_id: int, assign_data: schemas.TaskAssign, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    if task.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only task creator can assign")
        
    user = db.query(models.User).filter(models.User.id == assign_data.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    task.assigned_to = assign_data.user_id
    
    # Send Notification (Always trigger)
    if assign_data.user_id == task.created_by:
        message = f"You assigned the task '{task.title}' to yourself in project '{task.project.project_name}'"
    else:
        message = f"You have been assigned the task '{task.title}' in project '{task.project.project_name}'"

    new_notif = models.Notification(
        user_id=assign_data.user_id,
        message=message,
        task_id=task.id,
        is_read=False
    )
    db.add(new_notif)

    db.commit()
    db.refresh(task)
    return task

@router.get("/users", response_model=List[schemas.UserOut])
def get_users(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    users = db.query(models.User).all()
    return users
