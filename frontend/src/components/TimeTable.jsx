import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { IdWithTooltip } from '../utils.jsx';

export default function TimeTable(){
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ api.getPlaces().then(setPlaces).catch(()=>{}); }, []);

  const load = async () => {
    if(!selected) return alert('Select place');
    setLoading(true);
    try {
      const res = await api.getTimetable(selected);
      setTimetable(res);
    } finally { setLoading(false); }
  };

  return (
    <>
      <h2 className="search-title">
        <i className="bi bi-calendar-event" style={{color: '#d63031'}}></i>
        Time Table
      </h2>
      
      <div className="search-form" style={{marginBottom: '30px'}}>
        <div className="form-row">
          <label htmlFor="place-select">
            <i className="bi bi-geo-alt" style={{color: '#d63031'}}></i> Select Place
          </label>
          <select 
            id="place-select"
            className="input" 
            value={selected} 
            onChange={e => setSelected(e.target.value)}
          >
            <option value="">-- Select a place --</option>
            {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <button onClick={load} style={{marginTop: '10px'}} disabled={loading}>
          <i className="bi bi-search"></i> {loading ? 'Loading...' : 'Show Timetable'}
        </button>
      </div>

      <h3 className="search-title" style={{marginTop: '30px'}}>
        <i className="bi bi-bus-front" style={{color: '#d63031'}}></i>
        Buses ({timetable.length})
      </h3>

      {timetable.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">
            <i className="bi bi-inbox"></i>
          </div>
          <p>No buses available for the selected place.</p>
        </div>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th><i className="bi bi-tag"></i> BusID</th>
                <th><i className="bi bi-geo-alt-fill"></i> From</th>
                <th><i className="bi bi-geo-alt"></i> To</th>
                <th><i className="bi bi-star"></i> Class</th>
                <th><i className="bi bi-signpost-2"></i> Via</th>
                <th><i className="bi bi-clock-history"></i> Departure</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map(b => (
                <tr key={b.busid}>
                  <td><IdWithTooltip id={b.busid} /></td>
                  <td>{b.from_name}</td>
                  <td>{b.to_name}</td>
                  <td><span className="bus-class">{b.class_of_service}</span></td>
                  <td>{b.via_places}</td>
                  <td><strong>{b.departure_time}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
