const db = require('../config/db');

// Helper to format date
const getFormattedDate = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getFullYear()).substring(2)}`;
};

const getFormattedTime = () => {
    const now = new Date();
    const datePart = getFormattedDate();
    const timePart = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    return `${datePart}, ${timePart}`;
};

// 1. Clinic User: Create a support ticket
const createTicket = async (req, res) => {
    try {
        const { subject, description, priority = 'Medium', category = 'Technical' } = req.body;
        const userId = req.user?.id || null;
        const adminName = req.user?.name || req.user?.email || 'Admin User';
        const email = req.user?.email || 'admin@clinic.com';
        
        // Find clinic/admin details from user row or defaults
        const clinicName = req.user?.clinicName || 'My Veterinary Clinic';

        if (!subject || !description) {
            return res.status(400).json({ status: 'error', message: 'Subject and description are required.' });
        }

        const ticketId = `TKT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
        const formattedDate = getFormattedDate();
        const formattedTime = getFormattedTime();

        const messages = [
            { sender: 'Admin', text: description, time: formattedTime, isUser: true }
        ];

        const query = `
            INSERT INTO saas_support_tickets 
            (id, clinic_admin_id, clinic, adminName, email, subject, priority, category, status, updated, messages)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [
            ticketId,
            userId,
            clinicName,
            adminName,
            email,
            subject,
            priority,
            category,
            'Open',
            formattedDate,
            JSON.stringify(messages)
        ]);

        res.status(201).json({
            status: 'success',
            message: 'Support ticket raised successfully.',
            data: {
                id: ticketId,
                subject,
                priority,
                category,
                status: 'Open',
                updated: formattedDate,
                messages
            }
        });
    } catch (err) {
        console.error('Error creating ticket:', err);
        res.status(500).json({ status: 'error', message: 'Server error while raising ticket.', error: err.message });
    }
};

// 2. Clinic User: Get all tickets for this user/clinic
const getMyTickets = async (req, res) => {
    try {
        const userId = req.user?.id;
        let query = 'SELECT * FROM saas_support_tickets ORDER BY created_at DESC';
        let params = [];

        // If not super admin or manager, filter by clinic_admin_id
        if (req.user?.role !== 'SUPER_ADMIN' && userId) {
            query = 'SELECT * FROM saas_support_tickets WHERE clinic_admin_id = ? ORDER BY created_at DESC';
            params = [userId];
        }

        const [rows] = await db.query(query, params);
        
        // Parse messages JSON
        const formatted = rows.map(r => ({
            ...r,
            messages: typeof r.messages === 'string' ? JSON.parse(r.messages) : r.messages
        }));

        res.json({ status: 'success', data: formatted });
    } catch (err) {
        console.error('Error fetching tickets:', err);
        res.status(500).json({ status: 'error', message: 'Server error while fetching tickets.' });
    }
};

// 3. Clinic User: Reply to their ticket
const replyToTicketAsUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const sender = req.user?.name || req.user?.email || 'Admin';

        if (!text) {
            return res.status(400).json({ status: 'error', message: 'Message text is required.' });
        }

        const [tickets] = await db.query('SELECT * FROM saas_support_tickets WHERE id = ?', [id]);
        if (tickets.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Ticket not found.' });
        }

        const ticket = tickets[0];
        const messages = typeof ticket.messages === 'string' ? JSON.parse(ticket.messages) : ticket.messages;

        const formattedTime = getFormattedTime();
        const newMsg = {
            sender: 'Admin',
            text: text.trim(),
            time: formattedTime,
            isUser: true
        };

        const updatedMessages = [...messages, newMsg];
        const updatedDate = getFormattedDate();

        await db.query(
            'UPDATE saas_support_tickets SET status = ?, updated = ?, messages = ? WHERE id = ?',
            ['Open', updatedDate, JSON.stringify(updatedMessages), id]
        );

        res.json({
            status: 'success',
            data: {
                ...ticket,
                status: 'Open',
                updated: updatedDate,
                messages: updatedMessages
            }
        });
    } catch (err) {
        console.error('Error replying to ticket:', err);
        res.status(500).json({ status: 'error', message: 'Server error while posting reply.' });
    }
};

// 4. Super Admin: Get all tickets across clinics
const getAllTicketsForSuperAdmin = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM saas_support_tickets ORDER BY created_at DESC');
        const formatted = rows.map(r => ({
            ...r,
            messages: typeof r.messages === 'string' ? JSON.parse(r.messages) : r.messages
        }));
        res.json({ status: 'success', data: formatted });
    } catch (err) {
        console.error('Error fetching tickets for SuperAdmin:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch support tickets.' });
    }
};

// 5. Super Admin: Reply to ticket
const replyTicketAsSuperAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ status: 'error', message: 'Reply text is required.' });
        }

        const [rows] = await db.query('SELECT * FROM saas_support_tickets WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Ticket not found.' });
        }

        const ticket = rows[0];
        const messages = typeof ticket.messages === 'string' ? JSON.parse(ticket.messages) : ticket.messages;

        const formattedTime = getFormattedTime();
        const newMsg = {
            sender: 'Superadmin',
            text: text.trim(),
            time: formattedTime,
            isUser: false
        };

        const updatedMessages = [...messages, newMsg];
        const updatedDate = getFormattedDate();

        await db.query(
            'UPDATE saas_support_tickets SET status = ?, updated = ?, messages = ? WHERE id = ?',
            ['Replied', updatedDate, JSON.stringify(updatedMessages), id]
        );

        res.json({
            status: 'success',
            data: {
                ...ticket,
                status: 'Replied',
                updated: updatedDate,
                messages: updatedMessages
            }
        });
    } catch (err) {
        console.error('Error replying as SuperAdmin:', err);
        res.status(500).json({ status: 'error', message: 'Failed to post reply.' });
    }
};

// 6. Super Admin: Update ticket status
const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ status: 'error', message: 'Status is required.' });
        }

        const [rows] = await db.query('SELECT * FROM saas_support_tickets WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Ticket not found.' });
        }

        const updatedDate = getFormattedDate();

        await db.query(
            'UPDATE saas_support_tickets SET status = ?, updated = ? WHERE id = ?',
            [status, updatedDate, id]
        );

        res.json({
            status: 'success',
            message: 'Ticket status updated successfully.',
            data: { id, status, updated: updatedDate }
        });
    } catch (err) {
        console.error('Error updating ticket status:', err);
        res.status(500).json({ status: 'error', message: 'Failed to update status.' });
    }
};

module.exports = {
    createTicket,
    getMyTickets,
    replyToTicketAsUser,
    getAllTicketsForSuperAdmin,
    replyTicketAsSuperAdmin,
    updateTicketStatus
};
