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
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      border: '1px solid rgba(20, 184, 166, 0.3)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1.75rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            color: '#ffffff',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.4)'
          }}>
            {progressPercent === 100 ? <Trophy size={22} /> : <Sparkles size={22} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: '0 0 2px 0' }}>
              Clinic Setup & Onboarding Guide
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
              Complete these 5 quick steps to get your clinic running at 100% capacity.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          title="Dismiss guide"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.35rem',
            borderRadius: '6px'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.4rem' }}>
          <span>Setup Progress</span>
          <span style={{ color: '#2dd4bf' }}>{completedSteps.length} of {steps.length} Completed ({progressPercent}%)</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #14b8a6 0%, #2dd4bf 100%)',
            borderRadius: '999px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Checklist Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.75rem'
      }}>
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          return (
            <div
              key={step.id}
              onClick={() => setCurrentTab && setCurrentTab(step.tab)}
              style={{
                background: isDone ? 'rgba(20, 184, 166, 0.08)' : 'rgba(30, 41, 59, 0.6)',
                border: isDone ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isDone ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    color: isDone ? '#2dd4bf' : '#94a3b8'
                  }}>
                    {step.badge}
                  </span>
                  <button
                    onClick={(e) => toggleStep(step.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDone ? '#2dd4bf' : '#64748b', padding: 0 }}
                    title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                  >
                    {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                </div>

                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isDone ? '#e2e8f0' : '#ffffff',
                  marginBottom: '0.2rem',
                  textDecoration: isDone ? 'line-through' : 'none',
                  opacity: isDone ? 0.8 : 1
                }}>
                  {step.title}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.35 }}>
                  {step.desc}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: '#2dd4bf',
                fontWeight: 600,
                marginTop: '0.75rem'
              }}>
                Open {step.title.split(' ')[0]} <ArrowUpRight size={13} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
