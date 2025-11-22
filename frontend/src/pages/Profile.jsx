import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Edit2, Save, X, Key, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { injectGlobalStyles } from '../styles/colors';

export default function Profile() {
  useEffect(() => { injectGlobalStyles(); }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(data);
        setEditedProfile(data);
        setIsAdmin(data.role === 'InventoryManager');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('http://localhost:5000/api/profile', editedProfile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(data.user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      alert(error.response?.data?.error || 'Failed to update password');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <p style={{ color: 'var(--brown)', fontSize: 18 }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <main style={{ padding: 32, minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header Card */}
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, var(--brown) 0%, #8B6F47 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Avatar */}
              <div style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                fontWeight: 700,
                color: 'var(--brown)',
                border: '4px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                {profile.name ? profile.name[0].toUpperCase() : '?'}
              </div>

              {/* Info */}
              <div>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
                  {profile.name || 'User Profile'}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>
                    <Shield size={14} />
                    {profile.role || 'No role'}
                  </div>
                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--gold)', color: 'var(--brown)', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                      <CheckCircle size={14} />
                      Admin
                    </div>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.9, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={14} />
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {!isEditing ? (
                <button 
                  onClick={handleEdit} 
                  style={{
                    background: 'white',
                    color: 'var(--brown)',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleCancel}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid white',
                      padding: '10px 20px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    style={{
                      background: 'white',
                      color: 'var(--brown)',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <Save size={16} />
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Personal Information */}
            <div className="card">
              <h3 style={{ margin: 0, marginBottom: 20, fontSize: 18, fontWeight: 700, color: 'var(--brown)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <User size={20} />
                Personal Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8 }}>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="form-input"
                      placeholder="Enter full name"
                      style={{ fontSize: 14 }}
                    />
                  ) : (
                    <p style={{ margin: 0, fontSize: 15, color: 'var(--brown)', fontWeight: 500 }}>
                      {profile.name || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8 }}>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="form-input"
                      placeholder="Enter email"
                      style={{ fontSize: 14 }}
                    />
                  ) : (
                    <p style={{ margin: 0, fontSize: 15, color: 'var(--brown)', fontWeight: 500 }}>
                      {profile.email || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="card">
              <h3 style={{ margin: 0, marginBottom: 20, fontSize: 18, fontWeight: 700, color: 'var(--brown)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Shield size={20} />
                Work Information
              </h3>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8 }}>Role</label>
                {isEditing && isAdmin ? (
                  <select
                    value={editedProfile.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="form-input"
                    style={{ fontSize: 14 }}
                  >
                    <option value="WarehouseStaff">Warehouse Staff</option>
                    <option value="InventoryManager">Inventory Manager</option>
                  </select>
                ) : (
                  <p style={{ margin: 0, fontSize: 15, color: 'var(--brown)', fontWeight: 500 }}>
                    {profile.role || 'Not assigned'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Security */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ margin: 0, marginBottom: 16, fontSize: 18, fontWeight: 700, color: 'var(--brown)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Lock size={20} />
              Security
            </h3>
            <p style={{ margin: 0, marginBottom: 20, fontSize: 13, color: '#666' }}>
              Keep your account secure by updating your password regularly.
            </p>
            <button 
              onClick={() => setShowPasswordModal(true)} 
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '12px 20px' }}
            >
              <Key size={16} />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          onClick={() => setShowPasswordModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              width: 480,
              maxWidth: '94vw',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '2px solid var(--cream)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--cream)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Key size={20} color="var(--brown)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--brown)' }}>Change Password</h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Update your account password</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 8,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <X size={20} color="#666" />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--brown)', marginBottom: 8 }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="form-input"
                    placeholder="Enter current password"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--brown)', marginBottom: 8 }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="form-input"
                    placeholder="Enter new password"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--brown)', marginBottom: 8 }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="form-input"
                    placeholder="Confirm new password"
                    style={{ fontSize: 14 }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #eee',
              display: 'flex',
              gap: 10,
              background: '#fafafa'
            }}>
              <button 
                onClick={() => setShowPasswordModal(false)} 
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px 20px', fontSize: 14 }}
              >
                Cancel
              </button>
              <button 
                onClick={handlePasswordSubmit} 
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px 20px', fontSize: 14 }}
              >
                <Save size={16} />
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}