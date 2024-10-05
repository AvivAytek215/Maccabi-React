import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Stadium.css';
const getSectionColor = (name) => {
  switch (name) {
    case 'Bottom West': return '#98FB98';
    case 'Top West': return '#90EE90';
    case 'Bottom East': return '#ADD8E6';
    case 'Top East': return '#87CEEB';
    case 'Bottom South': return '#FFB3BA';
    case 'Top South': return '#FFC0CB';
    case 'North': return '#FFDAB9';
    case 'Gold': return '#FFD700';
    case 'VIP': return '#DDA0DD';
    case 'Corner': return '#98FB98';
    default: return '#CCCCCC';
  }
};
const StadiumLayout = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { gameId } = useParams();


  
  useEffect(() => {
    const fetchSections = async () => {
      if (!gameId) {
        setError('No game ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/sections/${gameId}`);
        setSections(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sections:', err);
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching sections');
        setLoading(false);
      }
    };

    fetchSections();
  }, [gameId]);

  if (loading) return <div>Loading sections...</div>;
  if (error) return <div>Error: {error}</div>;
  if (sections.length === 0) return <div>No sections available for this game.</div>;
  const handleSectionClick = (section) => {
    navigate(`/section/${section.id}`);
  };

  
  const renderSection = (section) => {
    let x, y, width, height;
    
    switch (section.name) {
      case 'Bottom West':
        x = 150; y = 210 + (section.id - 101) * 30; width = 50; height = 30;
        break;
      case 'Top West':
        x = 100; y = 210+ (section.id - 201) * 30; width = 50; height = 30;
        break;
      case 'Bottom East':
        x = 800; y = 210 + (section.id - 123) * 30; width = 50; height = 30;
        break;
      case 'Top East':
        x = 850; y =210 + (section.id - 229) * 30; width = 50; height = 30;
        break;
      case 'Bottom South':
        x = 200 + (section.id - 301) * 50; y = 450; width = 50; height = 50;
        break;
      case 'Top South':
        x = 200 + (section.id - 214) * 50; y = 500; width = 50; height = 50;
        break;
      case 'North':
        x = 200 + (section.id - 109) * 50; y = 180; width = 50; height = 30;
        break;
      case 'Gold':
        x = 200 + (section.id - 401) * 50; y = 150; width = 50; height = 30;
        break;
      case 'VIP':
        x = 200 + (section.id - 1) * 40; y = 110; width = 40; height = 40;
        break;
      case 'Corner':
        return renderCorner(section);
      default:
        x = 0; y = 0; width = 0; height = 0;
    }

    return (
      <g key={section.id}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={getSectionColor(section.name)}
          stroke="white"
          strokeWidth="1"
          onClick={() => handleSectionClick(section)}
          className="stadium-section cursor-pointer"
        />
        <text
          x={x + width/2}
          y={y + height/2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize="10"
          className="section-label"
        >
          {section.id}
        </text>
      </g>
    );
  };
  
  const renderCorner = (section) => {
    let cx, cy, startAngle, endAngle, radius;
    switch (section.id) {
      case 'NW': 
        cx = 200; cy = 210; 
        startAngle = Math.PI; endAngle = 3*Math.PI/2;
        radius = 100;
        break;
      case 'NE': 
        cx = 800; cy = 210; 
        startAngle = 3*Math.PI/2; endAngle = 2*Math.PI;
        radius = 100;
        break;
      case 'SE': 
        cx = 800; cy = 450; 
        startAngle = 0; endAngle = Math.PI/2;
        radius = 100;
        break;
      case 'SW': 
        cx = 200; cy = 450; 
        startAngle = Math.PI/2; endAngle = Math.PI;
        radius = 100;
        break;
      default: return null;
    }
    
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    return (
      <g key={section.id}>
        <path
          d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
          fill={getSectionColor('Corner')}
          stroke="white"
          strokeWidth="1"
          onClick={() => handleSectionClick(section)}
          className="stadium-section cursor-pointer"
        />
        <text
          x={cx + (radius/2) * Math.cos((startAngle + endAngle) / 2)}
          y={cy + (radius/2) * Math.sin((startAngle + endAngle) / 2)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize="12"
          className="section-label"
        >
          {section.id}
        </text>
      </g>
    );
  };
  
  const renderField = () => (
    <g className="football-field">
      <rect x="200" y="210" width="600" height="240" fill="#4CAF50" stroke="white" strokeWidth="2" />
      <rect x="210" y="220" width="580" height="220" fill="none" stroke="white" strokeWidth="2" />
      <line x1="500" y1="220" x2="500" y2="440" stroke="white" strokeWidth="2" />
      <circle cx="500" cy="330" r="40" fill="none" stroke="white" strokeWidth="2" />
      <rect x="210" y="270" width="90" height="120" fill="none" stroke="white" strokeWidth="2" />
      <rect x="700" y="270" width="90" height="120" fill="none" stroke="white" strokeWidth="2" />
      <rect x="210" y="300" width="30" height="60" fill="none" stroke="white" strokeWidth="2" />
      <rect x="760" y="300" width="30" height="60" fill="none" stroke="white" strokeWidth="2" />
    </g>
  );
    // Create an object to store unique sections
    const uniqueSections = {};
    sections.forEach(section => {
      if (!uniqueSections[section.name]) {
        uniqueSections[section.name] = {
          name: section.name,
          price: section.price,
          color: section.color // Assume we have added color to our section data
        };
      }
    });
  return (
    <div className="stadium-layout-container">
      <h1 className="stadium-title">Maccabi React Stadium</h1>
      <div className="stadium-svg-container">
        <svg viewBox="0 0 1000 600" className="stadium-svg">
          {renderField()}
          {sections.map(renderSection)}
          {['NW', 'NE', 'SE', 'SW'].map(id => renderCorner({ id, name: 'Corner' }))}
        </svg>
      </div>
      <div className="legend-container">
        {Object.values(uniqueSections).map(section => (
          <div key={section.name} className="legend-section">
            <h2 className="legend-title">{section.name}:</h2>
            <div className="legend-item">
              <span 
                className="legend-color-box" 
                style={{backgroundColor:getSectionColor(section.name)}}
              ></span>
              Price: {section.price}₪
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StadiumLayout;
