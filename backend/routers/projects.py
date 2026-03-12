from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database

router = APIRouter()

@router.post("/projects", response_model=schemas.ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_project = models.Project(
        project_name=project.project_name,
        description=project.description,
        owner_id=current_user.id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/projects", response_model=List[schemas.ProjectOut])
def get_projects(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    projects = db.query(models.Project).filter(models.Project.owner_id == current_user.id).all()
    return projects

@router.get("/projects/{project_id}", response_model=schemas.ProjectOut)
def get_project(project_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    if project.owner_id != current_user.id:
        has_task = db.query(models.Task).filter(models.Task.project_id == project_id, models.Task.assigned_to == current_user.id).first()
        if not has_task:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view project")
            
    return project

@router.put("/projects/{project_id}", response_model=schemas.ProjectOut)
def update_project(project_id: int, project_update: schemas.ProjectUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    project_query = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    project = project_query.first()
    
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    update_data = project_update.dict(exclude_unset=True)
    project_query.update(update_data, synchronize_session=False)
    db.commit()
    return project_query.first()

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    project_query = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    project = project_query.first()
    
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    project_query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Project deleted successfully"}
