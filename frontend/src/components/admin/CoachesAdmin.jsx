import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { api } from '../../services/api';

const CoachesAdmin = () => {
  const [coaches, setCoaches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', specialization: '', hourly_rate: '' });

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    const data = await api.coaches.getAll();
    setCoaches(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.coaches.update(editingId, formData);
      } else {
        await api.coaches.create(formData);
      }
      fetchCoaches();
      resetForm();
    } catch (err) {
      alert('Error saving coach');
    }
  };

  const handleEdit = (coach) => {
    setEditingId(coach.id);
    setFormData({ 
      name: coach.name, 
      specialization: coach.specialization, 
      hourly_rate: coach.hourly_rate 
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coach?')) return;
    try {
      await api.coaches.delete(id);
      fetchCoaches();
    } catch (err) {
      alert('Error deleting coach');
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    await api.coaches.update(id, { is_available: !currentStatus });
    fetchCoaches();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', specialization: '', hourly_rate: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Coaches Management</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-success">
          <Plus size={18} style={{ display: 'inline', marginRight: '6px' }} />
          Add Coach
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            {editingId ? 'Edit Coach' : 'Add New Coach'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2" style={{ marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Coach Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Coach Rajesh"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Singles Specialist"
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Hourly Rate (₹/hour)</label>
              <input
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                placeholder="e.g., 800"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-success">
                <Save size={18} style={{ display: 'inline', marginRight: '6px' }} />
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                <X size={18} style={{ display: 'inline', marginRight: '6px' }} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {coaches.map((coach) => (
          <div key={coach.id} style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{coach.name}</h4>
              <p style={{ color: '#666' }}>{coach.specialization} - ₹{coach.hourly_rate}/hour</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => toggleAvailability(coach.id, coach.is_available)}
                className={coach.is_available ? 'btn-success' : 'btn-secondary'}
              >
                {coach.is_available ? 'Available' : 'Unavailable'}
              </button>
              <button onClick={() => handleEdit(coach)} className="btn-primary">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(coach.id)} className="btn-danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachesAdmin;