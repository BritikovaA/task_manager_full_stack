from fastapi import FastAPI, HTTPException
from models import STask
from task_dao import *
import uvicorn
from task_manager_app.users.router import router as router_users
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_users)


@app.get("/tasks/")
async def get_tasks():
    tasks = await TaskDao.get_tasks()
    return tasks


@app.get("/tasks/{task_id}")
async def get_task_by_id(task_id: int) -> STask | None:
    art_id = await TaskDao.get_task_by_id(task_id)
    return art_id


@app.post("/new_task")
async def add_task(task: STaskAdd) -> dict:
    logging.info(f"Received task: {task}")
    new_task_id = await TaskDao.add_task(task)
    if new_task_id:
        return {"message": "Task added", "id": new_task_id}
    else:
        raise HTTPException(status_code=400, detail="Something went wrong!")


@app.put("/update_task/{task_id}")
async def update_task(task_id: int, task: STaskAdd) -> dict:
    updated_task = await TaskDao.update_task(task_id, task)
    if updated_task:
        return {"message": "Task updated"}
    else:
        raise HTTPException(status_code=400, detail="Something went wrong!")


@app.delete("/delete_task/{task_id}")
async def update_task(task_id: int) -> dict:
    deleted_task = await TaskDao.delete_task(task_id)
    if deleted_task:
        return {"message": "Task deleted"}
    else:
        raise HTTPException(status_code=400, detail="Something went wrong!")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8061, reload=True)
