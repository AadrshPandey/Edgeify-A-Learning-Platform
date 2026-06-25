import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyHistory.css';

const MyHistory = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- FETCH HISTORY ---
  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      // Adjust the route prefix if necessary (e.g., /api/v1/history/...)
      const response = await fetch('/api/v1/history/myHistory', {
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch history');
      
      setHistoryItems(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // --- REMOVE SINGLE ITEM ---
  const handleRemove = async (videoId) => {
    try {
      const response = await fetch(`/api/v1/history/removeVideo/${videoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove video');
      }

      // Optimistically remove from UI
      setHistoryItems(prev => prev.filter(item => item.video_id?._id !== videoId));
    } catch (err) {
      alert(err.message);
    }
  };

  // --- CLEAR ALL HISTORY ---
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear your entire watch history? This cannot be undone.")) return;

    try {
      const response = await fetch('/api/v1/history/clearHistory', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to clear history');
      }

      // Empty the UI list
      setHistoryItems([]);
    } catch (err) {
      alert(err.message);
    }
  };

  // --- RENDER STATES ---
  if (isLoading) {
    return (
      <div className="history-loading-state">
        <div className="spinner"></div>
        <p>Loading your watch history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-error-state">
        <p>Error: {error}</p>
        <button onClick={fetchHistory}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="my-history-container">
      
      <div className="history-header">
        <div>
          <h2>Watch History</h2>
          <p>Keep track of the videos you've watched.</p>
        </div>
        {historyItems.length > 0 && (
          <button className="clear-all-btn" onClick={handleClearAll}>
            Clear All History
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="empty-history-state">
          <div className="empty-icon">🕒</div>
          <h3>Your watch history is empty</h3>
          <p>Videos you watch will show up here.</p>
          <Link to="/courses" className="browse-courses-btn">Browse Courses</Link>
        </div>
      ) : (
        <div className="history-list">
          {historyItems.map((item) => {
            const video = item.video_id;
            
            // Safety check: if the video was deleted from the DB but history remains
            if (!video) return null;

            return (
              <div key={item._id} className="history-card">
                
                {/* Thumbnail wrapped in a link to play */}
                <Link to={`/watch/${video._id}`} className="history-thumbnail">
                  <img 
                    src={video.thumbnail || "https://via.placeholder.com/250x140?text=No+Thumbnail"} 
                    alt={video.title} 
                  />
                  <div className="play-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </Link>
                
                {/* Details Section */}
                <div className="history-details">
                  <Link to={`/watch/${video._id}`} className="history-title">
                    {video.title}
                  </Link>
                  <p className="history-meta">
                    Watched on {new Date(item.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="history-desc">{video.description}</p>
                </div>

                {/* Remove Button */}
                <button 
                  className="remove-item-btn" 
                  onClick={() => handleRemove(video._id)}
                  title="Remove from history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyHistory;