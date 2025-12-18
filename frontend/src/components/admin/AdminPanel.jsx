import React, { useState } from 'react';
import CourtsAdmin from './CourtsAdmin';
import EquipmentAdmin from './EquipmentAdmin';
import CoachesAdmin from './CoachesAdmin';
import PricingAdmin from './PricingAdmin';

const AdminPanel = () => {
  const [tab, setTab] = useState('courts');

  return (
    <div className="card">
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Management Dashboard</h2>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0' }}>
        {['courts', 'equipment', 'coaches', 'pricing'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: tab === t ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: tab === t ? 'white' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'courts' && <CourtsAdmin />}
      {tab === 'equipment' && <EquipmentAdmin />}
      {tab === 'coaches' && <CoachesAdmin />}
      {tab === 'pricing' && <PricingAdmin />}
    </div>
  );
};

export default AdminPanel;