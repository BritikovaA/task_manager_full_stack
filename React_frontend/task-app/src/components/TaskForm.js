import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

function TaskForm() {
    const navigate = useNavigate();
    const [task, setTask] = useState({ title: '', text: '', status: 'new', priority: 'Low' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prevTask => ({ ...prevTask, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://127.0.0.1:8061/new_task', task, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/tasks');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1 className="mt-4">Create New Task</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                    />
                </Form.Group>
                <Form.Group controlId="formText">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="text"
                        value={task.text}
                        onChange={handleChange}
                        placeholder="Enter task text"
                    />
                </Form.Group>
                <Form.Group controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                        as="select"
                        name="status"
                        value={task.status}
                        onChange={handleChange}
                    >
                        <option value="new">New</option>
                        <option value="in progress">In Progress</option>
                        <option value="done">Done</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formPriority">
                    <Form.Label>Priority</Form.Label>
                    <Form.Control
                        as="select"
                        name="priority"
                        value={task.priority}
                        onChange={handleChange}
                    >
                        <option value="Low">Low</option>
                        <option value="Middle">Middle</option>
                        <option value="High">High</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Create Task
                </Button>
            </Form>
        </Container>
    );
}

export default TaskForm;
