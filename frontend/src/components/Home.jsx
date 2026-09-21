import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { IdWithTooltip } from '../utils.jsx';

export default function Home(){
  const [places, setPlaces] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ api.getPlaces().then(setPlaces).catch(()=>{}); }, []);

  const search = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const data = await api.getBuses({ from: from || undefined, to: to || undefined });
      setResults(data);
    } catch (err) {
      alert(err.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-icon">
          <i className="bi bi-bus-front"></i>
        </div>
        <h1>KSRTC Bus Information</h1>
        <p>Find and book buses with ease. Fast, reliable, and affordable travel</p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <h2 className="search-title">
          <i className="bi bi-search"></i>
          Search Buses
        </h2>
        
        <form onSubmit={search} className="search-form">
          <div className="row">
            <div className="col-md-5">
              <div className="form-row">
                <label htmlFor="from">
                  <i className="bi bi-geo-alt-fill" style={{color: '#d63031'}}></i> From
                </label>
                <select 
                  id="from"
                  className="input" 
                  value={from} 
                  onChange={e => setFrom(e.target.value)}
                >
                  <option value="">-- Select Location --</option>
                  {places.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="col-md-5">
              <div className="form-row">
                <label htmlFor="to">
                  <i className="bi bi-geo-alt" style={{color: '#d63031'}}></i> To
                </label>
                <select 
                  id="to"
                  className="input" 
                  value={to} 
                  onChange={e => setTo(e.target.value)}
                >
                  <option value="">-- Select Location --</option>
                  {places.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="col-md-2" style={{display: 'flex', alignItems: 'flex-end'}}>
              <button type="submit" style={{marginBottom: 0}} disabled={loading}>
                <i className="bi bi-search"></i> {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <h3>
          <i className="bi bi-bus-front" style={{color: '#d63031'}}></i>
          Available Buses ({results.length})
        </h3>

        {results.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">
              <i className="bi bi-inbox"></i>
            </div>
            <p>No buses found. Try searching with different locations.</p>
          </div>
        ) : (
          <div className="results-container">
            {results.map(r => (
              <div key={r.busid} className="bus-card">
                <div className="bus-card-header">
                  <IdWithTooltip id={r.busid} />
                  <span className="bus-class">{r.class_of_service}</span>
                </div>

                <div className="bus-route">
                  <span className="location-point">
                    <i className="bi bi-circle-fill"></i>
                  </span>
                  <span className="route-text">{r.from_name}</span>
                  <span className="route-arrow">→</span>
                  <span className="route-text">{r.to_name}</span>
                  <span className="location-point">
                    <i className="bi bi-circle-fill"></i>
                  </span>
                </div>

                <div className="bus-info">
                  <div className="info-item">
                    <i className="bi bi-clock-history" style={{color: '#d63031'}}></i>
                    <div>
                      <div className="info-label">Departure</div>
                      <div className="info-value">{r.departure_time}</div>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-tag" style={{color: '#d63031'}}></i>
                    <div>
                      <div className="info-label">Bus ID</div>
                      <div className="info-value"><IdWithTooltip id={r.busid} /></div>
                    </div>
                  </div>
                </div>

                {r.via_places && (
                  <div className="via-places">
                    <i className="bi bi-signpost-2" style={{marginRight: '8px', color: '#d63031'}}></i>
                    <strong>Via:</strong> {r.via_places}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
