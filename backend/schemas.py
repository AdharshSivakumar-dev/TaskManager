from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional
from datetime import datetime, date

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ProjectBase(BaseModel):
    project_name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    project_name: Optional[str] = None
    description: Optional[str] = None

class ProjectOut(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class TaskCreate(BaseModel):
    project_id: int
    title: str
    description: Optional[str] = None
    status: str = "Pending"
    due_date: Optional[date] = None

    @field_validator('title')
    @classmethod
    def title_min_length(cls, v):
        if len(v) < 1:
            raise ValueError('Title cannot be empty')
        return v

    @field_validator('status')
    @classmethod
    def status_allowed(cls, v):
        allowed = ["Pending", "In Progress", "Completed"]
        if v not in allowed:
            raise ValueError(f'Status must be one of {allowed}')
        return v

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = None

    @field_validator('status')
    @classmethod
    def status_allowed(cls, v):
        if v is not None:
            allowed = ["Pending", "In Progress", "Completed"]
            if v not in allowed:
                raise ValueError(f'Status must be one of {allowed}')
        return v

class TaskAssign(BaseModel):
    user_id: int

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    due_date: Optional[date] = None
    project_id: int
    created_by: int
    assigned_to: Optional[int] = None
    created_at: datetime
    assignee_name: Optional[str] = None
    creator_name: Optional[str] = None

    @model_validator(mode='wrap')
    @classmethod
    def add_names(cls, v, handler):
        if isinstance(v, dict):
            return handler(v)
        try:
            data = {c.name: getattr(v, c.name) for c in v.__table__.columns}
            data["assignee_name"] = v.assignee.name if getattr(v, "assignee", None) else None
            data["creator_name"] = v.creator.name if getattr(v, "creator", None) else None
            return handler(data)
        except Exception:
            return handler(v)

    model_config = {"from_attributes": True}

class NotificationOut(BaseModel):
    id: int
    user_id: int
    message: str
    is_read: bool
    created_at: datetime
    task_id: Optional[int]

    model_config = {"from_attributes": True}

class NotificationMarkRead(BaseModel):
    notification_ids: list[int]
