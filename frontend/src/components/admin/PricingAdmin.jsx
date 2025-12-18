import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { api } from '../../services/api';

const PricingAdmin = () => {
  const [rules, setRules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    rule_name: '',
    rule_type: 'time_based',
    multiplier_type: 'percentage',
    multiplier_value: '',
    priority: 0,
    conditions: {}
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    const data = await api.pricing.getRules();
    setRules(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        conditions: JSON.stringify(formData.conditions)
      };
      
      if (editingId) {
        await api.pricing.updateRule(editingId, submitData);
      } else {
        await api.pricing.create(submitData);
      }
      fetchRules();
      resetForm();
    } catch (err) {
      alert('Error saving pricing rule');
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setFormData({
      rule_name: rule.rule_name,
      rule_type: rule.rule_type,
      multiplier_type: rule.multiplier_type,
      multiplier_value: rule.multiplier_value,
      priority: rule.priority,
      conditions: rule.conditions || {}
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing rule?')) return;
    try {
      await api.pricing.delete(id);
      fetchRules();
    } catch (err) {
      alert('Error deleting pricing rule');
    }
  };

  const toggleRule = async (id, currentStatus) => {
    await api.pricing.updateRule(id, { is_active: !currentStatus });
    fetchRules();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      rule_name: '',
      rule_type: 'time_based',
      multiplier_type: 'percentage',
      multiplier_value: '',
      priority: 0,
      conditions: {}
    });
  };

  const updateConditions = (key, value) => {
    setFormData({
      ...formData,
      conditions: { ...formData.conditions, [key]: value }
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Pricing Rules Management</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-success">
          <Plus size={18} style={{ display: 'inline', marginRight: '6px' }} />
          Add Rule
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            {editingId ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2" style={{ marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Rule Name</label>
                <input
                  type="text"
                  value={formData.rule_name}
                  onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                  placeholder="e.g., Peak Hours Premium"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Rule Type</label>
                <select
                  value={formData.rule_type}
                  onChange={(e) => setFormData({ ...formData, rule_type: e.target.value, conditions: {} })}
                  style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                  required
                >
                  <option value="time_based">Time Based</option>
                  <option value="day_based">Day Based</option>
                  <option value="court_based">Court Based</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Multiplier Type</label>
                <select
                  value={formData.multiplier_type}
                  onChange={(e) => setFormData({ ...formData, multiplier_type: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Multiplier Value {formData.multiplier_type === 'percentage' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  value={formData.multiplier_value}
                  onChange={(e) => setFormData({ ...formData, multiplier_value: e.target.value })}
                  placeholder="e.g., 50"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Priority (Higher = Applied First)</label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                placeholder="e.g., 0"
              />
            </div>

            {formData.rule_type === 'time_based' && (
              <div className="grid grid-2" style={{ marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Start Time</label>
                  <input
                    type="time"
                    value={formData.conditions.start_time || ''}
                    onChange={(e) => updateConditions('start_time', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>End Time</label>
                  <input
                    type="time"
                    value={formData.conditions.end_time || ''}
                    onChange={(e) => updateConditions('end_time', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {formData.rule_type === 'day_based' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Days (0=Sunday, 6=Saturday)</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={(formData.conditions.days || []).includes(idx)}
                        onChange={(e) => {
                          const days = formData.conditions.days || [];
                          if (e.target.checked) {
                            updateConditions('days', [...days, idx]);
                          } else {
                            updateConditions('days', days.filter(d => d !== idx));
                          }
                        }}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formData.rule_type === 'court_based' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Court Types</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(formData.conditions.court_types || []).includes('indoor')}
                      onChange={(e) => {
                        const types = formData.conditions.court_types || [];
                        if (e.target.checked) {
                          updateConditions('court_types', [...types, 'indoor']);
                        } else {
                          updateConditions('court_types', types.filter(t => t !== 'indoor'));
                        }
                      }}
                    />
                    Indoor
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(formData.conditions.court_types || []).includes('outdoor')}
                      onChange={(e) => {
                        const types = formData.conditions.court_types || [];
                        if (e.target.checked) {
                          updateConditions('court_types', [...types, 'outdoor']);
                        } else {
                          updateConditions('court_types', types.filter(t => t !== 'outdoor'));
                        }
                      }}
                    />
                    Outdoor
                  </label>
                </div>
              </div>
            )}

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
        {rules.map((rule) => (
          <div key={rule.id} style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{rule.rule_name}</h4>
              <p style={{ color: '#666', textTransform: 'capitalize' }}>
                {rule.rule_type.replace('_', ' ')} - {rule.multiplier_type === 'percentage' ? `${rule.multiplier_value}%` : `₹${rule.multiplier_value}`}
              </p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>Priority: {rule.priority}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => toggleRule(rule.id, rule.is_active)}
                className={rule.is_active ? 'btn-success' : 'btn-secondary'}
              >
                {rule.is_active ? 'Active' : 'Inactive'}
              </button>
              <button onClick={() => handleEdit(rule)} className="btn-primary">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(rule.id)} className="btn-danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingAdmin;