'use client';

import React, { useState } from 'react';
import { Plus, X, Mail, Edit2, Check, Settings, ChevronUp, ChevronDown } from 'lucide-react';

type ScheduleType = {
  [key: string]: string[];
};

const HandoverApp = () => {
  const [weekNo, setWeekNo] = useState(32);
  const [defaultEmail, setDefaultEmail] = useState('nicky.leech@pa.media');
  const [emailFormat, setEmailFormat] = useState({
    subject: '{channel} - Week {week}',
    body: '{channel} for Week {week} is ready'
  });
  
  const [schedule, setSchedule] = useState<ScheduleType>({
    Saturday: ['BBC Radio 1', 'Channel 4'],
    Sunday: ['BBC One', 'ITV'],
    Monday: ['Radio 4', 'Channel 4', 'Channel 5'],
    Tuesday: ['Classic FM'],
    Wednesday: ['BBC One', 'BBC Two', 'ITV'],
    Thursday: ['Virgin Media One', 'RTE One'],
    Friday: ['BBC Radio Scotland', 'Channel 5']
  });

  const [editingWeek, setEditingWeek] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingFormat, setEditingFormat] = useState(false);
  const [newChannels, setNewChannels] = useState<{[key: string]: string}>({});
  const [sentEmails, setSentEmails] = useState(new Set<string>());

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const addChannel = (day: string) => {
    const channel = newChannels[day]?.trim();
    if (channel) {
      setSchedule(prev => ({
        ...prev,
        [day]: [...prev[day], channel]
      }));
      setNewChannels(prev => ({ ...prev, [day]: '' }));
    }
  };

  const removeChannel = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const moveChannel = (day: string, index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= schedule[day].length) return;

    setSchedule(prev => {
      const dayChannels = [...prev[day]];
      const [movedChannel] = dayChannels.splice(index, 1);
      dayChannels.splice(newIndex, 0, movedChannel);
      
      return {
        ...prev,
        [day]: dayChannels
      };
    });
  };

  const sendEmail = (channel: string, day: string) => {
    const subject = emailFormat.subject
      .replace('{channel}', channel)
      .replace('{week}', weekNo.toString());
    const body = emailFormat.body
      .replace('{channel}', channel)
      .replace('{week}', weekNo.toString());
    
    const mailtoLink = `mailto:${defaultEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    setSentEmails(prev => new Set([...prev, `${day}-${channel}`]));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Handover schedule</h1>
          
          {/* Week Number */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600 w-16">Week:</span>
            {editingWeek ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={weekNo}
                  onChange={(e) => setWeekNo(parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={() => setEditingWeek(false)}
                  className="p-1 text-gray-600 hover:text-gray-900"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium">{weekNo}</span>
                <button
                  onClick={() => setEditingWeek(true)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Email Address */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600 w-16">Email:</span>
            {editingEmail ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="email"
                  value={defaultEmail}
                  onChange={(e) => setDefaultEmail(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={() => setEditingEmail(false)}
                  className="p-1 text-gray-600 hover:text-gray-900"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-mono text-gray-700">{defaultEmail}</span>
                <button
                  onClick={() => setEditingEmail(true)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Email Format */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">Email format</span>
              <button
                onClick={() => setEditingFormat(!editingFormat)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Settings size={14} />
              </button>
            </div>
            
            {editingFormat && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Subject line</label>
                  <input
                    type="text"
                    value={emailFormat.subject}
                    onChange={(e) => setEmailFormat(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Message body</label>
                  <textarea
                    value={emailFormat.body}
                    onChange={(e) => setEmailFormat(prev => ({ ...prev, body: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500 resize-none"
                    rows={2}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Use {'{channel}'} and {'{week}'} as placeholders
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          {days.map(day => (
            <div key={day} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">{day}</h2>
              
              <div className="space-y-2 mb-4">
                {schedule[day].map((channel, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded group">
                    <span className="text-sm text-gray-700">{channel}</span>
                    <div className="flex items-center gap-1">
                      {/* Move up/down buttons */}
                      <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveChannel(day, index, 'up')}
                          disabled={index === 0}
                          className={`p-0.5 rounded transition-colors ${
                            index === 0 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Move up"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          onClick={() => moveChannel(day, index, 'down')}
                          disabled={index === schedule[day].length - 1}
                          className={`p-0.5 rounded transition-colors ${
                            index === schedule[day].length - 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Move down"
                        >
                          <ChevronDown size={12} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => sendEmail(channel, day)}
                        className={`p-1.5 rounded transition-colors ${
                          sentEmails.has(`${day}-${channel}`)
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Send email"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={() => removeChannel(day, index)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove channel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Channel */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add channel..."
                  value={newChannels[day] || ''}
                  onChange={(e) => setNewChannels(prev => ({ ...prev, [day]: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && addChannel(day)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={() => addChannel(day)}
                  className="px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                  title="Add channel"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Handover schedule • Week {weekNo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HandoverApp;