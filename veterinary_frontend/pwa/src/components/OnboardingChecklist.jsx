import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Sparkles, ChevronRight, X, ArrowUpRight, Trophy } from 'lucide-react';

export default function OnboardingChecklist({ setCurrentTab }) {
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('onboarding_completed') || '["profile"]');
    } catch (e) {
      return ['profile'];
    }
  });
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('onboarding_dismissed') === 'true';
  });

  const steps = [
    {
      id: 'profile',
      title: 'Clinic Profile & Working Hours',
      desc: 'Set clinic address, consultation timings & upload logo',
      tab: 'settings',
      badge: 'Step 1'
    },
    {
      id: 'staff',
      title: 'Invite Doctors & Reception Staff',
      desc: 'Add veterinarians, assistants and assign user roles',
      tab: 'staff',
      badge: 'Step 2'
    },
    {
      id: 'patient',
      title: 'Register Your First Patient & Pet',
      desc: 'Add owner contact, pet microchip ID & breed info',
      tab: 'pets',
      badge: 'Step 3'
    },
    {
      id: 'appointment',
      title: 'Schedule First Consultation',
      desc: 'Book an in-clinic visit or home visit slot',
      tab: 'appointments',
      badge: 'Step 4'
    },
    {
      id: 'billing',
      title: 'Generate First Digital Invoice',
      desc: 'Test POS billing, medicine charges & PDF receipts',
      tab: 'billing',
      badge: 'Step 5'
    }
  ];

  const toggleStep = (id, e) => {
    e.stopPropagation();
    let updated;
    if (completedSteps.includes(id)) {
      updated = completedSteps.filter(s => s !== id);
    } else {
      updated = [...completedSteps, id];
    }
    setCompletedSteps(updated);
    localStorage.setItem('onboarding_completed', JSON.stringify(updated));
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('onboarding_dismissed', 'true');
  };

  if (isDismissed) return null;

  const progressPercent = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1.75rem',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Emerald Accent Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #0f766e 0%, #14b8a6 50%, #06b6d4 100%)'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', marginTop: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
            color: '#ffffff',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)'
          }}>
            {progressPercent === 100 ? <Trophy size={22} /> : <Sparkles size={22} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 3px 0', letterSpacing: '-0.01em' }}>
              Clinic Setup & Onboarding Guide
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
              Complete these 5 quick steps to get your clinic running at 100% capacity.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          title="Dismiss guide"
          style={{
            background: '#f1f5f9',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '8px',
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginBottom: '0.45rem' }}>
          <span>Setup Progress</span>
          <span style={{ color: '#0f766e', fontWeight: 700 }}>{completedSteps.length} of {steps.length} Completed ({progressPercent}%)</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)',
            borderRadius: '999px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Checklist Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.85rem'
      }}>
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          return (
            <div
              key={step.id}
              onClick={() => setCurrentTab && setCurrentTab(step.tab)}
              style={{
                background: isDone ? '#f0fdfa' : '#f8fafc',
                border: isDone ? '1px solid #99f6e4' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isDone ? '0 2px 8px rgba(13, 148, 136, 0.08)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#0d9488';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = isDone ? '#99f6e4' : '#e2e8f0';
                e.currentTarget.style.boxShadow = isDone ? '0 2px 8px rgba(13, 148, 136, 0.08)' : 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: isDone ? '#ccfbf1' : '#e2e8f0',
                    color: isDone ? '#0f766e' : '#475569'
                  }}>
                    {step.badge}
                  </span>
                  <button
                    onClick={(e) => toggleStep(step.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDone ? '#0d9488' : '#94a3b8', padding: 0 }}
                    title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                  >
                    {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>
                </div>

                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: isDone ? '#0f766e' : '#0f172a',
                  marginBottom: '0.25rem',
                  textDecoration: isDone ? 'line-through' : 'none'
                }}>
                  {step.title}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  {step.desc}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                color: '#0d9488',
                fontWeight: 700,
                marginTop: '0.85rem'
              }}>
                Open {step.title.split(' ')[0]} <ArrowUpRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
