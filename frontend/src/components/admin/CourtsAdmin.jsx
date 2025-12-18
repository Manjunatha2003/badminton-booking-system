import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { api } from '../../services/api';

const CourtsAdmin = () => {
  const [courts, setCourts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', court_type: 'indoor', base_price: '' });

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    const data = await api.courts.getAll();
    setCourts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.courts.update(editingId, formData);
      } else {
        await api.courts.create(formData);
      }
      fetchCourts();
      resetForm();
    } catch (err) {
      alert('Error saving court');
    }
  };

  const handleEdit = (court) => {
    setEditingId(court.id);
    setFormData({ name: court.name, court_type: court.court_type, base_price: court.base_price });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this court?')) return;
    try {
      await api.courts.delete(id);
      fetchCourts();
    } catch (err) {
      alert('Error deleting court');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    await api.courts.update(id, { is_active: !currentStatus });
    fetchCourts();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', court_type: 'indoor', base_price: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Courts Management</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-success">
          <Plus size={18} style={{ display: 'inline', marginRight: '6px' }} />
          Add Court
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            {editingId ? 'Edit Court' : 'Add New Court'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2" style={{ marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Court Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Indoor Court 1"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Court Type</label>
                <select
                  value={formData.court_type}
                  onChange={(e) => setFormData({ ...formData, court_type: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                  required
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Base Price (₹/hour)</label>
              <input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                placeholder="e.g., 500"
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
        {courts.map((court) => (
          <div key={court.id} style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{court.name}</h4>
              <p style={{ color: '#666', textTransform: 'capitalize' }}>{court.court_type} - ₹{court.base_price}/hour</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => toggleStatus(court.id, court.is_active)}
                className={court.is_active ? 'btn-success' : 'btn-secondary'}
              >
                {court.is_active ? 'Active' : 'Inactive'}
              </button>
              <button onClick={() => handleEdit(court)} className="btn-primary">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(court.id)} className="btn-danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtsAdmin;