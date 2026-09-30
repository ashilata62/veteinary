import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, XCircle, ShieldCheck, Zap, PhoneCall, Cloud, 
  Activity, PieChart, Users, Calendar, CreditCard, User, 
  Settings, TrendingUp, Shield, FileText, Smartphone, LayoutDashboard,
  Mail, MessageSquare, Briefcase, PlusSquare, Heart, RefreshCw,
  ThumbsUp, Lock, Globe, ArrowRight, Clock, Box
} from 'lucide-react';
import './BrochurePage.css';
import RegisterModal from './RegisterModal';

export default function BrochurePage() {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free-trial');

  const handleRegister = (planId = 'free-trial') => {
    setSelectedPlan(planId);
    setShowRegisterModal(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="vcb3-page dark-theme">
      
      {/* TOP HEADER */}
      <header className="vcb3-header">
        <div className="vcb3-logo" onClick={() => navigate('/')}>
          <img src="/kt-logo.png" alt="PetCare Pro" className="vcb3-logo-img" />
          <div className="vcb3-logo-text">
            <h2>PetCare <span>Pro</span></h2>
            <p>Veterinary Management SaaS</p>
          </div>
        </div>
        <div className="vcb3-header-right">
          <h4>Smart. Simple. Stress-Free.</h4>
          <h3>All-in-One Veterinary Clinic Management</h3>
        </div>
      </header>

      {/* ================= HERO SECTION (FULL WIDTH) ================= */}
      <section className="vcb3-hero-full">
        <div className="vcb3-hero-container">
          <div className="vcb3-hero-left">
            <h1 className="vcb3-hero-title">One Platform to<br/>Run Your Entire Clinic</h1>
            <p className="vcb3-hero-subtitle">Manage appointments, patients, billing, inventory<br/>and staff operations – all in one intelligent platform.</p>
            
            {/* Checkmarks Grid inside Hero Left */}
            <div className="vcb3-check-grid">
              <div><CheckCircle size={18}/> Multi-Tenant SaaS Platform</div>
              <div><CheckCircle size={18}/> Real-time Analytics</div>
              <div><CheckCircle size={18}/> Role-Based Access Control</div>
              <div><CheckCircle size={18}/> Secure & Scalable</div>
              <div><CheckCircle size={18}/> Digital Prescriptions</div>
              <div><CheckCircle size={18}/> Automated Workflows</div>
              <div><CheckCircle size={18}/> Smart Reminders & Alerts</div>
              <div><CheckCircle size={18}/> Better Patient Care</div>
            </div>
          </div>
          
          <div className="vcb3-hero-right">
            <div className="hero-mockup-wrapper">
               <img src="/dashboard-screenshot.png" alt="Dashboard" className="hero-dashboard-img" onError={(e) => { e.target.src = "https://placehold.co/600x400/1e293b/white?text=Dashboard+Image"; }} />
               <img src="/dashboard-screenshot.png" alt="Mobile View" className="hero-mobile-img" />
            </div>
          </div>
        </div>
      </section>

      <div className="vcb3-layout">
        
        {/* ================= LEFT MAIN COLUMN ================= */}
        <div className="vcb3-main">
          
          {/* 8 Icons Grid - 4x2 */}
          <div className="vcb3-icon-grid" style={{ marginBottom: '4rem' }}>
            <div className="vcb3-icon-box"><Calendar size={32}/><span>APPOINTMENTS</span></div>
            <div className="vcb3-icon-box"><Heart size={32}/><span>PATIENTS</span></div>
            <div className="vcb3-icon-box"><CreditCard size={32}/><span>BILLING & POS</span></div>
            <div className="vcb3-icon-box"><Box size={32}/><span>INVENTORY</span></div>
            <div className="vcb3-icon-box"><Users size={32}/><span>STAFF & HR</span></div>
            <div className="vcb3-icon-box"><PieChart size={32}/><span>REPORTS</span></div>
            <div className="vcb3-icon-box"><PlusSquare size={32}/><span>PHARMACY</span></div>
            <div className="vcb3-icon-box"><LayoutDashboard size={32}/><span>MORE...</span></div>
          </div>

          {/* 2. COMPLETE CLINIC MANAGEMENT */}
          <section className="vcb3-section">
            <h2 className="vcb3-section-title">COMPLETE CLINIC MANAGEMENT</h2>
            <div className="vcb3-management-grid">
              <div className="vcb3-mgmt-card">
                <div className="mgmt-header teal-text"><Heart size={20}/> PATIENT CARE</div>
                <ul>
                  <li>Pet Profiles</li><li>Medical History</li><li>Treatments</li><li>Vaccinations</li><li>Lab Results</li><li>Digital Prescriptions</li>
                </ul>
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&h=200" alt="Dog" className="mgmt-dog-img" />
              </div>
              <div className="vcb3-mgmt-card">
                <div className="mgmt-header teal-text"><Calendar size={20}/> APPOINTMENTS</div>
                <ul>
                  <li>Smart Calendar</li><li>Doctor Availability</li><li>Queue Management</li><li>Home Visits</li><li>Vaccination Reminders</li>
                </ul>
                <img src="https://cdn-icons-png.flaticon.com/512/1498/1498075.png" alt="Calendar" className="mgmt-graphic-img" />
              </div>
              <div className="vcb3-mgmt-card">
                <div className="mgmt-header teal-text"><Box size={20}/> PHARMACY <br/>& INVENTORY</div>
                <ul>
                  <li>Medicine & Stock Tracking</li><li>Low-Stock Alerts</li><li>Supplier Management</li><li>Purchase Orders</li><li>Expiry Management</li>
                </ul>
                <img src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png" alt="Pharmacy" className="mgmt-graphic-img" />
              </div>
              <div className="vcb3-mgmt-card">
                <div className="mgmt-header teal-text"><CreditCard size={20}/> BILLING <br/>& FINANCE</div>
                <ul>
                  <li>Fast Invoicing</li><li>Payment Tracking</li><li>Expense Management</li><li>Cash Summary</li><li>Profit & Revenue Reports</li>
                </ul>
                <img src="https://cdn-icons-png.flaticon.com/512/2534/2534204.png" alt="Billing" className="mgmt-graphic-img" />
              </div>
            </div>
          </section>

          {/* 3. BUILT FOR EVERY ROLE */}
          <section className="vcb3-section">
            <h2 className="vcb3-section-title">BUILT FOR EVERY ROLE</h2>
            <div className="vcb3-roles-row">
              <div className="vcb3-role">
                <div className="role-av"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="Admin"/></div>
                <div className="role-text"><h4>Clinic Admin</h4><p>Full access to clinic & business management</p></div>
              </div>
              <div className="vcb3-role">
                <div className="role-av"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede" alt="Doctor"/></div>
                <div className="role-text"><h4>Veterinarian</h4><p>Patient history, prescriptions & schedules</p></div>
              </div>
              <div className="vcb3-role">
                <div className="role-av"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=ffdfbf" alt="Receptionist"/></div>
                <div className="role-text"><h4>Receptionist</h4><p>Appointments, billing & queue management</p></div>
              </div>
              <div className="vcb3-role">
                <div className="role-av"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Destiny&backgroundColor=d1d4f9" alt="Staff"/></div>
                <div className="role-text"><h4>Staff / Nurse</h4><p>Inventory, tasks & patient vitals management</p></div>
              </div>
            </div>
          </section>

          {/* 4. WHY PETCARE PRO? */}
          <section className="vcb3-section">
            <h2 className="vcb3-section-title">WHY PETCARE PRO?</h2>
            <div className="vcb3-why-row">
              <div className="why-box"><Cloud size={28}/><span>Multi-Tenant<br/>SaaS Platform</span></div>
              <div className="why-box"><Shield size={28}/><span>Secure &<br/>Reliable</span></div>
              <div className="why-box"><TrendingUp size={28}/><span>Scalable &<br/>Flexible</span></div>
              <div className="why-box"><Settings size={28}/><span>Automated<br/>Workflows</span></div>
              <div className="why-box"><PieChart size={28}/><span>Real-time<br/>Analytics</span></div>
              <div className="why-box"><Globe size={28}/><span>Cloud<br/>Based</span></div>
            </div>
          </section>

          {/* 5. HOW IT WORKS */}
          <section className="vcb3-section">
            <h2 className="vcb3-section-title">HOW IT WORKS</h2>
            <div className="vcb3-timeline">
              <div className="vcb3-tl-step"><div className="tl-circle"><Clock size={20}/></div><h4>1. REGISTER</h4><p>Create your clinic account</p></div>
              <ArrowRight className="tl-arrow"/>
              <div className="vcb3-tl-step"><div className="tl-circle"><Settings size={20}/></div><h4>2. SETUP</h4><p>Configure clinic, staff & settings</p></div>
              <ArrowRight className="tl-arrow"/>
              <div className="vcb3-tl-step"><div className="tl-circle"><Users size={20}/></div><h4>3. MANAGE</h4><p>Add patients, appointments & inventory</p></div>
              <ArrowRight className="tl-arrow"/>
              <div className="vcb3-tl-step"><div className="tl-circle"><RefreshCw size={20}/></div><h4>4. AUTOMATE</h4><p>Workflows, reminders & billing</p></div>
              <ArrowRight className="tl-arrow"/>
              <div className="vcb3-tl-step"><div className="tl-circle"><TrendingUp size={20}/></div><h4>5. GROW</h4><p>Analyze & grow your veterinary practice</p></div>
            </div>
          </section>

          {/* 6. REAL IMPACT */}
          <section className="vcb3-section">
            <h2 className="vcb3-section-title">REAL IMPACT. REAL RESULTS.</h2>
            <div className="vcb3-impact-row">
              <div className="imp-box"><Clock className="imp-ic"/><div><h3>70%</h3><p>Less Manual Work</p></div></div>
              <div className="imp-box"><TrendingUp className="imp-ic"/><div><h3>50%</h3><p>Increase in Efficiency</p></div></div>
              <div className="imp-box"><CreditCard className="imp-ic"/><div><h3>60%</h3><p>Faster Billing & Invoicing</p></div></div>
              <div className="imp-box"><PieChart className="imp-ic"/><div><h3>40%</h3><p>Increase in Revenue</p></div></div>
              <div className="imp-box teal-bg"><Shield className="imp-ic w"/><div><h3 className="w">100%</h3><p className="w">Data Security</p></div></div>
            </div>
          </section>

          {/* 7. CTA BANNER */}
          <section className="vcb3-cta-banner">
            <div className="vcb3-cta-left">
              <h2>Ready to Transform Your Veterinary Practice?</h2>
              <p>Join hundreds of clinics already using PetCare Pro.</p>
              <div className="cta-btn-group">
                <button className="cta-btn primary" onClick={() => handleRegister('free-trial')}>Request a Demo</button>
                <button className="cta-btn outline" onClick={() => handleRegister('free-trial')}>Talk to Expert</button>
              </div>
            </div>
            <div className="vcb3-cta-right">
               <img src="/dashboard-screenshot.png" alt="Dashboard CTA" className="cta-img" onError={(e) => { e.target.style.display='none'; }}/>
            </div>
          </section>

          {/* BOTTOM STRIP */}
          <div className="vcb3-bottom-strip">
            <span><ShieldCheck size={18}/> Secure & Reliable</span>
            <span><PhoneCall size={18}/> 24/7 Support</span>
            <span><RefreshCw size={18}/> Regular Updates</span>
            <span><TrendingUp size={18}/> Scalable Solutions</span>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR COLUMN ================= */}
        <div className="vcb3-sidebar">
          
          {/* Box 1: WHY CLINICS CHOOSE */}
          <div className="vcb3-side-box">
            <div className="sb-head">WHY CLINICS CHOOSE PETCARE PRO</div>
            <div className="sb-body">
              <h5 className="sb-red"><XCircle size={18} fill="#ef4444" color="#111827"/> Without PetCare Pro</h5>
              <ul className="sb-list-red">
                <li>Manual appointments & scheduling</li>
                <li>Missed follow-ups & reminders</li>
                <li>Paper prescriptions & records</li>
                <li>Inventory mismanagement</li>
                <li>Payment delays & tracking issues</li>
                <li>No real-time insights</li>
                <li>Scattered data & paperwork</li>
                <li>Difficult to scale your clinic</li>
              </ul>

              <h5 className="sb-green"><CheckCircle size={18} fill="#10b981" color="#111827"/> With PetCare Pro</h5>
              <ul className="sb-list-green">
                <li>Centralized clinic management</li>
                <li>Smart appointments & reminders</li>
                <li>Digital prescriptions & records</li>
                <li>Real-time inventory tracking</li>
                <li>Fast billing & payment tracking</li>
                <li>Live dashboard & analytics</li>
                <li>Secure, scalable & cloud-based</li>
                <li>Focus more on pet care</li>
              </ul>
            </div>
          </div>

          {/* Box 2: KEY BUSINESS BENEFITS */}
          <div className="vcb3-side-box">
            <div className="sb-head">KEY BUSINESS BENEFITS</div>
            <div className="sb-body sb-benefits">
              <div className="sbb-row">
                <div className="sbb-icon c1"><Clock size={24}/></div>
                <div className="sbb-text"><h4>SAVE TIME</h4><p>Automate daily tasks and reduce manual work.</p></div>
              </div>
              <div className="sbb-row">
                <div className="sbb-icon c2"><TrendingUp size={24}/></div>
                <div className="sbb-text"><h4>INCREASE REVENUE</h4><p>Better patient experience leads to higher revenue.</p></div>
              </div>
              <div className="sbb-row">
                <div className="sbb-icon c3"><Settings size={24}/></div>
                <div className="sbb-text"><h4>IMPROVE EFFICIENCY</h4><p>Streamline workflows and manage resources better.</p></div>
              </div>
              <div className="sbb-row">
                <div className="sbb-icon c4"><PieChart size={24}/></div>
                <div className="sbb-text"><h4>DATA-DRIVEN DECISIONS</h4><p>Real-time insights to grow your practice.</p></div>
              </div>
            </div>
          </div>

          {/* Box 3: POWERFUL MODULES */}
          <div className="vcb3-side-box">
            <div className="sb-head">POWERFUL MODULES<br/>BUILT FOR VETERINARY CLINICS</div>
            <div className="sb-body sb-modules">
              <div className="sbm-row">
                <Calendar size={28} className="sbm-icon"/>
                <div className="sbm-text"><h4>APPOINTMENTS & SCHEDULING</h4><p>Smart calendar, queues, home visits & reminders</p></div>
              </div>
              <div className="sbm-row">
                <Heart size={28} className="sbm-icon"/>
                <div className="sbm-text"><h4>PATIENT & PET MANAGEMENT</h4><p>Profiles, history, treatments, digital prescriptions</p></div>
              </div>
              <div className="sbm-row">
                <CreditCard size={28} className="sbm-icon"/>
                <div className="sbm-text"><h4>BILLING, POS & FINANCE</h4><p>Invoices, payments, expenses & revenue tracking</p></div>
              </div>
              <div className="sbm-row">
                <Box size={28} className="sbm-icon"/>
                <div className="sbm-text"><h4>PHARMACY & INVENTORY</h4><p>Stock tracking, low-stock alerts, suppliers & purchase orders</p></div>
              </div>
              <div className="sbm-row">
                <Users size={28} className="sbm-icon"/>
                <div className="sbm-text"><h4>STAFF & HR MANAGEMENT</h4><p>Attendance, roles, permissions & doctor revenue split</p></div>
              </div>
              <div className="sbm-row">
                <PieChart size={28} className="sbm-icon"/>
                <div className="sbm-text"><h4>REPORTS & ANALYTICS</h4><p>Interactive dashboards, growth insights & exportable reports</p></div>
              </div>

              <div className="sbm-footer">
                <p>and <strong>20+ more powerful features</strong><br/>to run your clinic effortlessly.</p>
                <button className="sbm-btn" onClick={() => navigate('/')}>Explore All Features &rarr;</button>
              </div>
            </div>
          </div>

          {/* New Animated Image at the bottom of the sidebar */}
          <div className="vcb3-sidebar-animated-img">
            <img src="/sidebar-vet-dog.png" alt="Vet examining dog" />
          </div>

        </div>

      </div>

      <div className="vcb3-footer-bottom">
        <div className="vcb3-fb-text">PetCare Pro. Smart Clinic. Happy Pets.</div>
        <div className="vcb3-fb-contact">
          <a href="tel:+919752100980"><PhoneCall size={18} /> +91-97521 00980</a>
          <a href="mailto:info@kiaantechnology.com"><Mail size={18} /> info@kiaantechnology.com</a>
          <a href="https://kiaantechnology.com/" target="_blank" rel="noopener noreferrer"><Globe size={18} /> kiaantechnology.com</a>
        </div>
      </div>

      {showRegisterModal && (
        <RegisterModal plan={selectedPlan} onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
}
