#!/bin/bash
python -m pip install -r FastAPI_backend/requirements.txt
cd FastAPI_backend
python -m alembic upgrade head
python -m uvicorn main:app --host 127.0.0.1 --port 8061 --reload