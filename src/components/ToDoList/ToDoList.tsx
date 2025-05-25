import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./ToDoList.css";  // Import file CSS riêng

interface Task {
  key: string;
  title: string;
  description: string;
}

const ToDoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const showModal = () => {
    setEditIndex(null);
    setNewTask({ title: "", description: "" });
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleInsert = () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      if (editIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = { ...updatedTasks[editIndex], ...newTask };
        setTasks(updatedTasks);
      } else {
        setTasks([...tasks, { key: `${tasks.length + 1}`, ...newTask }]);
      }
    }
    setModalVisible(false);
  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const editTask = (index: number) => {
    setEditIndex(index);
    setNewTask({ title: tasks[index].title, description: tasks[index].description });
    setModalVisible(true);
  };

  return (
    <div className="todo-container">
      <h2>All Tasks</h2>
      <Button type="primary" onClick={showModal}>+ Add Task</Button>

      <div className="task-grid">
        {tasks.map((task, index) => (
          <div key={task.key} className="task-card">
            <h3 className="task-title">{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-actions">
              <EditOutlined onClick={() => editTask(index)} />
              <DeleteOutlined onClick={() => deleteTask(index)} />
            </div>
          </div>
        ))}
      </div>

      <Modal 
        title={editIndex !== null ? "Edit Task" : "Add Task"} 
        visible={modalVisible} 
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button key="insert" type="primary" onClick={handleInsert}>
            {editIndex !== null ? "Update" : "Insert"}
          </Button>,
        ]}
      >
        <label>Title:</label>
        <Input 
          placeholder="Enter task title..." 
          value={newTask.title} 
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
        />

        <label>Description:</label>
        <Input.TextArea
          placeholder="Enter task description..." 
          value={newTask.description} 
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
        />
      </Modal>
    </div>
  );
};

export default ToDoList;
