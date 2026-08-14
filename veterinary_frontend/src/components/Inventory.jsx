import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Package, Plus, AlertTriangle, Search, Edit3, Trash2, ShieldAlert, Activity, CheckCircle, Clock, Loader, Filter, SlidersHorizontal, RotateCcw, X, Maximize2, Minimize2, Camera } from 'lucide-react';
import FormSelect from './FormSelect';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

export default function Inventory() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Webcam Barcode Scanner states
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scanStatus, setScanStatus] = useState('Standby');
  const [stream, setStream] = useState(null);
  const videoRef = React.useRef(null);

  // Dedicated Stock Refill Modal states
  const [refillModalItem, setRefillModalItem] = useState(null);
  const [addQtyInput, setAddQtyInput] = useState(10);
  const [newRefillExpiry, setNewRefillExpiry] = useState('');
  const [refillNotes, setRefillNotes] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [qty, setQty] = useState(0);
  const [lowStockLimit, setLowStockLimit] = useState(10);
  const [unit, setUnit] = useState('Bottles');
  const [expiry, setExpiry] = useState('');
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState(0);
  const [tax, setTax] = useState(0);

  // Calculations
  const totalItems = stock.length;
  const outOfStockCount = stock.filter(item => item.qty === 0).length;
  const lowStockCount = stock.filter(item => item.qty > 0 && item.qty <= item.lowStockLimit).length;
  
  const getComputedStatus = (currentQty, limit, expDateStr) => {
    if (currentQty === 0) return 'Out of Stock';
    if (currentQty <= Math.ceil(limit / 2)) return 'Critical Stock';
    if (currentQty <= limit) return 'Low Stock';
    
    const expDate = new Date(expDateStr);
    const today = new Date();
    const diffMonths = (expDate.getFullYear() - today.getFullYear()) * 12 + (expDate.getMonth() - today.getMonth());
    if (diffMonths <= 2) return 'Expiring Soon';
    
    return 'In Stock';
  };

  const expiringSoonCount = stock.filter(item => getComputedStatus(item.qty, item.lowStockLimit, item.expiry) === 'Expiring Soon').length;

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch('/api/v1/inventory');
      const data = await response.json();
      if (data.status === 'success') {
        const formattedStock = data.data.map(item => ({
          ...item,
          batchNumber: item.sku,
          qty: item.quantity,
          lowStockLimit: item.low_stock_threshold,
          unit: item.unit || 'Pieces',
          price: parseFloat(item.selling_price) || 0,
          expiry: item.expiry_date ? item.expiry_date.split('T')[0] : ''
        }));
        setStock(formattedStock);
      } else {
        toast.error('Failed to load inventory data');
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      toast.error('Network error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    let timer;
    if (showScannerModal) {
      setScanStatus('Initializing camera...');
      
      const hasMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      if (hasMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then(mediaStream => {
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
              videoRef.current.play();
            }
            setScanStatus('Scanning for barcode...');

            // Auto simulate scan completion after 3.5 seconds
            timer = setTimeout(() => {
              if (stock.length > 0) {
                const randomItem = stock[Math.floor(Math.random() * stock.length)];
                handleBarcodeSuccess(randomItem.sku || 'RB-9920K');
              } else {
                handleBarcodeSuccess('RB-9920K');
              }
            }, 3500);
          })
          .catch(err => {
            console.warn('Camera access denied:', err);
            setScanStatus('Simulated scanner active (Webcam not found/blocked).');
          });
      } else {
        setScanStatus('Simulated scanner active (Webcam API not supported in this browser).');
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showScannerModal]);

  const handleBarcodeSuccess = (barcode) => {
    setSearchQuery(barcode);
    toast.success(`Mock Scan Success: SKU [${barcode}] loaded!`);
    closeScanner();
  };

  const closeScanner = () => {
    setShowScannerModal(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!name || !category || !batchNumber || !expiry) {
      toast.error('Please fill out all mandatory inventory details.');
      return;
    }

    const payload = {
      sku: batchNumber,
      name,
      category,
      supplier,
      quantity: parseInt(qty) || 0,
      low_stock_threshold: parseInt(lowStockLimit) || 10,
      cost_price: 0,
      selling_price: parseFloat(price) || 0,
      is_taxable: tax > 0,
      expiry_date: expiry
    };

    const token = localStorage.getItem('token');

    try {
      if (editingItem) {
        const response = await apiFetch(`/api/v1/inventory/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          toast.success('Stock updated successfully.');
          fetchInventory();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to update stock. Note: Only Admins & Managers can do this.');
        }
      } else {
        const response = await apiFetch('/api/v1/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          toast.success('New medicine added to inventory successfully.');
          fetchInventory();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to add stock. Note: Only Admins & Managers can do this.');
        }
      }
    } catch (err) {
      console.error('API Error:', err);
      toast.error('Network error. Check backend connection.');
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setBatchNumber(item.batchNumber || '');
    setQty(item.qty);
    setLowStockLimit(item.lowStockLimit || 10);
    setUnit(item.unit);
    setExpiry(item.expiry);
    setSupplier(item.supplier);
    setPrice(item.price || 0);
    setTax(item.tax || 0);
    setNotes('');
    setShowAddForm(true);
  };

  const handleDeleteClick = (itemId) => {
    setDeleteConfirmId(itemId);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        const token = localStorage.getItem('token');
        const response = await apiFetch(`/api/v1/inventory/${deleteConfirmId}`, {
          method: 'DELETE',
          
        });
        const data = await response.json();
        
        if (data.status === 'success') {
           setDeleteConfirmId(null);
           toast.success('Item removed successfully.');
           fetchInventory();
        } else {
           toast.error(data.message || 'Failed to delete item. Note: Only Admins & Managers can do this.');
           setDeleteConfirmId(null);
        }
      } catch (err) {
        console.error('API Error:', err);
        toast.error('Network error. Check backend.');
      }
    }
  };

  const handleConfirmRefill = async (e) => {
    if (e) e.preventDefault();
    if (!refillModalItem) return;

    const added = parseInt(addQtyInput) || 0;
    if (added <= 0) {
      toast.error('Please enter a quantity greater than 0.');
      return;
    }

    const currentQty = parseInt(refillModalItem.qty) || 0;
    const newQty = currentQty + added;
    const token = localStorage.getItem('token');

    const payload = {
      name: refillModalItem.name,
      category: refillModalItem.category,
      supplier: refillModalItem.supplier,
      quantity: newQty,
      low_stock_threshold: refillModalItem.lowStockLimit || 10,
      cost_price: refillModalItem.cost_price || 0,
      selling_price: refillModalItem.price || 0,
      is_taxable: true,
      expiry_date: newRefillExpiry || refillModalItem.expiry
    };

    try {
      const response = await apiFetch(`/api/v1/inventory/${refillModalItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.status === 'success') {
        toast.success(`Successfully added +${added} ${refillModalItem.unit || 'Units'} to ${refillModalItem.name}! New Total: ${newQty} Units.`);
        setRefillModalItem(null);
        setAddQtyInput(10);
        fetchInventory();
      } else {
        toast.error(data.message || 'Failed to add stock quantity. Note: Only Admins & Managers can do this.');
      }
    } catch (err) {
      console.error('Refill error:', err);
      toast.error('Network error updating stock.');
    }
  };

  const resetForm = () => {
    setName(''); setCategory(''); setBatchNumber(''); setQty(0); setLowStockLimit(10); setUnit('Bottles'); setExpiry(''); setSupplier(''); setPrice(0); setTax(0); setNotes(''); setEditingItem(null); setShowAddForm(false);
  };

  const getStatusBadge = (status) => {
    const badgeStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap',
      fontSize: '0.72rem',
      fontWeight: 700,
      padding: '3px 10px',
      borderRadius: '9999px',
      textTransform: 'none',
      letterSpacing: '0.01em'
    };

    switch (status) {
      case 'Out of Stock':
        return <span style={{ ...badgeStyle, backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}><AlertTriangle size={12}/> Out of Stock</span>;
      case 'Critical Stock':
        return <span style={{ ...badgeStyle, backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' }}><ShieldAlert size={12}/> Critical Stock</span>;
      case 'Low Stock':
        return <span style={{ ...badgeStyle, backgroundColor: '#fefce8', color: '#ca8a04', border: '1px solid #fef08a' }}><Activity size={12}/> Low Stock</span>;
      case 'Expiring Soon':
        return <span style={{ ...badgeStyle, backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}><Clock size={12}/> Expiring Soon</span>;
      default:
        return <span style={{ ...badgeStyle, backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}><CheckCircle size={12}/> In Stock</span>;
    }
  };

  const getCategoryBadge = (cat) => {
    const style = {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      fontSize: '0.73rem',
      fontWeight: 600,
      padding: '3px 10px',
      borderRadius: '8px',
      textTransform: 'none',
      letterSpacing: 'normal'
    };

    switch (cat) {
      case 'Medicine':
        return <span style={{ ...style, backgroundColor: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff' }}>💊 Medicine</span>;
      case 'Accessories & Toys':
        return <span style={{ ...style, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe' }}>🧸 Accessories & Toys</span>;
      case 'Food & Snacks':
        return <span style={{ ...style, backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>🥩 Food & Snacks</span>;
      case 'Service':
        return <span style={{ ...style, backgroundColor: '#ecfeff', color: '#0e7490', border: '1px solid #cffaff' }}>🩺 Service</span>;
      case 'Vitamins & Supplements':
        return <span style={{ ...style, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #d1fae5' }}>🧪 Vitamins</span>;
      case 'Hygiene Items':
        return <span style={{ ...style, backgroundColor: '#f0fdfa', color: '#0f766e', border: '1px solid #ccfbf1' }}>🧼 Hygiene</span>;
      default:
        return <span style={{ ...style, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>{cat || 'General'}</span>;
    }
  };

  const categoryCounts = {
    'All': stock.length,
    'Medicine': stock.filter(i => i.category === 'Medicine').length,
    'Accessories & Toys': stock.filter(i => i.category === 'Accessories & Toys').length,
    'Food & Snacks': stock.filter(i => i.category === 'Food & Snacks').length,
    'Service': stock.filter(i => i.category === 'Service').length,
    'Vitamins & Supplements': stock.filter(i => i.category === 'Vitamins & Supplements').length,
    'Hygiene Items': stock.filter(i => i.category === 'Hygiene Items').length,
  };

  const activeFilterCount = (categoryFilter ? 1 : 0) + (statusFilter ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const resetAllFilters = () => {
    setCategoryFilter('');
    setStatusFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

  const filteredStock = stock.filter(item => {
    const statusText = getComputedStatus(item.qty, item.lowStockLimit, item.expiry);
    
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.batchNumber && item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    
    let matchesStatus = true;
    if (statusFilter === 'In Stock') matchesStatus = statusText === 'In Stock';
    else if (statusFilter === 'Low Stock') matchesStatus = statusText === 'Low Stock' || statusText === 'Critical Stock';
    else if (statusFilter === 'Out of Stock') matchesStatus = statusText === 'Out of Stock';
    else if (statusFilter === 'Expiring Soon') matchesStatus = statusText === 'Expiring Soon';
    else if (statusFilter === 'Active') matchesStatus = item.status === 'Active' || !item.name.toLowerCase().includes('inactive');
    else if (statusFilter === 'Inactive') matchesStatus = item.status === 'Inactive' || item.name.toLowerCase().includes('inactive');

    const itemPrice = item.price || 0;
    const matchesMinPrice = minPrice !== '' ? itemPrice >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice !== '' ? itemPrice <= parseFloat(maxPrice) : true;

    return matchesSearch && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice;
  });

  const uniqueCategories = Array.from(new Set(stock.map(item => item.category).filter(Boolean)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .table-row-hover {
          transition: background-color 0.15s ease;
        }
        .table-row-hover:hover {
          background-color: var(--primary-teal-light) !important;
        }
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease !important;
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05), 0 8px 16px -8px rgba(0, 0, 0, 0.05) !important;
          border-color: var(--primary-teal) !important;
        }
        .custom-table th {
          border-bottom: 1.5px solid var(--border);
        }
        .custom-table td {
          vertical-align: middle;
        }
      `}</style>
      
      {/* Header */}
      <div className="page-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: 0 }}>
            Clinic Inventory Control
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
            Real-time batch tracking, stock level monitoring, and expiration alerts.
          </p>
        </div>
        <div className="page-header-actions">
        <button 
          onClick={() => setShowAddForm(true)} 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.65rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', borderRadius: '8px', boxShadow: '0 4px 10px rgba(45, 212, 191, 0.15)' }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Top KPI Cards (Interactive Filters) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '0.5rem' }}>
        {/* Card 1: Total medicines */}
        <div 
          className="card hover-lift" 
          onClick={() => setStatusFilter('')} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
            cursor: 'pointer', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
            outline: statusFilter === '' ? '2px solid var(--primary-teal)' : 'none',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
            transition: 'all 0.2s ease', borderRadius: '12px'
          }}
          title="Click to view all items"
        >
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--primary-teal-light)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={22} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Total Items</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{totalItems}</h3>
          </div>
        </div>

        {/* Card 2: Low Stock */}
        <div 
          className="card hover-lift" 
          onClick={() => setStatusFilter('Low Stock')} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
            cursor: 'pointer', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
            outline: statusFilter === 'Low Stock' ? '2px solid var(--warning)' : 'none',
            background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
            transition: 'all 0.2s ease', borderRadius: '12px'
          }}
          title="Click to filter low stock items"
        >
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Low Stock Alert</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{lowStockCount}</h3>
          </div>
        </div>

        {/* Card 3: Expiring Soon */}
        <div 
          className="card hover-lift" 
          onClick={() => setStatusFilter('Expiring Soon')} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
            cursor: 'pointer', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
            outline: statusFilter === 'Expiring Soon' ? '2px solid #f59e0b' : 'none',
            background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
            transition: 'all 0.2s ease', borderRadius: '12px'
          }}
          title="Click to filter expiring soon items"
        >
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Expiring Soon</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{expiringSoonCount}</h3>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div 
          className="card hover-lift" 
          onClick={() => setStatusFilter('Out of Stock')} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
            cursor: 'pointer', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
            outline: statusFilter === 'Out of Stock' ? '2px solid var(--danger)' : 'none',
            background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
            transition: 'all 0.2s ease', borderRadius: '12px'
          }}
          title="Click to filter out of stock items"
        >
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Out of Stock</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>{outOfStockCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Stock Table view */}
      {(() => {
        const renderTableCard = (inPortal = false) => (
          <div 
            className="card animate-fade-in-up" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.5rem',
              backgroundColor: '#fff',
              ...(inPortal ? {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999999,
                borderRadius: 0,
                overflowY: 'auto',
                backgroundColor: '#f8fafc',
                padding: '1.5rem 2.5rem',
                boxSizing: 'border-box'
              } : {})
            }}
          >
            {/* Unified Toolbar Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '0.5rem' }}>
              {/* Left Side: Search & Filter Dropdowns */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Search Box */}
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search name/SKU..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.25rem', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem', height: '36px' }}
                  />
                </div>

                {/* Category Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="form-control"
                    style={{ width: '170px', height: '36px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 8px', backgroundColor: 'var(--background)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}
                  >
                    <option value="">All Categories</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat} ({stock.filter(i => i.category === cat).length})</option>
                    ))}
                  </select>
                </div>

                {/* Status Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-control"
                    style={{ width: '170px', height: '36px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid var(--border)', padding: '0 8px', backgroundColor: 'var(--background)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}
                  >
                    <option value="">All Statuses</option>
                    <option value="In Stock">In Stock ({stock.filter(item => getComputedStatus(item.qty, item.lowStockLimit, item.expiry) === 'In Stock').length})</option>
                    <option value="Low Stock">Low Stock ({lowStockCount})</option>
                    <option value="Out of Stock">Out of Stock ({outOfStockCount})</option>
                    <option value="Expiring Soon">Expiring Soon ({expiringSoonCount})</option>
                    <option value="Active">Active Only</option>
                    <option value="Inactive">Inactive Only</option>
                  </select>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="btn btn-secondary"
                    style={{ height: '36px', padding: '0 12px', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger)', backgroundColor: '#fef2f2', fontWeight: 600 }}
                  >
                    <RotateCcw size={12} /> Clear Filters
                  </button>
                )}
              </div>

              {/* Right Side: Action Buttons */}
              <div className="page-header-actions" style={{ alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                  className={`btn ${showFilterDrawer || minPrice || maxPrice ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 12px', fontSize: '0.8rem', borderRadius: '8px', fontWeight: 600 }}
                >
                  <SlidersHorizontal size={14} />
                  <span>Price Range</span>
                  {(minPrice || maxPrice) && (
                    <span style={{
                      backgroundColor: '#fff',
                      color: 'var(--primary-teal)',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 800
                    }}>
                      !
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowScannerModal(true)}
                  className="btn btn-secondary"
                  style={{ height: '36px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600 }}
                  title="Scan Barcode using Webcam"
                >
                  <Camera size={15} style={{ color: 'var(--primary-teal)' }} />
                  <span>Scan SKU</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 12px', fontSize: '0.8rem', borderRadius: '8px', fontWeight: 600 }}
                >
                  {inPortal ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  <span>{inPortal ? "Exit Fullscreen" : "Full Screen"}</span>
                </button>
              </div>
            </div>

            {/* Advanced Price Filter Drawer */}
            {showFilterDrawer && (
              <div 
                className="animate-fade-in-up"
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <Filter size={14} /> Price Range Search Filters
                  </h4>
                  <button type="button" onClick={() => setShowFilterDrawer(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Minimum Price (Rs)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 100"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      style={{ height: '36px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Maximum Price (Rs)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 5000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      style={{ height: '36px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                  <button type="button" onClick={resetAllFilters} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', height: '30px' }}>
                    <RotateCcw size={12} /> Reset
                  </button>
                  <button type="button" onClick={() => setShowFilterDrawer(false)} className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', height: '30px' }}>
                    Apply Filters ({filteredStock.length} Results)
                  </button>
                </div>
              </div>
            )}

            {/* Table Responsive Scroll View */}
            <div className="table-responsive" style={{ maxHeight: inPortal ? 'calc(100vh - 240px)' : '550px', overflowY: 'auto', overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <table className="custom-table" style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 10, borderBottom: '2px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Medicine / Product Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Category</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Batch No.</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Quantity</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Price</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Expiry Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Supplier</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '4rem' }}>
                        <Loader size={32} className="animate-spin" style={{ margin: '0 auto', color: 'var(--primary-teal)' }} />
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading inventory records...</p>
                      </td>
                    </tr>
                  ) : filteredStock.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        No inventory items found matching your criteria.
                      </td>
                    </tr>
                  ) : filteredStock.map((item) => {
                    const statusText = getComputedStatus(item.qty, item.lowStockLimit, item.expiry);
                    const isAlert = statusText === 'Out of Stock' || statusText === 'Low Stock' || statusText === 'Critical Stock';
                    return (
                      <tr key={item.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{item.name}</span>
                        </td>
                        <td style={{ padding: '1rem' }}>{getCategoryBadge(item.category)}</td>
                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.batchNumber}</td>
                        <td style={{ padding: '1rem', color: isAlert ? 'var(--danger)' : 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                          {item.qty} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{item.unit}</span>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary-teal)', fontSize: '0.875rem' }}>{formatCurrency(item.price)}</td>
                        <td style={{ padding: '1rem', color: statusText === 'Expiring Soon' ? '#d97706' : 'var(--text-primary)', fontWeight: statusText === 'Expiring Soon' ? 700 : 500, fontSize: '0.85rem' }}>{item.expiry}</td>
                        <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.supplier || '-'}</td>
                        <td style={{ padding: '1rem' }}>{getStatusBadge(statusText)}</td>
                        <td style={{ textAlign: 'right', padding: '1rem' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button 
                              onClick={() => {
                                setRefillModalItem(item);
                                setAddQtyInput(10);
                                setNewRefillExpiry(item.expiry || '');
                                setRefillNotes('');
                              }} 
                              className="btn btn-secondary btn-sm" 
                              style={{ padding: '6px', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                              title="Refill Stock"
                            >
                              <Plus size={14} style={{ color: 'var(--primary-teal)' }} />
                            </button>
                            <button 
                              onClick={() => handleEditClick(item)} 
                              className="btn btn-secondary btn-sm" 
                              style={{ padding: '6px', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                              title="Edit Item"
                            >
                              <Edit3 size={14} style={{ color: 'var(--secondary-blue)' }} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(item.id)} 
                              className="btn btn-secondary btn-sm" 
                              style={{ padding: '6px', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                              title="Delete Item"
                            >
                              <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

        if (isFullScreen) {
          return (
            <>
              <div className="card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#f1f5f9', borderRadius: '12px' }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
                  📺 Full Screen Mode Active
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                  The inventory stock database is expanded to fill your viewport.
                </p>
                <button onClick={() => setIsFullScreen(false)} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Minimize2 size={16} /> Exit Full Screen
                </button>
              </div>
              {createPortal(renderTableCard(true), document.body)}
            </>
          );
        }

        return renderTableCard(false);
      })()}

      {/* Manual Add / Edit Product Modal */}
      {showAddForm && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          zIndex: 999999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backdropFilter: 'blur(6px)',
        }}>
          <div className="animate-fade-in-up" style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            borderTop: '5px solid var(--primary-teal)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={22} style={{ color: 'var(--primary-teal)' }} /> {editingItem ? 'Adjust Product Details' : 'Add New Inventory Item'}
              </h3>
              <button onClick={resetForm} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleAddStock}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Medicine Name *</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rabies Vaccine" required style={{ height: '38px', fontSize: '0.9rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Category *</label>
                  <FormSelect
                    value={category}
                    onChange={setCategory}
                    placeholder="-- Choose Category --"
                    required
                    options={[
                      { value: '', label: '-- Choose Category --' },
                      { value: 'Medicine', label: 'Medicine' },
                      { value: 'Vaccine', label: 'Vaccine' },
                      { value: 'Accessories & Toys', label: 'Accessories & Toys' },
                      { value: 'Hygiene Items', label: 'Hygiene Items' },
                      { value: 'Food & Snacks', label: 'Food & Snacks' },
                      { value: 'Vitamins', label: 'Vitamins' },
                      { value: 'Parasiticide', label: 'Parasiticide' },
                      { value: 'Consumables', label: 'Consumables' },
                    ]}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Batch Number / SKU *</label>
                  <input type="text" className="form-control" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} placeholder="e.g. RB-9920K" required style={{ height: '38px', fontSize: '0.9rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Expiry Date *</label>
                  <input type="date" className="form-control" value={expiry} onChange={(e) => setExpiry(e.target.value)} required style={{ height: '38px', fontSize: '0.9rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Available Quantity *</label>
                  <input type="number" className="form-control" value={qty} onChange={(e) => setQty(e.target.value)} required style={{ height: '38px', fontSize: '0.9rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Low Stock Alert Limit *</label>
                  <input type="number" className="form-control" value={lowStockLimit} onChange={(e) => setLowStockLimit(e.target.value)} required style={{ height: '38px', fontSize: '0.9rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Measurement Unit</label>
                  <FormSelect
                    value={unit}
                    onChange={setUnit}
                    options={[
                      { value: 'Vials', label: 'Vials' },
                      { value: 'Bottles', label: 'Bottles' },
                      { value: 'Strips', label: 'Strips' },
                      { value: 'Ampoules', label: 'Ampoules' },
                      { value: 'Pairs', label: 'Pairs' },
                      { value: 'Bags', label: 'Bags' },
                      { value: 'Pieces', label: 'Pieces' },
                      { value: 'Packets', label: 'Packets' },
                    ]}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Selling Price (Rs) *</label>
                  <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ height: '38px', fontSize: '0.9rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>GST Tax (%)</label>
                  <input type="number" className="form-control" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="0" style={{ height: '38px', fontSize: '0.9rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Supplier Brand</label>
                  <input type="text" className="form-control" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="e.g. Zoetis India" style={{ height: '38px', fontSize: '0.9rem' }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Update Notes</label>
                  <input type="text" className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Refill from supplier" style={{ height: '38px', fontSize: '0.9rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <button type="button" onClick={resetForm} className="btn btn-secondary" style={{ padding: '0.55rem 1.25rem' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.55rem 1.5rem', fontWeight: 700 }}>
                  <CheckCircle size={16} /> Confirm Save
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)' }}>
          <div className="animate-fade-in-up" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--danger-light)', borderRadius: '50%', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Remove Product</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Are you sure you want to delete this product? This action will permanently remove it from the clinic stock.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="btn" 
                  style={{ flex: 1, padding: '0.65rem', backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Stock Refill / Quantity Addition Modal */}
      {refillModalItem && createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 999999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="animate-fade-in-up" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '540px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', borderTop: '5px solid var(--primary-teal)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ marginBottom: '6px' }}>{getCategoryBadge(refillModalItem.category)}</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Refill Stock Quantity
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  {refillModalItem.name} <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>(Batch: {refillModalItem.batchNumber || 'N/A'})</span>
                </p>
              </div>
              <button onClick={() => setRefillModalItem(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Inventory Item Quick Summary Box */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Current Price</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-teal)' }}>{formatCurrency(refillModalItem.price)}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Supplier</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{refillModalItem.supplier || '-'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Expiry Date</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{refillModalItem.expiry || 'Not set'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Current Stock</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: refillModalItem.qty === 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                  {refillModalItem.qty} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{refillModalItem.unit || 'Units'}</span>
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmRefill} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Quantity to Add Input */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  Quantity to Add ({refillModalItem.unit || 'Units'}) *
                </label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="1" 
                  value={addQtyInput} 
                  onChange={(e) => setAddQtyInput(e.target.value)} 
                  required 
                  style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-teal)', padding: '0.6rem 1rem', height: '44px' }}
                />
              </div>

              {/* Live Calculation Preview Box */}
              <div style={{ backgroundColor: 'var(--primary-teal-light)', border: '1.5px dashed var(--primary-teal)', borderRadius: '8px', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-teal)', textTransform: 'uppercase' }}>NEW TOTAL STOCK PREVIEW</span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Current: <strong>{refillModalItem.qty}</strong> + Adding: <strong style={{ color: 'var(--success)' }}>+{parseInt(addQtyInput) || 0}</strong>
                  </div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-teal)' }}>
                  {(parseInt(refillModalItem.qty) || 0) + (parseInt(addQtyInput) || 0)} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{refillModalItem.unit || 'Units'}</span>
                </div>
              </div>

              {/* Optional Expiry Update */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Updated Expiry Date (Optional)</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={newRefillExpiry} 
                  onChange={(e) => setNewRefillExpiry(e.target.value)} 
                  style={{ height: '38px' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setRefillModalItem(null)} className="btn btn-secondary" style={{ flex: 1, fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Plus size={18} /> Confirm Stock
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Webcam Barcode Scanner Modal */}
      {showScannerModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 99999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)' }}>
          <div className="animate-fade-in-up" style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
            
            {/* Inject Laser Scanning Animation CSS */}
            <style>{`
              @keyframes scanLaser {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} style={{ color: 'var(--primary-teal)' }} /> Webcam Barcode Scanner
              </h3>
              <button onClick={closeScanner} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            {/* Video Viewport Container */}
            <div style={{ position: 'relative', width: '100%', height: '260px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', border: '2px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Corner targeting brackets */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', width: '20px', height: '20px', borderLeft: '3px solid var(--primary-teal)', borderTop: '3px solid var(--primary-teal)' }} />
              <div style={{ position: 'absolute', top: '20px', right: '20px', width: '20px', height: '20px', borderRight: '3px solid var(--primary-teal)', borderTop: '3px solid var(--primary-teal)' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '20px', height: '20px', borderLeft: '3px solid var(--primary-teal)', borderBottom: '3px solid var(--primary-teal)' }} />
              <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '20px', height: '20px', borderRight: '3px solid var(--primary-teal)', borderBottom: '3px solid var(--primary-teal)' }} />

              {/* Red moving laser scan line */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, height: '3px',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 10px #ef4444',
                animation: 'scanLaser 2s linear infinite'
              }} />

              {/* Live Video element */}
              <video 
                ref={videoRef} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                muted 
                playsInline
              />

              {/* Scanning status banner */}
              <div style={{ position: 'absolute', bottom: '15px', backgroundColor: 'rgba(15,23,42,0.85)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', color: '#38bdf8', border: '1px solid #334155' }}>
                {scanStatus}
              </div>
            </div>

            {/* Simulated mock search triggers for demo capability */}
            <div style={{ marginTop: '1.25rem', backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Quick Scan Simulation (Click to Mock Scan)
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {stock.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleBarcodeSuccess(item.sku)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', fontWeight: 600, borderRadius: '6px', cursor: 'pointer' }}
                  >
                    🔍 {item.name.split(' ')[0]} ({item.sku})
                  </button>
                ))}
                {stock.length === 0 && (
                  <button
                    type="button"
                    onClick={() => handleBarcodeSuccess('RB-9920K')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', fontWeight: 600, borderRadius: '6px', cursor: 'pointer' }}
                  >
                    🔍 Rabies Vaccine (RB-9920K)
                  </button>
                )}
              </div>
            </div>

            {/* Cancel button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
              <button 
                type="button" 
                onClick={closeScanner} 
                className="btn btn-secondary btn-sm"
                style={{ backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' }}
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
