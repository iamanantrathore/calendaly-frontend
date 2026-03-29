import { useState, useEffect } from 'react';
import { Plus, Zap } from 'lucide-react';
import EventTypeCard from '../components/EventTypeCard';
import EventTypeModal from '../components/EventTypeModal';

export default function EventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  // Utility functions for localStorage
  const getStoredEventTypes = () => {
    try {
      const data = localStorage.getItem('calendaly_event_types');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const setStoredEventTypes = (data) => {
    try {
      localStorage.setItem('calendaly_event_types', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store event types:', error);
    }
  };

  function fetchEventTypes() {
    try {
      const data = getStoredEventTypes();
      setEventTypes(data);
    } catch {
      setError('Failed to load event types');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEventTypes();
  }, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(et) {
    setEditing(et);
    setModalOpen(true);
  }

  function handleSave(form) {
    const currentTypes = getStoredEventTypes();
    
    if (editing) {
      // Update existing
      const updated = currentTypes.map(et => 
        et.id === editing.id ? { ...form, id: editing.id } : et
      );
      setStoredEventTypes(updated);
    } else {
      // Create new
      const newType = { ...form, id: Date.now() };
      setStoredEventTypes([...currentTypes, newType]);
    }
    
    setModalOpen(false);
    fetchEventTypes();
  }

  async function handleDelete(et) {
    if (!window.confirm(`Delete "${et.name}"? This cannot be undone.`)) return;
    
    const currentTypes = getStoredEventTypes();
    const filtered = currentTypes.filter(type => type.id !== et.id);
    setStoredEventTypes(filtered);
    fetchEventTypes();
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
          <p className="text-gray-500 mt-1">Create and manage your meeting types. Each event type has a unique public booking link.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          New Event Type
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Event Types List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventTypes.map((et) => (
              <div key={et.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-full h-1 rounded-full mb-4" style={{ backgroundColor: et.color || '#0069ff' }} />
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{et.name}</h3>
                {et.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{et.description}</p>
                )}
                <div className="flex items-center gap-1 mb-2 text-sm text-gray-600">
                  <Clock size={14} />
                  <span>{et.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Public link:</span>
                  <a
                    href={`/${et.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline break-all"
                  >
                    {window.location.origin}/{et.slug}
                  </a>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(et)} className="btn-secondary text-xs">Edit</button>
                  <button onClick={() => handleDelete(et)} className="btn-danger text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
          <Zap size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No event types yet</h3>
          <p className="text-gray-500 mb-6">Create your first event type to get started</p>
          <button onClick={openCreate} className="btn-primary">
            Create Event Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventTypes.map((et) => (
            <EventTypeCard
              key={et.id}
              eventType={et}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <EventTypeModal
          eventType={editing}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
