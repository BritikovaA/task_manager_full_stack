<h2>Task manager project</h2>

To work, you will need Docker and Docker-compose installed. Installation instructions can be found here: Docker Engine Install and [Docker Compose Install](https://docs.docker.com/compose/install/).

To deploy a PostgreSQL database on your local machine, run the command `docker-compose up -d` from the root of the FastAPI project.
You can also add your secret key to SECRET_KEY in FastAPI_backend/task_manager_app/users/auth.py-file.

For further installation and setup, run the `startup_backend.sh` and `startup_frontend.sh` file. It will install the required libraries, apply migrations to the database, and start the FastAPI and React parts of the project(It may take some time).

Then, go to http://localhost:3000.
