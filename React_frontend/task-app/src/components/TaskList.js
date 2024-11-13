import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Container, Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');   
            const response = await axios.get('http://127.0.0.1:8061/tasks/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const sortedTasks = response.data.sort((a, b) => {
                const priorityOrder = { 'Low': 1, 'Middle': 2, 'High': 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            setTasks(sortedTasks);
        };
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8061/delete_task/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleStatusChange = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        const taskToUpdate = tasks.find(task => task.id === id);
        if (taskToUpdate) {
            const updatedTask = { ...taskToUpdate, status: newStatus };
            await axios.put(`http://127.0.0.1:8061/update_task/${id}`, updatedTask, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(tasks.map(task => task.id === id ? updatedTask : task));
        }
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedTask(prevTask => ({ ...prevTask, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.put(`http://127.0.0.1:8061/update_task/${selectedTask.id}`, selectedTask, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const response = await axios.get(`http://127.0.0.1:8061/tasks/${selectedTask.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const updatedTask = response.data;
        setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
        setShowEditModal(false);
    };

    const renderTasksByStatus = (status) => {
        const priorityOrder = { 'High': 1, 'Middle': 2, 'Low': 3 };
        return tasks
            .filter(task => task.status === status)
            .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
            .map(task => (
                <Card key={task.id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{task.title}</Card.Title>
                        <Card.Text>{task.text}</Card.Text>
                        <Card.Text>Status: {task.status.charAt(0).toUpperCase() + task.status.slice(1)}</Card.Text>
                        <Card.Text>Priority: {task.priority}</Card.Text>
                        <Button variant="danger" onClick={() => handleDelete(task.id)}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={() => handleEdit(task)} className="ms-2">
                            Edit
                        </Button>
                        <Button variant="success" onClick={() => handleStatusChange(task.id, 'done')} className="ms-2">
                            Done
                        </Button>
                    </Card.Body>
                </Card>
            ));
    };

    return (
        <Container className="mt-4">
            <Button variant="primary" as={Link} to="/task/new" className="mb-3">
                Create New Task
            </Button>
            <Row>
                <Col>
                    <h3>New</h3>
                    {renderTasksByStatus('new')}
                </Col>
                <Col>
                    <h3>In Progress</h3>
                    {renderTasksByStatus('in progress')}
                </Col>
                <Col>
                    <h3>Done</h3>
                    {renderTasksByStatus('done')}
                </Col>
            </Row>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTask && (
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={selectedTask.title}
                                    onChange={handleEditChange}
                                    placeholder="Enter task title"
                                />
                            </Form.Group>
                            <Form.Group controlId="formText">
                                <Form.Label>Text</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="text"
                                    value={selectedTask.text}
                                    onChange={handleEditChange}
                                    placeholder="Enter task text"
                                />
                            </Form.Group>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={selectedTask.status}
                                    onChange={handleEditChange}
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
                                    value={selectedTask.priority}
                                    onChange={handleEditChange}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Middle">Middle</option>
                                    <option value="High">High</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">
                                Save Changes
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default TaskList;
