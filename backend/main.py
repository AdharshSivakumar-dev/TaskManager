from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, projects, tasks, analytics, notifications

app = FastAPI(title="Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router,          prefix="/auth", tags=["Auth"])
app.include_router(projects.router,      prefix="",      tags=["Projects"])
app.include_router(tasks.router,         prefix="",      tags=["Tasks"])
app.include_router(analytics.router,     prefix="",      tags=["Analytics"])
app.include_router(notifications.router, prefix="",      tags=["Notifications"])


@app.get("/")
def root():
    return {"message": "Task Manager API is running"}
