import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Clock, AlertTriangle, Syringe, TestTube, Activity, Plus, X } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function AssistanceTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    patient_name: '',
    doctor_name: 'Dr. Sarah Connor',
    task_type: 'Treatment',
    priority: 'Medium',
    scheduled_time: 'ASAP',
    notes: ''
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('http://localhost:5000/api/v1/assistance-tasks');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setTasks(data.data);
        } else {
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error('Failed to fetch assistance tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTasks();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'var(--danger)';
      case 'High': return '#ea580c';
      case 'Medium': return 'var(--secondary-blue)';
      default: return 'var(--primary-teal)';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return 'badge-danger';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-info';
      default: return 'badge-success';
    }
  };

  const markComplete = async (id) => {
    try {
      const res = await apiFetch(`http://localhost:5000/api/v1/assistance-tasks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Completed' })
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
      } else {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
      }
    } catch (err) {
      console.error('Error marking task complete:', err);
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.patient_name) return;

    try {
      const res = await apiFetch('http://localhost:5000/api/v1/assistance-tasks', {
        method: 'POST',
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        await fetchTasks();
        setShowModal(false);
        setNewTask({
          title: '',
          patient_name: '',
          doctor_name: 'Dr. Sarah Connor',
          task_type: 'Treatment',
          priority: 'Medium',
          scheduled_time: 'ASAP',
          notes: ''
        });
      }
    } catch (err) {
      console.error('Error creating task:', err);
      const created = { ...newTask, id: Date.now(), status: 'Pending' };
      setTasks([created, ...tasks]);
      setShowModal(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ClipboardList size={28} style={{ color: 'var(--primary-teal)' }} /> Operational Assistance Tasks
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Manage and track treatment support, surgery preps, and emergency tasks assigned by doctors.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
        >
          <Plus size={18} /> Assign New Task
        </button>
      </div>

      {/* Task Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading operational tasks...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {tasks.map((task) => (
            <div key={task.id} className="card hover-lift" style={{ borderTop: `4px solid ${getPriorityColor(task.priority)}`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`badge ${getPriorityBadge(task.priority)}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{task.priority} Priority</span>
                <span className={`badge ${task.status === 'Completed' ? 'badge-success' : task.status === 'In Progress' ? 'badge-info' : 'badge-secondary'}`} style={{ fontSize: '0.65rem' }}>
                  {task.status}
                </span>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>{task.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                  {task.task_type === 'Lab Test' || task.type === 'Lab Test' ? <TestTube size={14} /> : task.task_type === 'Treatment' || task.type === 'Treatment' ? <Syringe size={14} /> : task.task_type === 'Emergency' || task.type === 'Emergency' ? <AlertTriangle size={14} /> : <Activity size={14} />} 
                  {task.task_type || task.type}
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned By:</span>
                  <span style={{ fontWeight: 600 }}>{task.doctor_name || task.doctor}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Patient:</span>
                  <span style={{ fontWeight: 600 }}>{task.patient_name || task.patient}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Scheduled Time:</span>
                  <span style={{ fontWeight: 600, color: task.priority === 'Critical' ? 'var(--danger)' : 'inherit' }}>{task.scheduled_time || task.time}</span>
                </div>
              </div>

              {task.status !== 'Completed' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(task.task_type === 'Lab Test' || task.type === 'Lab Test') && (
                    <>
                      <input 
                        type="file" 
                        id={`task-upload-${task.id}`}
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          try {
                            let fileDataUrl = '';
                            try {
                              const reader = new FileReader();
                              fileDataUrl = await new Promise((res, rej) => {
                                reader.readAsDataURL(file);
                                reader.onload = () => res(reader.result);
                                reader.onerror = err => rej(err);
                              });
                            } catch (e) {
                              fileDataUrl = URL.createObjectURL(file);
                            }

                            try {
                              sessionStorage.setItem('report_data_' + file.name, fileDataUrl);
                              localStorage.setItem('report_data_' + file.name, fileDataUrl);
                            } catch (e) {}

                            const repType = (task.title || '').toLowerCase().includes('ultrasound') ? 'Ultrasound'
                              : (task.title || '').toLowerCase().includes('x-ray') ? 'X-Ray'
                              : 'Blood Test';

                            const token = localStorage.getItem('token');
                            await apiFetch('http://localhost:5000/api/v1/encounters/reports', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                pet_id: task.patient_id,
                                report_type: repType,
                                file_name: file.name,
                                file_url: fileDataUrl
                              })
                            });
                          } catch (err) {
                            console.error('Error uploading task report:', err);
                          }
                          await markComplete(task.id);
                        }}
                      />

                      <button 
                        onClick={() => document.getElementById(`task-upload-${task.id}`)?.click()}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', backgroundColor: '#ea580c', borderColor: '#ea580c' }}
                      >
                        📤 Upload Report & Complete
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => markComplete(task.id)}
                    className="btn btn-secondary btn-sm" 
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                  >
                    <CheckCircle2 size={14} /> Mark as Completed
                  </button>
                </div>
              )}
            </div>

          ))}
        </div>
      )}

      {/* Modal for Assigning New Task */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Assign Support Task to Vet Assistant</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Draw Blood for CBC, Prepare Surgery Room"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Patient Name / Breed *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bella (Golden Retriever)"
                  value={newTask.patient_name}
                  onChange={e => setNewTask({ ...newTask, patient_name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newTask.task_type}
                    onChange={e => setNewTask({ ...newTask, task_type: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  >
                    <option value="Treatment">Treatment</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Surgery Prep">Surgery Prep</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  >
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Scheduled Time</label>
                <input
                  type="text"
                  placeholder="e.g. ASAP or 10:30 AM"
                  value={newTask.scheduled_time}
                  onChange={e => setNewTask({ ...newTask, scheduled_time: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create & Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
