import { apiFetch } from '../utils/api';
import React, { useState } from 'react';
import { Plus, Eye, Printer, Download, Trash2, ShieldCheck, Loader } from 'lucide-react';
import FormSelect from './FormSelect';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

function InvoiceLineItems({ invoice }) {
  const items = invoice.lineItems || [];

  return (
    <>
      <div className="invoice-table-wrap ledger-desktop-table">
        <table className="custom-table">
          <thead>
            <tr style={{ backgroundColor: '#fafafa' }}>
              <th>Description</th>
              <th>Category</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="font-bold">{item.name || 'Service/Item'}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.category || 'Medicine'}</td>
                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(item.unit_price)}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="invoice-mobile-items">
        {items.map((item, idx) => (
          <div key={idx} className="invoice-mobile-item">
            <div className="invoice-mobile-item-name">{item.name || 'Service/Item'} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({item.category || 'Medicine'})</span></div>
            <div className="invoice-mobile-item-row">
              <span>Qty: {item.quantity}</span>
              <span>Unit: LKR {parseFloat(item.unit_price).toLocaleString()}</span>
            </div>
            <div className="invoice-mobile-item-total">Total: LKR {parseFloat(item.total).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Billing({ currentRole }) {
  const [invoices, setInvoices] = useState([]);
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [unbilled, setUnbilled] = useState({ encounters: [], homeVisits: [] });
  const [loading, setLoading] = useState(true);

  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const [ownerId, setOwnerId] = useState('');
  const [petId, setPetId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [treatmentCharges, setTreatmentCharges] = useState('');
  const [treatmentTaxable, setTreatmentTaxable] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [lineItems, setLineItems] = useState([{ inventory_id: '', category: 'Medicine', name: '', qty: 1, price: '', taxable: true }]);

  const [linkedEncounterId, setLinkedEncounterId] = useState(null);
  const [linkedHomeVisitId, setLinkedHomeVisitId] = useState(null);

  const [doctors, setDoctors] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [invoicesRes, ownersRes, petsRes, inventoryRes, unbilledRes, doctorsRes] = await Promise.all([
        apiFetch('http://localhost:5000/api/v1/invoices', { headers }),
        apiFetch('http://localhost:5000/api/v1/owners', { headers }),
        apiFetch('http://localhost:5000/api/v1/pets', { headers }),
        apiFetch('http://localhost:5000/api/v1/inventory', { headers }),
        apiFetch('http://localhost:5000/api/v1/invoices/unbilled', { headers }),
        apiFetch('http://localhost:5000/api/v1/users?role=Doctor', { headers })
      ]);

      const invoicesData = await invoicesRes.json();
      const ownersData = await ownersRes.json();
      const petsData = await petsRes.json();
      const inventoryData = await inventoryRes.json();
      const doctorsData = await doctorsRes.json();
      
      console.log("Billing Data Loaded:", { invoicesData, ownersData, petsData, inventoryData, doctorsData });
      
      setInvoices(invoicesData);
      if (ownersData.status === 'success') setOwners(ownersData.data);
      if (petsData.status === 'success') setPets(petsData.data);
      if (inventoryData.status === 'success') setInventory(inventoryData.data);
      if (doctorsData.status === 'success') setDoctors(doctorsData.data);
      
      if (unbilledRes.ok) {
        const unbilledData = await unbilledRes.json();
        console.log("Unbilled Data parsed:", unbilledData);
        setUnbilled(unbilledData);
      } else {
        console.error("Unbilled response not ok:", unbilledRes.status);
      }
    } catch (err) {
      console.error("fetchData Error in Billing.jsx:", err);
      toast.error('Failed to load billing registry data');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSelectUnbilled = (record, type) => {
    setOwnerId(record.ownerId);
    setPetId(record.pet_id || record.id); // set the correct pet id
    setDoctorId(record.doctor_id || '');
    
    setLinkedEncounterId(type === 'encounter' ? record.id : null);
    setLinkedHomeVisitId(type === 'home_visit' ? record.id : null);

    let baseCharges = 0;
    if (type === 'encounter') {
      const consultItem = inventory.find(i => i.name === 'Standard General Consultation' || i.sku === 'SRV-CONSULT');
      baseCharges = consultItem ? parseFloat(consultItem.selling_price) : 45;
    }
    setTreatmentCharges(baseCharges);
    setTreatmentTaxable(false); // Consult service usually non-taxable

    const newLineItems = [];

    if (type === 'home_visit') {
      const travelItem = inventory.find(i => i.name === 'Home Visit Travel Fee' || i.sku === 'SRV-HOMEFEE');
      newLineItems.push({
        inventory_id: travelItem ? travelItem.id : '',
        category: 'Service',
        name: 'Home Visit Travel Fee',
        qty: 1,
        price: record.travel_fee ? parseFloat(record.travel_fee) : 25,
        taxable: false
      });
    }

    if (record.prescriptions && record.prescriptions.length > 0) {
      record.prescriptions.forEach(rx => {
        if (rx.inventory_id) {
          const invItem = inventory.find(i => i.id === rx.inventory_id);
          if (invItem) {
            newLineItems.push({
              inventory_id: invItem.id,
              category: invItem.category || 'Medicine',
              name: invItem.name,
              qty: 1,
              price: parseFloat(invItem.selling_price) || 0,
              taxable: invItem.is_taxable !== false
            });
          }
        } else {
          newLineItems.push({
            inventory_id: '',
            category: 'Medicine',
            name: rx.medicine_name,
            qty: 1,
            price: 0,
            taxable: true
          });
        }
      });
    }

    if (record.reports && record.reports.length > 0) {
      const labService = inventory.find(i => i.category === 'Service' && i.name.toLowerCase().includes('lab'));
      newLineItems.push({
        inventory_id: labService ? labService.id : '',
        category: 'Service',
        name: `Lab Diagnostic Fee (${record.reports.length} report(s))`,
        qty: record.reports.length,
        price: labService ? parseFloat(labService.selling_price) : 50,
        taxable: false
      });
    }

    if (newLineItems.length === 0) {
      newLineItems.push({ inventory_id: '', category: 'Medicine', name: '', qty: 1, price: '', taxable: true });
    }

    setLineItems(newLineItems);
    toast.success(`Loaded unbilled details for ${record.petName}`);
  };

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { inventory_id: '', category: 'Medicine', name: '', qty: 1, price: '', taxable: true }]);
  };

  const handleRemoveLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleItemSelect = (index, itemId) => {
    const selectedItem = inventory.find(i => i.id === itemId);
    const updated = lineItems.map((item, i) => {
      if (i === index) {
        if (selectedItem) {
          return {
            ...item,
            inventory_id: itemId,
            name: selectedItem.name,
            price: parseFloat(selectedItem.selling_price) || 0,
            category: selectedItem.category || 'Medicine',
            taxable: selectedItem.is_taxable !== false
          };
        } else {
          return { ...item, inventory_id: itemId };
        }
      }
      return item;
    });
    setLineItems(updated);
  };

  const handleLineItemChange = (index, field, value) => {
    const updated = lineItems.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: field === 'qty' || field === 'price' ? (value === '' ? '' : parseFloat(value) || 0) : value,
        };
      }
      return item;
    });
    setLineItems(updated);
  };

  const treatmentTotal = parseFloat(treatmentCharges) || 0;
  let taxableSubtotal = treatmentTaxable ? treatmentTotal : 0;
  let nonTaxableSubtotal = treatmentTaxable ? 0 : treatmentTotal;

  lineItems.forEach((item) => {
    const total = item.qty * (parseFloat(item.price) || 0);
    if (item.taxable) taxableSubtotal += total;
    else nonTaxableSubtotal += total;
  });

  const calculatedSubtotal = taxableSubtotal + nonTaxableSubtotal;
  const calculatedTax = parseFloat((taxableSubtotal * 0.08).toFixed(2));
  const calculatedGrandTotal = calculatedSubtotal + calculatedTax;

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    if (!ownerId || !petId) {
      toast.error('Please select an owner and a pet first.');
      return;
    }

    const formattedLineItems = lineItems
      .filter(item => item.name !== '')
      .map(item => ({
        inventory_id: item.inventory_id || null,
        quantity: item.qty,
        unit_price: parseFloat(item.price) || 0,
        total: item.qty * (parseFloat(item.price) || 0)
      }));

    if (treatmentTotal > 0) {
      const consultItem = inventory.find(i => i.name === 'Standard General Consultation' || i.sku === 'SRV-CONSULT');
      formattedLineItems.unshift({
        inventory_id: consultItem ? consultItem.id : null,
        quantity: 1,
        unit_price: treatmentTotal,
        total: treatmentTotal
      });
    }

    const payload = {
      owner_id: ownerId,
      pet_id: petId,
      doctor_id: doctorId || null,
      subtotal: calculatedSubtotal,
      tax_amount: calculatedTax,
      discount_amount: 0.00,
      grand_total: calculatedGrandTotal,
      status: 'Pending',
      encounter_id: linkedEncounterId,
      home_visit_id: linkedHomeVisitId,
      lineItems: formattedLineItems
    };

    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('http://localhost:5000/api/v1/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Invoice generated successfully.');
        setOwnerId('');
        setPetId('');
        setDoctorId('');
        setTreatmentCharges('');
        setTreatmentTaxable(true);
        setLineItems([{ inventory_id: '', category: 'Medicine', name: '', qty: 1, price: '', taxable: true }]);
        setLinkedEncounterId(null);
        setLinkedHomeVisitId(null);
        setShowInvoiceForm(false);
        fetchData();
      } else {
        toast.error(data.message || 'Failed to generate invoice');
      }
    } catch (err) {
      toast.error('Network error while generating invoice');
    }
  };

  const handleUpdateStatus = async (invoiceId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch(`http://localhost:5000/api/v1/invoices/${invoiceId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Invoice marked as ${newStatus} successfully.`);
        if (viewingInvoice && viewingInvoice.id === invoiceId) {
          const detailRes = await apiFetch(`http://localhost:5000/api/v1/invoices/${invoiceId}`);
          const detailData = await detailRes.json();
          setViewingInvoice(detailData);
        }
        fetchData();
      } else {
        toast.error(data.message || 'Failed to update invoice status');
      }
    } catch (err) {
      toast.error('Network error while updating invoice status');
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <Loader className="animate-spin" style={{ color: 'var(--primary-teal)', animation: 'spin 1s linear infinite' }} size={32} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading invoices registry...</p>
      </div>
    );
  }

  return (
    <div className="billing-page">
      <div className="page-header">
        <div>
          <h1>
            {currentRole === 'Doctor' ? 'Clinical Billing & Charges' : 'Billing & Invoices Ledger'}
          </h1>
          <p>
            {currentRole === 'Doctor'
              ? 'Submit treatment charges and prescribe medicines for your patients.'
              : 'Generate clinic invoices, itemize medicine costs, and record payments.'}
          </p>
        </div>
        {['Admin', 'Manager', 'Receptionist', 'Doctor'].includes(currentRole) && (
          <button
            onClick={() => {
              setViewingInvoice(null);
              setShowInvoiceForm(!showInvoiceForm);
            }}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '220px' }}
          >
            {showInvoiceForm ? 'View Invoices Ledger' : (
              <><Plus size={16} /> {currentRole === 'Doctor' ? 'Submit Charges' : 'Create Invoice'}</>
            )}
          </button>
        )}
      </div>

      {showInvoiceForm ? (
        <div className="card" style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
          <h3 className="font-bold text-lg mb-6" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Generate New Invoice
          </h3>

          {/* Unbilled Queue Quick Load */}
          {unbilled && (unbilled.encounters?.length > 0 || unbilled.homeVisits?.length > 0) && (
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#f0fdfa' }}>
              <span className="font-bold text-xs" style={{ display: 'block', color: 'var(--primary-teal)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                ⚡ Unbilled Treatment Queue (Select to Auto-Populate Invoice)
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {unbilled.encounters?.map((enc) => (
                  <div key={enc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.5rem', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    <div>
                      <strong>Clinic Visit: {enc.petName}</strong> ({enc.ownerName}) - {enc.complaint}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Encounter Date: {enc.encounter_date ? enc.encounter_date.split('T')[0] : ''} | Doctor: {enc.doctorName}</div>
                    </div>
                    <button type="button" onClick={() => handleSelectUnbilled(enc, 'encounter')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                      Load Record
                    </button>
                  </div>
                ))}
                {unbilled.homeVisits?.map((hv) => (
                  <div key={hv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.5rem', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    <div>
                      <strong>Home Visit: {hv.petName}</strong> ({hv.ownerName}) - Travel Fee: LKR {hv.travel_fee}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Address: {hv.address} | Doctor: {hv.doctorName}</div>
                    </div>
                    <button type="button" onClick={() => handleSelectUnbilled(hv, 'home_visit')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                      Load Record
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleGenerateInvoice}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <FormSelect
                  value={ownerId}
                  onChange={setOwnerId}
                  placeholder="-- Select Client --"
                  required
                  options={[
                    { value: '', label: '-- Select Client --' },
                    ...owners.map((o) => ({ value: o.id, label: o.name })),
                  ]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Patient Pet *</label>
                <FormSelect
                  value={petId}
                  onChange={setPetId}
                  placeholder="-- Select Pet --"
                  required
                  options={[
                    { value: '', label: '-- Select Pet --' },
                    ...pets.filter(p => p.owner_id === ownerId || !ownerId).map((p) => ({ value: p.id, label: `${p.name} (${p.breed || p.species})` })),
                  ]}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Treating Doctor (Optional)</label>
                <FormSelect
                  value={doctorId}
                  onChange={setDoctorId}
                  placeholder="-- Select Doctor --"
                  options={[
                    { value: '', label: '-- None --' },
                    ...doctors.map(s => ({ value: s.id, label: s.name }))
                  ]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Mode *</label>
                <FormSelect
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  options={[
                    { value: 'Credit Card', label: 'Credit Card' },
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                  ]}
                />
              </div>
            </div>

            <div className="form-row" style={{ alignItems: 'center' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Consultation & Treatment Fee (LKR)</label>
                <input
                  type="number"
                  className="form-control"
                  value={treatmentCharges}
                  onChange={(e) => setTreatmentCharges(e.target.value)}
                  placeholder="e.g. 2500"
                />
              </div>
              <div className="form-group" style={{ display: 'none', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', flexShrink: 0 }}>
                <input 
                  type="checkbox" 
                  id="treatmentTaxable" 
                  checked={treatmentTaxable} 
                  onChange={(e) => setTreatmentTaxable(e.target.checked)} 
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="treatmentTaxable" style={{ marginBottom: 0, fontSize: '0.875rem' }}>Taxable Item</label>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="font-semibold text-xs" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Itemized POS Products & Services
                </span>
                <button type="button" onClick={handleAddLineItem} className="btn btn-secondary btn-sm">
                  + Add Line Item
                </button>
              </div>

              {lineItems.map((item, idx) => (
                <div key={idx} className="form-row" style={{ gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ width: '140px', marginBottom: 0, flexShrink: 0 }}>
                    <FormSelect
                      value={item.category}
                      onChange={(val) => handleLineItemChange(idx, 'category', val)}
                      options={[
                        { value: 'Medicine', label: 'Medicine' },
                        { value: 'Accessories & Toys', label: 'Accessories & Toys' },
                        { value: 'Hygiene Items', label: 'Hygiene' },
                        { value: 'Food & Snacks', label: 'Food & Snacks' },
                        { value: 'Vitamins', label: 'Vitamins' },
                        { value: 'Service', label: 'Service' },
                        { value: 'Other', label: 'Other' },
                      ]}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0, minWidth: 0 }}>
                    <FormSelect
                      value={item.inventory_id}
                      onChange={(val) => handleItemSelect(idx, val)}
                      options={[
                        { value: '', label: '-- Select Inventory Item --' },
                        ...inventory.filter(i => i.category === item.category).map((invItem) => ({ value: invItem.id, label: invItem.name }))
                      ]}
                    />
                  </div>
                  <div className="form-group" style={{ width: '60px', marginBottom: 0, flexShrink: 0 }}>
                    <input
                      type="number"
                      className="form-control text-xs"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => handleLineItemChange(idx, 'qty', e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ width: '80px', marginBottom: 0, flexShrink: 0 }}>
                    <input
                      type="number"
                      className="form-control text-xs"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleLineItemChange(idx, 'price', e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', width: '50px', marginBottom: 0, flexShrink: 0 }}>
                    <label style={{ fontSize: '0.65rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Tax</label>
                    <input 
                      type="checkbox" 
                      checked={item.taxable} 
                      onChange={(e) => handleLineItemChange(idx, 'taxable', e.target.checked)} 
                      style={{ width: '16px', height: '16px' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', minWidth: '60px', textAlign: 'right', flexShrink: 0, paddingBottom: '0.5rem' }}>
                    {(item.qty * (parseFloat(item.price) || 0)).toLocaleString()}
                  </div>
                  {lineItems.length > 1 && (
                    <button type="button" onClick={() => handleRemoveLineItem(idx)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)', flexShrink: 0, paddingBottom: '0.5rem' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="invoice-totals">
              <div className="invoice-totals-row">
                <span style={{ color: 'var(--text-secondary)' }}>Taxable Subtotal:</span>
                <span>LKR {taxableSubtotal.toLocaleString()}</span>
              </div>
              <div className="invoice-totals-row">
                <span style={{ color: 'var(--text-secondary)' }}>Non-Taxable Subtotal:</span>
                <span>LKR {nonTaxableSubtotal.toLocaleString()}</span>
              </div>
              <div className="invoice-totals-row">
                <span style={{ color: 'var(--text-secondary)' }}>TAX / GST (8%):</span>
                <span>LKR {calculatedTax.toLocaleString()}</span>
              </div>
              <div className="invoice-totals-row" style={{ borderTop: '2px double var(--border)', paddingTop: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-teal)' }}>
                <span>Grand Total:</span>
                <span>LKR {calculatedGrandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setShowInvoiceForm(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Generate Invoice</button>
            </div>
          </form>
        </div>
      ) : viewingInvoice ? (
        <div className="card invoice-preview-card">
          <div className="invoice-header">
            <div className="invoice-header-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2rem' }}>🐾</span>
                <span style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 800 }}>
                  PetCare <span style={{ color: 'var(--primary-teal)' }}>Pro</span>
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 4px 0', wordBreak: 'break-word' }}>
                Temple Road, Colombo 07, Sri Lanka
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0, wordBreak: 'break-word' }}>
                Phone: +94 11 234 5678
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
                Email: billing@vetcarepro.com
              </p>
            </div>
            <div className="invoice-header-meta">
              <h2>INVOICE</h2>
              <span className="invoice-id">Invoice: {viewingInvoice.id}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                Date: {viewingInvoice.invoice_date ? viewingInvoice.invoice_date.split('T')[0] : ''}
              </span>
            </div>
          </div>

          <div className="invoice-parties">
            <div className="invoice-party-box invoice-party-box--client">
              <span className="font-bold text-xs" style={{ display: 'block', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Billed To (Client):
              </span>
              <span className="font-bold" style={{ display: 'block', fontSize: '1rem', wordBreak: 'break-word' }}>{viewingInvoice.ownerName}</span>
              <span style={{ color: 'var(--text-secondary)', display: 'block', wordBreak: 'break-all' }}>ID: {viewingInvoice.owner_id}</span>
            </div>
            <div className="invoice-party-box invoice-party-box--patient">
              <span className="font-bold text-xs" style={{ display: 'block', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Patient Details:
              </span>
              <span className="font-bold" style={{ display: 'block', fontSize: '1rem', wordBreak: 'break-word' }}>{viewingInvoice.petName}</span>
              <span style={{ color: 'var(--text-secondary)', display: 'block', wordBreak: 'break-all' }}>ID: {viewingInvoice.pet_id}</span>
            </div>
          </div>

          <InvoiceLineItems invoice={viewingInvoice} />

          <div className="invoice-totals">
            <div className="invoice-totals-row">
              <span style={{ color: 'var(--text-secondary)' }}>Invoice Subtotal:</span>
              <span>LKR {parseFloat(viewingInvoice.subtotal).toLocaleString()}</span>
            </div>
            <div className="invoice-totals-row">
              <span style={{ color: 'var(--text-secondary)' }}>TAX / GST (8%):</span>
              <span>LKR {parseFloat(viewingInvoice.tax_amount).toLocaleString()}</span>
            </div>
            <div className="invoice-totals-row" style={{ borderTop: '2px double var(--border)', paddingTop: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-teal)' }}>
              <span>Grand Total:</span>
              <span>LKR {parseFloat(viewingInvoice.grand_total).toLocaleString()}</span>
            </div>
          </div>

          <div className="invoice-footer-row" style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              {viewingInvoice.status === 'Pending' && ['Admin', 'Manager', 'Receptionist'].includes(currentRole) ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleUpdateStatus(viewingInvoice.id, 'Paid')} className="btn btn-primary btn-sm" style={{ backgroundColor: 'var(--primary-teal)', color: '#fff' }}>Mark as Paid</button>
                  <button onClick={() => handleUpdateStatus(viewingInvoice.id, 'Cancelled')} className="btn btn-secondary btn-sm" style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>Cancel Invoice</button>
                </div>
              ) : (
                <span className={`badge ${viewingInvoice.status === 'Paid' ? 'badge-success' : viewingInvoice.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}>
                  {viewingInvoice.status === 'Paid' && <ShieldCheck size={14} />} {viewingInvoice.status} {viewingInvoice.status === 'Paid' && `via ${viewingInvoice.paymentMethod || 'Cash'}`}
                </span>
              )}
            </div>
            <span>Authorized Signature: ______________</span>
          </div>

          <div className="invoice-actions">
            <button onClick={() => setViewingInvoice(null)} className="btn btn-secondary">Back to Ledger</button>
            <button onClick={handlePrint} className="btn btn-blue">Print</button>
            <button onClick={() => toast.success('PDF download started.')} className="btn btn-primary">PDF Download</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive ledger-desktop-table">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Client / Patient</th>
                  <th>Subtotal</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-bold" style={{ color: 'var(--primary-teal)' }}>{inv.id}</td>
                    <td>{inv.invoice_date ? inv.invoice_date.split('T')[0] : ''}</td>
                    <td>
                      <span className="font-semibold" style={{ display: 'block' }}>{inv.ownerName}</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Patient: {inv.petName}</span>
                    </td>
                    <td>LKR {parseFloat(inv.subtotal).toLocaleString()}</td>
                    <td className="font-bold">LKR {parseFloat(inv.grand_total).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${inv.status === 'Paid' ? 'badge-success' : inv.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={async () => {
                        const token = localStorage.getItem('token');
                        const res = await apiFetch(`http://localhost:5000/api/v1/invoices/${inv.id}`);
                        const data = await res.json();
                        setViewingInvoice(data);
                      }} className="btn btn-secondary btn-sm">
                        <Eye size={14} /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ledger-mobile-list">
            {invoices.map((inv) => (
              <div key={inv.id} className="ledger-mobile-card">
                <div className="ledger-mobile-card-header">
                  <div>
                    <span className="font-bold" style={{ color: 'var(--primary-teal)', fontSize: '0.9rem' }}>{inv.id}</span>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{inv.invoice_date ? inv.invoice_date.split('T')[0] : ''}</p>
                  </div>
                  <span className={`badge ${inv.status === 'Paid' ? 'badge-success' : inv.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                    {inv.status}
                  </span>
                </div>
                <p className="font-semibold text-sm" style={{ marginBottom: '4px' }}>{inv.ownerName}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Patient: {inv.petName}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-bold" style={{ color: 'var(--primary-teal)' }}>LKR {parseFloat(inv.grand_total).toLocaleString()}</span>
                  <button onClick={async () => {
                    const token = localStorage.getItem('token');
                    const res = await apiFetch(`http://localhost:5000/api/v1/invoices/${inv.id}`);
                    const data = await res.json();
                    setViewingInvoice(data);
                  }} className="btn btn-secondary btn-sm">
                    <Eye size={14} /> Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
