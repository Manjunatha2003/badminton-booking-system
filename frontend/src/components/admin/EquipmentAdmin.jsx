import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { api } from '../../services/api';

const EquipmentAdmin = () => {
  const [equipment, setEquipment] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', total_quantity: '', rental_price: '' });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    const data = await api.equipment.getAll();
    setEquipment(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.equipment.update(editingId, formData);
      } else {
        await api.equipment.create(formData);
      }
      fetchEquipment();
      resetForm();
    } catch (err) {
      alert('Error saving equipment');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ 
      name: item.name, 
      total_quantity: item.total_quantity, 
      rental_price: item.rental_price 
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;
    try {
      await api.equipment.delete(id);
      fetchEquipment();
    } catch (err) {
      alert('Error deleting equipment');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', total_quantity: '', rental_price: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Equipment Management</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-success">
          <Plus size={18} style={{ display: 'inline', marginRight: '6px' }} />
          Add Equipment
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            {editingId ? 'Edit Equipment' : 'Add New Equipment'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2" style={{ marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Equipment Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Badminton Racket"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Total Quantity</label>
                <input
                  type="number"
                  value={formData.total_quantity}
                  onChange={(e) => setFormData({ ...formData, total_quantity: e.target.value })}
                  placeholder="e.g., 10"
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Rental Price (₹/hour)</label>
              <input
                type="number"
                value={formData.rental_price}
                onChange={(e) => setFormData({ ...formData, rental_price: e.target.value })}
                placeholder="e.g., 50"
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
        {equipment.map((item) => (
          <div key={item.id} style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{item.name}</h4>
              <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
                <span>Total: <strong>{item.total_quantity}</strong></span>
                <span>Available: <strong style={{ color: '#10b981' }}>{item.available_quantity}</strong></span>
                <span>Price: <strong style={{ color: '#667eea' }}>₹{item.rental_price}/hour</strong></span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(item)} className="btn-primary">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="btn-danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentAdmin;