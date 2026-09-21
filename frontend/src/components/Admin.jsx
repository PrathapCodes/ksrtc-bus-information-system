import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { formatId, IdWithTooltip } from '../utils.jsx';

export default function Admin(){
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState('');
  const [buses, setBuses] = useState([]);
  const [queries, setQueries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('places');
  const [formBus, setFormBus] = useState({
    from_place_id:'', to_place_id:'', class_of_service:'', via_places:'', departure_time:''
  });

  useEffect(()=>{ refreshPlaces(); }, []);

  const refreshPlaces = async () => {
    const p = await api.getPlaces();
    setPlaces(p);
  };

  const login = async () => {
    if (!username.trim() || !password.trim()) {
      alert('Please enter username and password');
      return;
    }
    try {
      const res = await api.login(username, password);
      setToken(res.token);
      alert('Logged in successfully!');
      await refreshPlaces();
      await loadBuses();
      await loadQueries();
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  const addPlace = async () => {
    if(!newPlace.trim()) {
      alert('Please enter a place name');
      return;
    }
    try {
      await api.addPlace(newPlace);
      setNewPlace('');
      await refreshPlaces();
      alert('Place added successfully!');
    } catch (err) {
      alert('Error adding place: ' + err.message);
    }
  };

  const removePlace = async (id) => {
    if(!confirm('Delete place?')) return;
    try {
      await api.deletePlace(id);
      await refreshPlaces();
      alert('Place deleted successfully!');
    } catch (err) {
      alert('Error deleting place: ' + err.message);
    }
  };

  const loadBuses = async () => {
    const all = await api.getBuses();
    setBuses(all);
  };

  const loadQueries = async () => {
    try {
      const allQueries = await api.getQueries();
      setQueries(allQueries);
      const unread = allQueries.filter(q => !q.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error loading queries:', err.message);
    }
  };

  const markQueryAsRead = async (id) => {
    try {
      await api.markQueryAsRead(id);
      await loadQueries();
    } catch (err) {
      alert('Error marking as read: ' + err.message);
    }
  };

  const deleteQuery = async (id) => {
    if (!confirm('Delete this query?')) return;
    try {
      await api.deleteQuery(id);
      await loadQueries();
      alert('Query deleted!');
    } catch (err) {
      alert('Error deleting query: ' + err.message);
    }
  };

  useEffect(()=>{ loadBuses(); }, []);

  const addBus = async () => {
    if (!formBus.from_place_id || !formBus.to_place_id) {
      alert('Please select both From and To places');
      return;
    }
    if (!formBus.class_of_service || !formBus.departure_time) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const payload = {
        from_place_id: formBus.from_place_id,
        to_place_id: formBus.to_place_id,
        class_of_service: formBus.class_of_service,
        via_places: formBus.via_places,
        departure_time: formBus.departure_time
      };
      await api.addBus(payload);
      setFormBus({ from_place_id:'', to_place_id:'', class_of_service:'', via_places:'', departure_time:''});
      await loadBuses();
      alert('Bus added successfully!');
    } catch (err) {
      alert('Error adding bus: ' + err.message);
    }
  };

  const removeBus = async (id) => {
    if(!confirm('Delete bus?')) return;
    try {
      await api.deleteBus(id);
      await loadBuses();
      alert('Bus deleted successfully!');
    } catch (err) {
      alert('Error deleting bus: ' + err.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUsername('');
    setPassword('');
  };

  return (
    <>
      <h2 className="search-title">
        <i className="bi bi-shield-lock" style={{color: '#d63031'}}></i>
        Admin Panel
      </h2>

      {!token ? (
        <div className="search-form">
          <div style={{maxWidth: '400px', margin: '0 auto'}}>
            <h4 style={{marginBottom: '20px', textAlign: 'center'}}>Admin Login</h4>
            <div className="form-row">
              <label>Username</label>
              <input 
                className="input" 
                placeholder="Enter username" 
                value={username} 
                onChange={e=>setUsername(e.target.value)} 
              />
            </div>
            <div className="form-row">
              <label>Password</label>
              <input 
                className="input" 
                placeholder="Enter password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                type="password" 
              />
            </div>
            <button onClick={login} style={{width: '100%'}}>
              <i className="bi bi-box-arrow-in-right"></i> Login
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Admin Header with Logout */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
            <h4 style={{margin: 0}}>Welcome Admin</h4>
            <button onClick={logout} style={{background: '#d63031', padding: '8px 16px'}}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '5px',
            marginBottom: '30px',
            borderBottom: '2px solid #dee2e6',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('places')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'places' ? 'linear-gradient(135deg, #d63031 0%, #e84e4e 100%)' : 'transparent',
                color: activeTab === 'places' ? '#fff' : '#636e72',
                border: 'none',
                borderBottom: activeTab === 'places' ? '3px solid #d63031' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'places' ? '700' : '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="bi bi-geo-alt"></i> Manage Places
            </button>
            <button
              onClick={() => setActiveTab('buses')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'buses' ? 'linear-gradient(135deg, #d63031 0%, #e84e4e 100%)' : 'transparent',
                color: activeTab === 'buses' ? '#fff' : '#636e72',
                border: 'none',
                borderBottom: activeTab === 'buses' ? '3px solid #d63031' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'buses' ? '700' : '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="bi bi-bus-front"></i> Manage Buses
            </button>
            <button
              onClick={() => setActiveTab('queries')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'queries' ? 'linear-gradient(135deg, #d63031 0%, #e84e4e 100%)' : 'transparent',
                color: activeTab === 'queries' ? '#fff' : '#636e72',
                border: 'none',
                borderBottom: activeTab === 'queries' ? '3px solid #d63031' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'queries' ? '700' : '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="bi bi-chat-dots"></i> Queries
              {unreadCount > 0 && (
                <span style={{
                  background: '#dc3545',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content - Places */}
          {activeTab === 'places' && (
            <div>
              <h3 className="search-title">
                <i className="bi bi-geo-alt" style={{color: '#d63031'}}></i>
                Manage Places
              </h3>
            
            <div className="search-form">
              <div style={{display:'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'end', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#2d3436', fontSize: '0.95rem'}}>Place Name</label>
                  <input 
                    className="input" 
                    placeholder="Enter place name" 
                    value={newPlace} 
                    onChange={e=>setNewPlace(e.target.value)} 
                  />
                </div>
                <button onClick={addPlace} style={{padding: '12px 18px', whiteSpace: 'nowrap', fontSize: '0.9rem', height: 'fit-content'}}>
                  <i className="bi bi-plus-lg"></i> Add
                </button>
              </div>
            </div>

            <div style={{overflowX: 'auto'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Place Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map(p => (
                    <tr key={p._id}>
                      <td><IdWithTooltip id={p._id} /></td>
                      <td>{p.name}</td>
                      <td>
                        <button 
                          onClick={()=>removePlace(p._id)}
                          style={{background: '#dc3545', padding: '6px 12px', fontSize: '0.9rem'}}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          )}

          {/* Tab Content - Buses */}
          {activeTab === 'buses' && (
            <div>
            <h3 className="search-title">
              <i className="bi bi-bus-front" style={{color: '#d63031'}}></i>
              Manage Buses
            </h3>
            
            <div className="search-form">
              <h5 style={{marginBottom: '20px', fontWeight: 600}}>Add New Bus</h5>
              <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: 600, color: '#2d3436', fontSize: '0.9rem'}}>From Place</label>
                  <select 
                    className="input" 
                    value={formBus.from_place_id} 
                    onChange={e=>setFormBus({...formBus, from_place_id:e.target.value})}
                  >
                    <option value="">Select From</option>
                    {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: 600, color: '#2d3436', fontSize: '0.9rem'}}>To Place</label>
                  <select 
                    className="input" 
                    value={formBus.to_place_id} 
                    onChange={e=>setFormBus({...formBus, to_place_id:e.target.value})}
                  >
                    <option value="">Select To</option>
                    {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: 600, color: '#2d3436', fontSize: '0.9rem'}}>Bus Class</label>
                  <input 
                    className="input" 
                    placeholder="AC/Non-AC" 
                    value={formBus.class_of_service} 
                    onChange={e=>setFormBus({...formBus, class_of_service:e.target.value})} 
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: 600, color: '#2d3436', fontSize: '0.9rem'}}>Via Places</label>
                  <input 
                    className="input" 
                    placeholder="comma separated" 
                    value={formBus.via_places} 
                    onChange={e=>setFormBus({...formBus, via_places:e.target.value})} 
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '6px', fontWeight: 600, color: '#2d3436', fontSize: '0.9rem'}}>Departure</label>
                  <input 
                    className="input" 
                    placeholder="HH:MM:SS" 
                    value={formBus.departure_time} 
                    onChange={e=>setFormBus({...formBus, departure_time:e.target.value})} 
                  />
                </div>
                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                  <button onClick={addBus} style={{width: '100%', padding: '10px 16px', fontSize: '0.95rem'}}>
                    <i className="bi bi-plus-lg"></i> Add Bus
                  </button>
                </div>
              </div>
            </div>

            <div style={{overflowX: 'auto'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th><i className="bi bi-tag"></i> Bus ID</th>
                    <th><i className="bi bi-geo-alt-fill"></i> From</th>
                    <th><i className="bi bi-geo-alt"></i> To</th>
                    <th><i className="bi bi-star"></i> Class</th>
                    <th><i className="bi bi-signpost-2"></i> Via</th>
                    <th><i className="bi bi-clock-history"></i> Departure</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map(b => (
                    <tr key={b.busid}>
                      <td><IdWithTooltip id={b.busid} /></td>
                      <td>{b.from_name}</td>
                      <td>{b.to_name}</td>
                      <td><span className="bus-class">{b.class_of_service}</span></td>
                      <td>{b.via_places}</td>
                      <td>{b.departure_time}</td>
                      <td>
                        <button 
                          onClick={()=>removeBus(b.busid)}
                          style={{background: '#dc3545', padding: '6px 12px', fontSize: '0.9rem'}}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          )}

          {/* Tab Content - Queries */}
          {activeTab === 'queries' && (
            <div>
            <h3 className="search-title">
              <i className="bi bi-chat-dots" style={{color: '#d63031'}}></i>
              User Queries {unreadCount > 0 && (
                <span style={{
                  background: '#dc3545',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  marginLeft: '10px'
                }}>
                  {unreadCount} Unread
                </span>
              )}
            </h3>

            {queries.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#636e72',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <i className="bi bi-inbox" style={{fontSize: '2rem', marginBottom: '10px', display: 'block'}}></i>
                <p>No queries received yet</p>
              </div>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{width: '10%'}}>Status</th>
                      <th style={{width: '20%'}}>Email</th>
                      <th style={{width: '15%'}}>Name</th>
                      <th style={{width: '20%'}}>Subject</th>
                      <th style={{width: '20%'}}>Message</th>
                      <th style={{width: '10%'}}>Date</th>
                      <th style={{width: '15%'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queries.map(q => (
                      <tr key={q._id} style={{background: q.is_read ? '#fff' : '#fff3cd'}}>
                        <td>
                          {q.is_read ? (
                            <span style={{color: '#28a745', fontWeight: 600}}>
                              <i className="bi bi-check-circle"></i> Read
                            </span>
                          ) : (
                            <span style={{color: '#dc3545', fontWeight: 600}}>
                              <i className="bi bi-envelope"></i> New
                            </span>
                          )}
                        </td>
                        <td><strong>{q.user_email}</strong></td>
                        <td>{q.user_name || '-'}</td>
                        <td>{q.query_subject || '-'}</td>
                        <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                          {q.query_message}
                        </td>
                        <td style={{fontSize: '0.85rem', color: '#636e72'}}>
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {!q.is_read && (
                            <button 
                              onClick={() => markQueryAsRead(q._id)}
                              style={{background: '#28a745', padding: '6px 10px', fontSize: '0.85rem', marginRight: '5px'}}
                            >
                              <i className="bi bi-check2"></i> Mark Read
                            </button>
                          )}
                          <button 
                            onClick={() => deleteQuery(q._id)}
                            style={{background: '#dc3545', padding: '6px 10px', fontSize: '0.85rem'}}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
