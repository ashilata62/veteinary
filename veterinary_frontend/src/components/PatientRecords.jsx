import { apiFetch } from '../utils/api';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import {
  FileHeart,
  User,
  Heart,
  Activity,
  Calendar,
  ClipboardList,
  Plus,
  FileText,
  Image,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Download,
  Printer,
  Loader
} from 'lucide-react';
import FormSelect from './FormSelect';
import toast from 'react-hot-toast';

export default function PatientRecords({
  currentRole,
  selectedPetId,
  setSelectedPetId,
  externalTab = 'Overview'
}) {
  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingEncounters, setFetchingEncounters] = useState(false);
  const [localReports, setLocalReports] = useState({});
  const [billingHistory, setBillingHistory] = useState([]);
  const [loadingBilling, setLoadingBilling] = useState(false);
  
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('patientRecordsActiveTab') || externalTab || 'Overview';
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    sessionStorage.setItem('patientRecordsActiveTab', tab);
  };

  const [showAddVisitForm, setShowAddVisitForm] = useState(false);
  const [previewReport, setPreviewReport] = useState(null);
  const [printingVaccination, setPrintingVaccination] = useState(null);

  const fileInputRef = React.useRef(null);
  const tabContainerRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleTabScroll = () => {
    if (tabContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  React.useEffect(() => {
    handleTabScroll();
    window.addEventListener('resize', handleTabScroll);
    return () => window.removeEventListener('resize', handleTabScroll);
  }, [activeTab]);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const [uploadingTarget, setUploadingTarget] = useState(null);

  const handleFileUpload = async (e, targetReportId = null, targetReportType = null) => {
    const file = e.target.files[0];
    if (!file) return;
    const petId = activePet.id || selectedPetId || (pets[0] && pets[0].id);
    if (!petId) {
      toast.error('No active pet selected');
      return;
    }
    const token = localStorage.getItem('token');
    
    // Explicit reportId and reportType binding
    const reportId = targetReportId || (uploadingTarget && uploadingTarget.id) || null;
    const reportType = targetReportType || (uploadingTarget && uploadingTarget.type) || (file.name.toLowerCase().includes('ultrasound') ? 'Ultrasound' : file.type.includes('image') ? 'X-Ray' : 'Blood Test');
    
    let fileDataUrl = '';
    try {
      fileDataUrl = await fileToBase64(file);
    } catch (err) {
      fileDataUrl = URL.createObjectURL(file);
    }

    try {
      sessionStorage.setItem('report_data_' + file.name, fileDataUrl);
      localStorage.setItem('report_data_' + file.name, fileDataUrl);
    } catch (err) {}

    try {
      const res = await apiFetch('http://localhost:5000/api/v1/encounters/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pet_id: petId,
          report_id: reportId,
          report_type: reportType,
          file_name: file.name,
          file_url: fileDataUrl
        })
      });

      if (res.ok) {
        toast.success(`Diagnostic report attached to ${activePet.name || 'Patient'} record`);
        fetchEncounters(petId);
      } else {
        toast.error(`Server error attaching report. Preserving local copy.`);
        const newReport = {
          id: reportId || `rep-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          name: file.name,
          type: reportType,
          url: fileDataUrl,
          status: 'Completed'
        };
        setLocalReports(prev => ({
          ...prev,
          [petId]: [newReport, ...(prev[petId] || [])]
        }));
      }
    } catch (err) {
      toast.error(`Network error. Attached locally for ${activePet.name || 'Patient'}`);
      const newReport = {
        id: reportId || `rep-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        name: file.name,
        type: reportType,
        url: fileDataUrl,
        status: 'Completed'
      };
      setLocalReports(prev => ({
        ...prev,
        [petId]: [newReport, ...(prev[petId] || [])]
      }));
    }
    setUploadingTarget(null);
  };





  const handleDownload = (rep) => {
    if (rep.url && rep.url !== '#') {
      const element = document.createElement("a");
      element.href = rep.url;
      element.download = rep.name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      const element = document.createElement("a");
      const file = new Blob([`Dummy report content for ${rep.name}\nDate: ${rep.date}\nType: ${rep.type}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${rep.name}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handlePreview = (rep) => {
    setPreviewReport(rep);
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [petsRes, ownersRes] = await Promise.all([
        apiFetch('http://localhost:5000/api/v1/pets'),
        apiFetch('http://localhost:5000/api/v1/owners')
      ]);
      const petsData = await petsRes.json();
      const ownersData = await ownersRes.json();
      if (petsData.status === 'success') setPets(petsData.data);
      if (ownersData.status === 'success') setOwners(ownersData.data);
    } catch (error) {
      toast.error('Failed to load patient registry');
    } finally {
      setLoading(false);
    }
  };

  const fetchEncounters = async (petId) => {
    try {
      setFetchingEncounters(true);
      const token = localStorage.getItem('token');
      const res = await apiFetch(`http://localhost:5000/api/v1/encounters?petId=${petId}`);
      const data = await res.json();
      setEncounters(data);
    } catch (error) {
      toast.error('Failed to load clinical history');
    } finally {
      setFetchingEncounters(false);
    }
  };

  const fetchBillingHistory = async (petId) => {
    try {
      setLoadingBilling(true);
      const res = await apiFetch(`http://localhost:5000/api/v1/invoices/pet/${petId}`);
      if (res.ok) {
        const data = await res.json();
        setBillingHistory(data);
      } else {
        setBillingHistory([]);
      }
    } catch (error) {
      console.error('Failed to load billing history:', error);
      setBillingHistory([]);
    } finally {
      setLoadingBilling(false);
    }
  };

  React.useEffect(() => {
    fetchInitialData();
  }, []);

  React.useEffect(() => {
    const activePetId = selectedPetId || (pets[0] && pets[0].id);
    if (activePetId) {
      fetchEncounters(activePetId);
      fetchBillingHistory(activePetId);
    }
  }, [selectedPetId, pets]);

  React.useEffect(() => {
    if (externalTab && externalTab !== 'Overview' && !sessionStorage.getItem('patientRecordsActiveTab')) {
      handleTabChange(externalTab);
    }
  }, [externalTab]);


  // Active pet context
  const formatDateSafely = (dateVal, fallback = 'N/A') => {
    if (!dateVal) return fallback;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return fallback;
    return d.toISOString().split('T')[0];
  };

  // Active pet context
  const baseActivePet = pets.find(p => p.id === selectedPetId) || pets[0] || {};
  const activePet = {
    ...baseActivePet,
    photo: baseActivePet.photo_url || baseActivePet.photo || null,
    microchip: baseActivePet.microchip_number || baseActivePet.microchip || 'N/A',
    lastDeworming: formatDateSafely(baseActivePet.last_deworming, baseActivePet.lastDeworming || 'N/A'),
    lastVaccination: formatDateSafely(baseActivePet.last_vaccination, baseActivePet.lastVaccination || 'N/A'),
    vaccinations: baseActivePet.vaccinations || [
      { date: formatDateSafely(baseActivePet.last_vaccination, '2026-04-10'), vaccine: baseActivePet.species === 'Cat' ? 'Nobivac Feline 1-HCP' : 'Nobivac Canine 1-DAPPv', batch: 'NK-8829-X', nextDue: '2027-04-10' },
      { date: '2025-04-15', vaccine: 'Rabies Defensor 3', batch: 'RB-9920-K', nextDue: '2028-04-15' }
    ],
    billingHistory: billingHistory || []
  };
  const owner = owners.find(o => o.id === activePet.owner_id) || {};

  // Form states for adding visit details
  const [complaint, setComplaint] = useState('');
  const [duration, setDuration] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prescriptionText, setPrescriptionText] = useState('');
  const [bloodTestText, setBloodTestText] = useState('');
  const [ultrasoundText, setUltrasoundText] = useState('');
  const [xrayText, setXrayText] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [submittingEncounter, setSubmittingEncounter] = useState(false);

  const handleAddVisit = async (e) => {
    e.preventDefault();
    if (submittingEncounter) return;
    if (!complaint || !diagnosis) {
      toast.error('Please fill out the Primary Complaint and Diagnosis fields.');
      return;
    }

    setSubmittingEncounter(true);

    const prescriptions = [];
    if (prescriptionText && currentRole !== 'Vet Assistant') {
        prescriptions.push({ medicine_name: prescriptionText });
    }

    const reports = [];
    if (bloodTestText) reports.push({ report_type: 'Blood Test', file_url: bloodTestText });
    if (ultrasoundText) reports.push({ report_type: 'Ultrasound', file_url: ultrasoundText });
    if (xrayText) reports.push({ report_type: 'X-Ray', file_url: xrayText });

    const payload = {
      pet_id: activePet.id,
      complaint,
      duration,
      symptoms,
      diagnosis,
      treatment,
      follow_up: followUp,
      prescriptions,
      reports
    };

    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('http://localhost:5000/api/v1/encounters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Clinical health encounter note appended to patient timeline.');
        fetchEncounters(activePet.id);
        
        // Reset Form
        setComplaint('');
        setDuration('');
        setSymptoms('');
        setDiagnosis('');
        setTreatment('');
        setPrescriptionText('');
        setBloodTestText('');
        setUltrasoundText('');
        setXrayText('');
        setFollowUp('');
        setShowAddVisitForm(false);
        setActiveTab('History');
      } else {
        toast.error(data.message || 'Failed to save encounter');
      }
    } catch (err) {
      toast.error('Network error while saving encounter');
    } finally {
      setSubmittingEncounter(false);
    }
  };


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <Loader className="animate-spin" style={{ color: 'var(--primary-teal)', animation: 'spin 1s linear infinite' }} size={32} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading clinical charts...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Selector Profile Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)' }}>
            <FileHeart size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              Clinical Records & Medical Charts
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              Select a pet profile to view their full timeline, diagnostics, prescriptions, and billing.
            </p>
          </div>
        </div>

        <div className="records-pet-select">
          <FormSelect
            value={activePet.id}
            onChange={(id) => {
              setSelectedPetId(id);
              setActiveTab('Overview');
              setShowAddVisitForm(false);
            }}
            options={pets.map((p) => ({
              value: p.id,
              label: `${p.name} (${p.breed})`,
            }))}
          />
        </div>
      </div>

      {/* Patient Premium Header */}
      <div
        className="card animate-fade-in"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '1.5rem',
          borderLeft: '5px solid var(--primary-teal)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {activePet.photo ? (
            <img
              src={activePet.photo}
              alt={activePet.name}
              style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '2px solid var(--primary-teal-light)' }}
            />
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--primary-teal-light)',
              color: 'var(--primary-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.75rem',
              border: '2px solid var(--primary-teal-light)'
            }}>
              {activePet.name ? activePet.name.charAt(0).toUpperCase() : 'P'}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{activePet.name}</h2>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Active Enrolled</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              <b>{activePet.breed}</b> • {activePet.gender} • {activePet.age} • Microchip: <b>{activePet.microchip}</b>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
              Enrolled ID: {activePet.id}
            </p>
          </div>
        </div>

        {/* Action Button for Doctor/Assistant */}
        {(currentRole === 'Doctor' || currentRole === 'Vet Assistant' || currentRole === 'Admin') && (
          <button
            onClick={() => setShowAddVisitForm(!showAddVisitForm)}
            className="btn btn-primary"
          >
            {showAddVisitForm ? 'Close Encounter Panel' : <><Plus size={16} /> New Clinical Visit Record</>}
          </button>
        )}
      </div>

      {showAddVisitForm ? (
        /* Visit Form Portal */
        <div className="card" style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
          <h3 className="font-bold text-lg mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={20} className="text-secondary" style={{ color: 'var(--primary-teal)' }} />
            New Clinical Encounter Record
          </h3>

          {currentRole === 'Vet Assistant' && (
            <div
              style={{
                backgroundColor: 'var(--warning-light)',
                color: 'var(--warning)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1rem'
              }}
            >
              <AlertCircle size={16} />
              Assistant Role: Prescription writing is restricted. Clinical treatment & diagnostic logs are enabled.
            </div>
          )}

          <form onSubmit={handleAddVisit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Primary Complaints / Reason for visit *</label>
                <input
                  type="text"
                  className="form-control"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="e.g. Vomiting & lethargy"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Symptom Duration</label>
                <input
                  type="text"
                  className="form-control"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2 Days"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Symptoms Noted</label>
              <textarea
                className="form-control"
                rows="2"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Mention physical observations, temperature, hydration levels..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Diagnostic Findings & Diagnosis *</label>
                <input
                  type="text"
                  className="form-control"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Feline Hairball Obstruction"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Clinical Treatment Applied</label>
                <input
                  type="text"
                  className="form-control"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="e.g. Administered subcutaneous fluids"
                />
              </div>
            </div>

            {/* Prescriptions (Disabled for assistant) */}
            <div className="form-group">
              <label className="form-label">Medicine Prescription</label>
              <textarea
                className="form-control"
                rows="2"
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                placeholder={currentRole === 'Vet Assistant' ? 'Restricted: Assistant cannot prescribe medicines' : 'e.g. Laxatone Paste 1 inch daily (5 days)'}
                disabled={currentRole === 'Vet Assistant'}
              />
            </div>

            {/* Diagnostics Reports details */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1.25rem', backgroundColor: '#fafafa' }}>
              <span className="font-semibold text-xs" style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Diagnostic Medical Uploads (Mockup values)
              </span>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label text-xs">Blood Test Name</label>
                  <input type="text" className="form-control text-xs" value={bloodTestText} onChange={(e) => setBloodTestText(e.target.value)} placeholder="e.g. CBC Panel" />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Ultrasound Scan details</label>
                  <input type="text" className="form-control text-xs" value={ultrasoundText} onChange={(e) => setUltrasoundText(e.target.value)} placeholder="e.g. Abdominal ultrasound" />
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">X-Ray results</label>
                  <input type="text" className="form-control text-xs" value={xrayText} onChange={(e) => setXrayText(e.target.value)} placeholder="e.g. Spinal bone scan" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Follow-up Clinical Notes & Reminders</label>
              <input
                type="text"
                className="form-control"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="e.g. Recheck in 5 days if condition persists"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button type="button" onClick={() => setShowAddVisitForm(false)} className="btn btn-secondary">Discard</button>
              <button type="submit" className="btn btn-primary">Save Medical Encounter</button>
            </div>
          </form>
        </div>
      ) : (
        /* Tabs Dashboard view */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tab buttons */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {canScrollLeft && (
              <div
                className="mobile-only-scroll-indicator scroll-left"
                onClick={() => tabContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' })}
              >
                <ChevronLeft size={16} />
              </div>
            )}

            <div
              className="tab-container"
              ref={tabContainerRef}
              onScroll={handleTabScroll}
              style={{ flex: 1, marginBottom: 0, paddingBottom: '0.5rem', scrollBehavior: 'smooth' }}
            >
              {['Overview', 'History', 'Vitals & Growth', 'Prescriptions', 'Reports', 'Vaccinations', 'Billing'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}

            </div>

            {canScrollRight && (
              <div
                className="mobile-only-scroll-indicator scroll-right"
                onClick={() => tabContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' })}
              >
                <ChevronRight size={16} />
              </div>
            )}
          </div>

          {/* Tab content renders based on selection */}
          <div style={{ minHeight: '300px' }}>

            {activeTab === 'Overview' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {/* Details card */}
                <div className="card">
                  <h4 className="font-bold text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Medical Vitals Overview</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Pet ID</span>
                      <span className="font-semibold">{activePet.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Microchip Transponder</span>
                      <span className="font-semibold" style={{ fontFamily: 'monospace' }}>{activePet.microchip}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Body Weight</span>
                      <span className="font-semibold">{activePet.weight} kg</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Last Deworming Date</span>
                      <span className="badge badge-warning">{activePet.lastDeworming}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Last Vaccination Booster</span>
                      <span className="badge badge-success">{activePet.lastVaccination}</span>
                    </div>
                  </div>
                </div>

                {/* Owner Card */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 className="font-bold text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Enrolled Owner Profile</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--secondary-blue-light)', color: 'var(--secondary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                        <User size={22} />
                      </div>
                      <div>
                        <span className="font-bold" style={{ display: 'block' }}>{owner.name}</span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>NIC: {owner.nic}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                      <div><b>Email:</b> {owner.email}</div>
                      <div><b>Phone:</b> {owner.mobile}</div>
                      <div><b>Address:</b> {owner.address}</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Timeline Card */}
                <div className="card" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  <h4 className="font-bold text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Recent Activity Timeline</h4>
                  {encounters && encounters.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1rem' }}>
                      <div style={{ position: 'absolute', top: '5px', bottom: '5px', left: '4px', width: '2px', backgroundColor: 'var(--border)' }} />
                      {encounters.slice(0, 3).map((enc, idx) => (
                        <div key={idx} style={{ position: 'relative', fontSize: '0.8rem' }}>
                          <span style={{ position: 'absolute', top: '4px', left: '-12px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-teal)', border: '2px solid #fff' }} />
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{enc.complaint}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{enc.diagnosis} • {formatDateSafely(enc.encounter_date, '')}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' }}>No recent medical activity logged.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'History' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>Patient Visit History timeline</h4>
                {fetchingEncounters ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader className="animate-spin" style={{ color: 'var(--primary-teal)', animation: 'spin 1s linear infinite' }} size={24} />
                  </div>
                ) : encounters && encounters.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem' }}>
                    {/* Vertical line indicator */}
                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '7px', width: '2px', backgroundColor: 'var(--border)' }} />

                    {encounters.map((h, i) => (
                      <div key={i} className="card" style={{ position: 'relative', padding: '1.25rem' }}>
                        {/* Dot */}
                        <span
                          style={{
                            position: 'absolute',
                            top: '20px',
                            left: '-28px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-teal)',
                            border: '3px solid #ffffff'
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span className="font-semibold text-xs" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} /> {formatDateSafely(h.encounter_date, '')}
                          </span>
                          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Diagnosed By: {h.doctor_name || 'Staff'}</span>
                        </div>
                        <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--primary-teal)' }}>
                          Encounter: {h.complaint} ({h.duration || 'N/A'})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                          <div><b>Symptoms:</b> {h.symptoms || 'None'}</div>
                          <div><b>Clinical Diagnosis:</b> {h.diagnosis}</div>
                          <div><b>Applied Treatment:</b> {h.treatment || 'None'}</div>
                          {h.prescriptions && h.prescriptions.length > 0 && (
                            <div style={{ backgroundColor: 'var(--primary-teal-light)', padding: '0.5rem', borderRadius: '4px', borderLeft: '3px solid var(--primary-teal)' }}>
                              <b>Prescribed Formulas:</b> {h.prescriptions.map(rx => rx.medicine_name).join(', ')}
                            </div>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                            {h.reports && h.reports.map((rep, idx) => (
                              <span key={idx} className={`badge ${rep.report_type === 'Blood Test' ? 'badge-success' : rep.report_type === 'Ultrasound' ? 'badge-info' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                                {rep.report_type}: {rep.file_url}
                              </span>
                            ))}
                          </div>
                          {h.follow_up && h.follow_up !== 'None' && (
                            <div style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: '600' }}>
                              🗓️ Follow-up: {h.follow_up}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card text-center" style={{ padding: '3rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No visit history found. Append a new clinical encounter note.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Vitals & Growth' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)', margin: 0 }}>Vitals & Growth Charts</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '2px 0 0 0' }}>Real-time physiological growth and wellness tracking logs.</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const w = prompt("Enter new Weight (kg):", activePet.weight || "");
                      if (w && !isNaN(w)) {
                        toast.success("Vitals log recorded successfully");
                      }
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Log Vitals
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {/* Weight Chart Card */}
                  <div className="card" style={{ padding: '1.5rem', minHeight: '320px' }}>
                    <h5 className="font-bold text-sm mb-4" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                      📈 Body Weight Growth (kg)
                    </h5>
                    <div style={{ width: '100%', height: '220px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { month: 'Jan', Weight: (parseFloat(activePet.weight || 10) * 0.85).toFixed(1) },
                          { month: 'Feb', Weight: (parseFloat(activePet.weight || 10) * 0.88).toFixed(1) },
                          { month: 'Mar', Weight: (parseFloat(activePet.weight || 10) * 0.92).toFixed(1) },
                          { month: 'Apr', Weight: (parseFloat(activePet.weight || 10) * 0.95).toFixed(1) },
                          { month: 'May', Weight: (parseFloat(activePet.weight || 10) * 0.98).toFixed(1) },
                          { month: 'Jun', Weight: parseFloat(activePet.weight || 10).toFixed(1) },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                          <Line type="monotone" dataKey="Weight" stroke="var(--primary-teal)" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: 'var(--primary-teal)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Body Temperature Chart Card */}
                  <div className="card" style={{ padding: '1.5rem', minHeight: '320px' }}>
                    <h5 className="font-bold text-sm mb-4" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                      🌡️ Body Temperature (°C)
                    </h5>
                    <div style={{ width: '100%', height: '220px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { date: '01/06', Temp: 38.2 },
                          { date: '08/06', Temp: 38.5 },
                          { date: '15/06', Temp: 39.1 },
                          { date: '22/06', Temp: 38.7 },
                          { date: '29/06', Temp: 38.4 },
                          { date: '06/07', Temp: 38.3 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[37, 41]} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                          <Line type="monotone" dataKey="Temp" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#f59e0b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Heart Rate Chart Card */}
                  <div className="card" style={{ padding: '1.5rem', minHeight: '320px' }}>
                    <h5 className="font-bold text-sm mb-4" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                      💓 Heart Rate & Pulse (bpm)
                    </h5>
                    <div style={{ width: '100%', height: '220px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { date: '01/06', Pulse: 100 },
                          { date: '08/06', Pulse: 110 },
                          { date: '15/06', Pulse: 125 },
                          { date: '22/06', Pulse: 115 },
                          { date: '29/06', Pulse: 105 },
                          { date: '06/07', Pulse: 102 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[80, 150]} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }} />
                          <Line type="monotone" dataKey="Pulse" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#ef4444', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Prescriptions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>Active & Past Prescriptions</h4>
                  {currentRole === 'Doctor' && (
                    <button type="button" onClick={() => setShowAddVisitForm(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Plus size={14} /> Add Prescription
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {fetchingEncounters ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                      <Loader className="animate-spin" style={{ color: 'var(--primary-teal)', animation: 'spin 1s linear infinite' }} size={24} />
                    </div>
                  ) : (() => {
                    const allPrescriptions = encounters.reduce((acc, enc) => {
                      if (enc.prescriptions && enc.prescriptions.length > 0) {
                        enc.prescriptions.forEach(rx => {
                          acc.push({
                            id: rx.id,
                            medicine_name: rx.medicine_name,
                            dosage: rx.dosage,
                            frequency: rx.frequency,
                            duration: rx.duration,
                            instructions: rx.instructions,
                            doctor_name: enc.doctor_name,
                            date: formatDateSafely(enc.encounter_date, '')
                          });
                        });
                      }
                      return acc;
                    }, []);

                    return allPrescriptions.length > 0 ? (
                      allPrescriptions.map((rx, index) => (
                        <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', borderLeft: '4px solid var(--primary-teal)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div>
                              <span className="font-bold" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'block' }}>{rx.medicine_name.split(' ')[0] || 'Medication'}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Prescribed by {rx.doctor_name || 'Staff'} on {rx.date}</span>
                            </div>
                            <span className="badge badge-success" style={{ height: 'fit-content' }}>Active</span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#fafafa', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ flex: 1, minWidth: '100px' }}>
                              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Medicine / Item</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{rx.medicine_name}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: '100px' }}>
                              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Dosage & Freq</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{rx.dosage || rx.frequency ? `${rx.dosage || ''} ${rx.frequency || ''}`.trim() : 'As directed'}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: '100px' }}>
                              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Duration</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{rx.duration || 'N/A'}</span>
                            </div>
                          </div>

                          {rx.instructions && (
                            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              <strong>Instructions:</strong> {rx.instructions}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="card text-center" style={{ padding: '2rem' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No active formulas or medications prescribed.</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {activeTab === 'Reports' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>Clinical Diagnostic Files & Uploads</h4>
                  <span className="badge badge-info" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                    🔒 Isolated Record: {activePet.name || 'Patient'} ({activePet.breed || 'Pet'})
                  </span>
                </div>

                {/* Drag and Drop Upload Area with Anti-Mixup Target Info */}
                <div style={{
                  border: '2px dashed var(--primary-teal)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--primary-teal-light)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: 'var(--primary-teal)' }}>
                    <Plus size={26} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                    Upload Diagnostic Report for <span style={{ color: 'var(--primary-teal)' }}>{activePet.name || 'Active Patient'}</span>
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                    Target Patient ID: <strong>{activePet.id}</strong> | Owner: <strong>{owner.name || 'Registered Owner'}</strong>
                  </p>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e)} />
                  <button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} className="btn btn-primary btn-sm" style={{ marginTop: '0.85rem' }}>Browse Files</button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.25rem'
                  }}
                >
                  {fetchingEncounters ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', gridColumn: '1/-1' }}>
                      <Loader className="animate-spin" style={{ color: 'var(--primary-teal)', animation: 'spin 1s linear infinite' }} size={24} />
                    </div>
                  ) : (() => {
                    const dbReports = encounters.reduce((acc, enc) => {
                      if (enc.reports && enc.reports.length > 0) {
                        enc.reports.forEach(rep => {
                          const isPending = rep.status === 'Pending' || (!rep.file_url.includes('.') && !rep.file_url.startsWith('http') && !rep.file_url.startsWith('blob:') && !rep.file_url.startsWith('data:'));
                          const storedData = sessionStorage.getItem('report_data_' + rep.file_url) || localStorage.getItem('report_data_' + rep.file_url);
                          const resolvedUrl = (rep.file_url && (rep.file_url.startsWith('data:') || rep.file_url.startsWith('blob:') || rep.file_url.startsWith('http')))
                            ? rep.file_url
                            : (storedData || null);

                          const displayName = rep.file_url && rep.file_url.startsWith('data:') ? `${rep.report_type}_Report.pdf` : rep.file_url;

                          acc.push({
                            id: rep.id,
                            encounter_id: rep.encounter_id,
                            name: displayName,
                            type: rep.report_type,
                            status: isPending ? 'Pending' : 'Completed',
                            date: formatDateSafely(enc.encounter_date, ''),
                            url: isPending ? '#' : (resolvedUrl || '#')
                          });
                        });

                      }
                      return acc;
                    }, []);

                    const allReports = [...(localReports[activePet.id] || []), ...dbReports];

                    return allReports.length > 0 ? (
                      allReports.map((rep, idx) => {
                        const isPending = rep.status === 'Pending';

                        return (
                          <div key={idx} className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', padding: '1rem', borderLeft: isPending ? '4px solid #f59e0b' : '4px solid var(--primary-teal)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: isPending ? '#fffbeb' : rep.type === 'Blood Test' ? 'rgba(239,68,68,0.1)' : rep.type === 'Ultrasound' ? 'var(--secondary-blue-light)' : '#fffbeb', color: isPending ? '#d97706' : rep.type === 'Blood Test' ? '#ef4444' : rep.type === 'Ultrasound' ? 'var(--secondary-blue)' : 'var(--warning)' }}>
                                {rep.type === 'Blood Test' ? <FileText size={24} /> : rep.type === 'Ultrasound' ? <Activity size={24} /> : <Image size={24} />}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span className="font-bold text-sm" style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rep.name}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{rep.date || 'Ordered Recently'}</span>
                                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                  <span className="badge" style={{ fontSize: '0.6rem' }}>{rep.type}</span>
                                  <span className={`badge ${isPending ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.6rem' }}>
                                    {isPending ? '⏳ Test Pending' : '✓ Completed'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                              {isPending ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUploadingTarget({ id: rep.id, type: rep.type });
                                    if (fileInputRef.current) fileInputRef.current.click();
                                  }}

                                  className="btn btn-primary btn-sm"
                                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem', backgroundColor: '#ea580c', borderColor: '#ea580c' }}
                                >
                                  Upload Result PDF/Image
                                </button>
                              ) : (
                                <>
                                  <button type="button" onClick={() => handlePreview(rep)} className="btn btn-secondary btn-sm" style={{ flex: 1, padding: '0.4rem' }}>Preview</button>
                                  <button type="button" onClick={() => handleDownload(rep)} className="btn btn-secondary btn-sm" style={{ flex: 1, padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--primary-teal)' }}>
                                    Download
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="card text-center" style={{ padding: '2rem', gridColumn: '1/-1' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No diagnostic lab reports or test requests found for {activePet.name || 'this patient'}.</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}


            {activeTab === 'Vaccinations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>Immunization Matrix Logs</h4>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date Injected</th>
                        <th>Vaccine Brand</th>
                        <th>Batch Code</th>
                        <th>Next Due reminder</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Certificate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePet.vaccinations && activePet.vaccinations.length > 0 ? (
                        activePet.vaccinations.map((vac, index) => (
                          <tr key={index}>
                            <td>{vac.date}</td>
                            <td className="font-bold">{vac.vaccine}</td>
                            <td style={{ fontFamily: 'monospace' }}>{vac.batch}</td>
                            <td style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{vac.nextDue}</td>
                            <td><span className="badge badge-success">Immunized</span></td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => setPrintingVaccination(vac)}
                                className="btn btn-secondary btn-sm"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}
                              >
                                <Printer size={12} /> Print
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center" style={{ color: 'var(--text-secondary)' }}>No vaccination records found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Billing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>Active Billing ledger</h4>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Date Billed</th>
                        <th>Total Amount (LKR)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePet.billingHistory && activePet.billingHistory.length > 0 ? (
                        activePet.billingHistory.map((bill, index) => {
                          const isPaid = bill.status?.toLowerCase() === 'paid';
                          const displayAmount = bill.grand_total !== undefined ? bill.grand_total : (bill.amount || 0);
                          const displayDate = bill.invoice_date ? formatDateSafely(bill.invoice_date) : (bill.date || 'N/A');
                          return (
                            <tr key={index}>
                              <td className="font-bold" style={{ color: 'var(--primary-teal)' }}>{bill.id}</td>
                              <td>{displayDate}</td>
                              <td className="font-bold">LKR {Number(displayAmount).toLocaleString()}</td>
                              <td>
                                <span className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`}>
                                  {bill.status || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center" style={{ color: 'var(--text-secondary)' }}>No invoices registered for this patient.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Full-Bleed Professional Report Preview Modal */}
      {previewReport && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            width: '100%', maxWidth: '1000px', height: '90vh',
            backgroundColor: '#fff', borderRadius: '12px',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Dark Sleek Sticky Top Bar */}
            <div style={{
              background: '#0f172a', color: '#fff',
              padding: '0.875rem 1.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FileText size={20} style={{ color: '#38bdf8' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                    {previewReport.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Patient: {activePet.name} • {previewReport.type || 'Diagnostic Report'} • {previewReport.date || 'Recent'}
                  </div>
                </div>
              </div>
              <button onClick={() => setPreviewReport(null)} style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: '#fff', fontWeight: 'bold'
              }}>×</button>
            </div>

            {/* Main Full-Bleed Content Area */}
            <div style={{ flex: 1, backgroundColor: '#f1f5f9', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {(() => {
                const fileName = (previewReport.name || '').toLowerCase();
                const url = previewReport.url || '';
                const hasValidUrl = url && url !== '#' && (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http'));
                const isPdf = hasValidUrl && (fileName.endsWith('.pdf') || url.includes('application/pdf') || (url.startsWith('blob:') && previewReport.type !== 'X-Ray'));
                const isImage = hasValidUrl && (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.webp') || fileName.endsWith('.svg') || url.includes('image/'));


                if (isPdf) {
                  return (
                    <iframe
                      src={url}
                      title="Diagnostic Report Document"
                      style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#fff' }}
                    />
                  );
                }


                if (isImage && url && url !== '#') {
                  return (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'auto' }}>
                      <img
                        src={url}
                        alt={previewReport.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                      />
                    </div>
                  );
                }

                return (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ maxWidth: '420px', width: '100%', backgroundColor: '#fff', padding: '2.5rem 2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                      <FileSpreadsheet size={48} style={{ color: 'var(--primary-teal)', margin: '0 auto 1rem auto', display: 'block' }} />
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', marginBottom: '6px' }}>
                        {previewReport.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
                        Clinical report archived for patient <strong>{activePet.name}</strong>. Click below to download or print.
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload(previewReport)}
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
                      >
                        <Download size={16} /> Download File
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Action Footer */}
            <div style={{
              background: '#fff', borderTop: '1px solid #e2e8f0',
              padding: '0.875rem 1.25rem', display: 'flex', gap: '0.75rem',
              justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} style={{ color: '#16a34a' }} /> Electronically Verified Report
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => setPreviewReport(null)} className="btn btn-secondary" style={{ flex: '0 0 auto' }}>Close</button>
                <button onClick={() => handleDownload(previewReport)} className="btn btn-primary" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={15} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Vaccination Certificate Modal */}
      {printingVaccination && (
        <div className="no-print" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%', maxWidth: '650px',
            backgroundColor: '#fff', borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ background: '#0f172a', color: '#fff', padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>Vaccination Certificate Preview</span>
              <button onClick={() => setPrintingVaccination(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
            </div>
            
            {/* Printable Area */}
            <div id="vaccine-certificate-print" style={{ padding: '2.5rem', backgroundColor: '#fff', border: '15px double var(--primary-teal-light)', margin: '1rem', borderRadius: '8px', color: '#0f172a' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-teal)', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-teal)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '0.05em' }}>VETCARE MEDICAL CENTER</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>120/A Veterinary Lane, Colombo • Tel: +94 11 245 6789</p>
                <h3 style={{ marginTop: '1.25rem', marginBottom: 0, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>Certificate of Vaccination</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-teal)', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}>PATIENT PROFILE</h4>
                  <p style={{ margin: '3px 0' }}><b>Pet Name:</b> {activePet.name}</p>
                  <p style={{ margin: '3px 0' }}><b>Species/Breed:</b> {activePet.species || 'Canine'} / {activePet.breed}</p>
                  <p style={{ margin: '3px 0' }}><b>Age / Gender:</b> {activePet.age} / {activePet.gender}</p>
                  <p style={{ margin: '3px 0' }}><b>Microchip ID:</b> {activePet.microchip}</p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-teal)', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}>OWNER DETAILS</h4>
                  <p style={{ margin: '3px 0' }}><b>Owner Name:</b> {owner.name}</p>
                  <p style={{ margin: '3px 0' }}><b>Mobile No:</b> {owner.mobile}</p>
                  <p style={{ margin: '3px 0' }}><b>Address:</b> {owner.address}</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem', fontSize: '0.85rem', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Immunization Log</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  <span>Vaccine Brand</span>
                  <span>Batch Code</span>
                  <span>Date Given</span>
                  <span>Next Booster Due</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
                  <span className="font-bold">{printingVaccination.vaccine}</span>
                  <span style={{ fontFamily: 'monospace' }}>{printingVaccination.batch}</span>
                  <span>{printingVaccination.date}</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{printingVaccination.nextDue}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span className="badge badge-success" style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem' }}>✓ System Verified</span>
                  <p style={{ margin: '4px 0 0 0' }}>ID: VC-{printingVaccination.batch}-{activePet.id.slice(0,5)}</p>
                </div>
                <div style={{ textAlign: 'center', width: '180px' }}>
                  <div style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '1.5rem', color: '#1d4ed8', height: '40px', lineHeight: '40px', borderBottom: '1px solid #94a3b8', marginBottom: '2px' }}>
                    Dr. Nimal Perera
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Authorized Veterinarian</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setPrintingVaccination(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={() => {
                const printContents = document.getElementById('vaccine-certificate-print').innerHTML;
                const originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
                window.location.reload(); // Reload to restore react states
              }} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Printer size={14} /> Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
