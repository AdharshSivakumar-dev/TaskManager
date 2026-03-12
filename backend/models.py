from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    projects = relationship("Project", back_populates="owner")
    created_tasks = relationship("Task", foreign_keys="Task.created_by", back_populates="creator")
    assigned_tasks = relationship("Task", foreign_keys="Task.assigned_to", back_populates="assignee")
    notifications = relationship("Notification", back_populates="recipient", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Pending")
    due_date = Column(Date, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())

    project = relationship("Project", back_populates="tasks")
    creator = relationship("User", foreign_keys=[created_by], back_populates="created_tasks")
    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="assigned_tasks")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=func.now())
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)

    recipient = relationship("User", back_populates="notifications")
    task = relationship("Task", foreign_keys=[task_id])
