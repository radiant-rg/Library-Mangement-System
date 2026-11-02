import { supabase } from '../supabase/client.js';
import * as libraryApi from '../supabase/library-api.js';

const appState = {
  state: {
    books: [],
    members: [],
    issues: [],
    reservations: [],
    fines: [],
    activities: [],
    currentUser: null,
    currentSection: 'dashboard',
    theme: localStorage.getItem('libracore_theme') || 'light'
  },
  setState(key, value) {
    this.state[key] = value;
  }
};

const utils = {
  sanitize(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  },
  formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(Number(value) || 0);
  },
  formatDate(value) {
    if (!value) return '-';
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? '-'
      : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
};

const toast = {
  show(message, type = 'info', title = 'Notification') {
    const container = document.getElementById('toast-container');
    const element = document.createElement('div');
    element.className = `toast ${type}`;
    element.innerHTML = `<div class="toast-content"><div class="toast-title">${utils.sanitize(title)}</div><div class="toast-msg">${utils.sanitize(message)}</div></div>`;
    container.appendChild(element);
    window.setTimeout(() => {
      element.style.opacity = '0';
      window.setTimeout(() => element.remove(), 300);
    }, 4000);
  }
};

const modal = {
  open(title, bodyHtml, footerHtml = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-footer').innerHTML = footerHtml;
    const backdrop = document.getElementById('modal-backdrop');
    backdrop.classList.add('show');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  },
  close() {
    const backdrop = document.getElementById('modal-backdrop');
    backdrop.classList.remove('show');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

function isStaff() {
  return ['admin', 'librarian'].includes(appState.state.currentUser?.role);
}

function isAdmin() {
  return appState.state.currentUser?.role === 'admin';
}

function badge(status, className = '') {
  return `<span class="badge ${className}">${utils.sanitize(status)}</span>`;
}

function tableEmpty(message, colspan) {
  return `<tr><td colspan="${colspan}" style="text-align:center;padding:2rem;color:var(--text-muted)">${utils.sanitize(message)}</td></tr>`;
}

async function refreshLibraryData() {
  Object.assign(appState.state, await libraryApi.loadLibraryData());
}

function updateUserDisplay() {
  const user = appState.state.currentUser;
  document.getElementById('user-display-name').textContent = user.name;
  document.getElementById('user-display-role').textContent = user.role[0].toUpperCase() + user.role.slice(1);
  document.getElementById('user-avatar').textContent = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  document.querySelectorAll('.nav-item[data-section]').forEach(button => {
    const section = button.dataset.section;
    const visible = isAdmin()
      || (isStaff() && section !== 'settings')
      || (appState.state.currentUser.role === 'member'
        && ['dashboard', 'books', 'circulation', 'reservations', 'fines'].includes(section));
    button.hidden = !visible;
  });
  document.querySelector('[data-action="settings"]').hidden = !isAdmin();
}

function openProfile() {
  const user = appState.state.currentUser;
  modal.open('My Profile', `
    <dl class="profile-details">
      <dt>Name</dt><dd>${utils.sanitize(user.name)}</dd>
      <dt>Email</dt><dd>${utils.sanitize(user.email)}</dd>
      <dt>Role</dt><dd>${utils.sanitize(user.role)}</dd>
      <dt>Account</dt><dd>${utils.sanitize(user.status)}</dd>
    </dl>
  `);
}

function renderDashboard() {
  const { books, members, issues, reservations, fines, activities, currentUser } = appState.state;
  const totalCopies = books.reduce((total, book) => total + book.totalCopies, 0);
  const availableCopies = books.reduce((total, book) => total + book.availableCopies, 0);
  const activeIssues = issues.filter(issue => issue.status !== 'Returned');
  const overdueIssues = issues.filter(issue => issue.status === 'Overdue');
  const pendingReservations = reservations.filter(item => item.status === 'Pending');
  const outstandingFines = fines.reduce((total, fine) => total + fine.amount - fine.paidAmount, 0);
  const borrowCounts = new Map();
  issues.forEach(issue => borrowCounts.set(issue.bookId, (borrowCounts.get(issue.bookId) || 0) + 1));
  const popularBooks = [...books].sort((a, b) =>
    (borrowCounts.get(b.id) || 0) - (borrowCounts.get(a.id) || 0)
  ).slice(0, 4);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Good day, ${utils.sanitize(currentUser.name)}</h1>
        <p class="page-subtitle">Library activity and lending at a glance.</p>
      </div>
      ${isStaff() ? '<button class="btn btn-primary" id="btn-quick-issue">Issue Book</button>' : ''}
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Total Copies</div><div class="stat-value">${totalCopies}</div><div class="stat-footer">${books.length} titles</div></div>
      <div class="stat-card"><div class="stat-label">Available Copies</div><div class="stat-value">${availableCopies}</div><div class="stat-footer">Ready to borrow</div></div>
      <div class="stat-card"><div class="stat-label">Active Borrowings</div><div class="stat-value">${activeIssues.length}</div><div class="stat-footer">Not yet returned</div></div>
      <div class="stat-card"><div class="stat-label">${isStaff() ? 'Registered Members' : 'My Account'}</div><div class="stat-value">${isStaff() ? members.length : 1}</div><div class="stat-footer">${overdueIssues.length} overdue loans</div></div>
      <div class="stat-card"><div class="stat-label">Overdue Books</div><div class="stat-value">${overdueIssues.length}</div><div class="stat-footer">Requires follow-up</div></div>
      <div class="stat-card"><div class="stat-label">Outstanding Fines</div><div class="stat-value">${utils.formatCurrency(outstandingFines)}</div><div class="stat-footer">${pendingReservations.length} pending reservations</div></div>
    </div>
    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header"><h3 class="card-title">Most Borrowed Books</h3><button class="btn btn-sm btn-secondary" id="btn-dashboard-books">View Catalog</button></div>
        <div class="books-grid">
          ${popularBooks.length ? popularBooks.map(book => `
            <div class="book-card">
              <div class="book-cover" style="background:${utils.sanitize(book.coverBg)}"><div class="book-cover-title">${utils.sanitize(book.title)}</div></div>
              <div class="book-card-body"><div class="book-title">${utils.sanitize(book.title)}</div>
                <div class="book-author">${utils.sanitize(book.author)}</div>
                <div class="book-meta">${badge(`${book.availableCopies} available`, book.availableCopies ? 'badge-success' : 'badge-danger')}
                  <span>${borrowCounts.get(book.id) || 0} loans</span></div>
              </div>
            </div>`).join('') : '<p class="text-muted">No books have been added yet.</p>'}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3 class="card-title">Recent Activity</h3></div>
        <div class="activity-list">
          ${activities.length ? activities.slice(0, 5).map(activity => `
            <div class="activity-item"><div class="activity-avatar">${utils.sanitize(activity.userName[0] || 'M')}</div>
              <div class="activity-details"><div><strong>${utils.sanitize(activity.userName)}</strong> ${utils.sanitize(activity.action.toLowerCase())} <em>"${utils.sanitize(activity.bookTitle)}"</em></div>
                <div class="activity-time">${utils.formatDate(activity.timestamp)}</div></div>
            </div>`).join('') : '<p class="text-muted">No circulation activity yet.</p>'}
        </div>
      </div>
    </div>
  `;
}

function bookRows(books) {
  return books.length ? books.map(book => {
    const activeReservation = appState.state.reservations.some(item =>
      item.bookId === book.id && item.status === 'Pending'
      && item.memberId === appState.state.currentUser.memberId
    );
    const actions = isStaff()
      ? `<button class="btn btn-sm btn-secondary btn-edit-book" data-id="${utils.sanitize(book.id)}">Edit</button>
         <button class="btn btn-sm btn-danger btn-delete-book" data-id="${utils.sanitize(book.id)}">Archive</button>`
      : book.availableCopies === 0 && !activeReservation
        ? `<button class="btn btn-sm btn-secondary btn-reserve-book" data-id="${utils.sanitize(book.id)}">Reserve</button>`
        : activeReservation ? badge('Reserved', 'badge-warning') : '-';
    return `<tr>
      <td><code>${utils.sanitize(book.id.slice(0, 8))}</code></td>
      <td><div style="font-weight:600">${utils.sanitize(book.title)}</div><div style="font-size:.78rem;color:var(--text-muted)">${utils.sanitize(book.author)}</div></td>
      <td>${utils.sanitize(book.category)}</td><td><small>${utils.sanitize(book.isbn)}</small></td>
      <td>${utils.sanitize(book.shelf)}</td><td><strong>${book.availableCopies}</strong> / ${book.totalCopies}</td>
      <td>${badge(book.availableCopies ? 'Available' : 'Out of stock', book.availableCopies ? 'badge-success' : 'badge-danger')}</td>
      <td>${actions}</td>
    </tr>`;
  }).join('') : tableEmpty('No books found.', 8);
}

function renderBooks() {
  const categories = [...new Set(appState.state.books.map(book => book.category))].sort();
  return `
    <div class="page-header"><div><h1 class="page-title">Book Catalog</h1><p class="page-subtitle">Search availability and manage library titles.</p></div>
      ${isStaff() ? '<button class="btn btn-primary" id="btn-add-book">Add New Book</button>' : ''}
    </div>
    <div class="card">
      <div class="toolbar">
        <div class="search-box"><input type="search" id="book-search-input" placeholder="Search title, author, or ISBN..." aria-label="Search books"></div>
        <div class="filter-group">
          <select class="form-select" id="book-filter-category"><option value="">All Categories</option>${categories.map(category => `<option value="${utils.sanitize(category)}">${utils.sanitize(category)}</option>`).join('')}</select>
          <select class="form-select" id="book-sort-by"><option value="title">Sort by Title</option><option value="author">Sort by Author</option><option value="available">Sort by Availability</option></select>
        </div>
      </div>
      <div class="table-responsive"><table class="data-table"><thead><tr><th>Book ID</th><th>Title & Author</th><th>Category</th><th>ISBN</th><th>Shelf</th><th>Copies (Avail/Total)</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${bookRows(appState.state.books)}</tbody></table></div>
    </div>
  `;
}

function renderMembers() {
  return `
    <div class="page-header"><div><h1 class="page-title">Library Members</h1><p class="page-subtitle">Manage membership records and account status.</p></div>
      <button class="btn btn-primary" id="btn-add-member">Add Member</button></div>
    <div class="card"><div class="table-responsive"><table class="data-table">
      <thead><tr><th>Member</th><th>Department</th><th>Type</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
      <tbody>${appState.state.members.length ? appState.state.members.map(member => `
        <tr><td><div style="font-weight:600">${utils.sanitize(member.name)}</div><div style="font-size:.78rem;color:var(--text-muted)">${utils.sanitize(member.email)}</div></td>
          <td>${utils.sanitize(member.department)}</td><td>${utils.sanitize(member.role)}</td><td>${utils.sanitize(member.phone)}</td>
          <td>${badge(member.status, member.status === 'Active' ? 'badge-success' : 'badge-danger')}</td><td>${utils.formatDate(member.joinedDate)}</td>
          <td><button class="btn btn-sm btn-secondary btn-edit-member" data-id="${utils.sanitize(member.id)}">Edit</button></td></tr>`).join('') : tableEmpty('No members registered yet.', 7)}</tbody>
    </table></div></div>
  `;
}

function renderCirculation() {
  return `
    <div class="page-header"><div><h1 class="page-title">${isStaff() ? 'Circulation Management' : 'My Borrowing History'}</h1><p class="page-subtitle">Current and completed book loans.</p></div>
      ${isStaff() ? '<button class="btn btn-primary" id="btn-issue-book-action">Issue Book</button>' : ''}</div>
    <div class="card"><div class="table-responsive"><table class="data-table">
      <thead><tr><th>Loan</th><th>Member</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${appState.state.issues.length ? appState.state.issues.map(issue => {
        const book = appState.state.books.find(item => item.id === issue.bookId);
        const member = appState.state.members.find(item => item.id === issue.memberId);
        const statusClass = issue.status === 'Returned' ? 'badge-secondary' : issue.status === 'Overdue' ? 'badge-danger' : 'badge-primary';
        return `<tr><td><code>${utils.sanitize(issue.id.slice(0, 8))}</code></td><td>${utils.sanitize(member?.name || 'Member')}</td>
          <td>${utils.sanitize(book?.title || 'Book')}</td><td>${utils.formatDate(issue.issueDate)}</td><td>${utils.formatDate(issue.dueDate)}</td>
          <td>${badge(issue.status, statusClass)}</td><td>${isStaff() && issue.status !== 'Returned' ? `<button class="btn btn-sm btn-secondary btn-return-action" data-id="${utils.sanitize(issue.id)}">Return Book</button>` : '-'}</td></tr>`;
      }).join('') : tableEmpty('No loans found.', 7)}</tbody>
    </table></div></div>
  `;
}

function renderReservations() {
  return `
    <div class="page-header"><div><h1 class="page-title">Book Reservations</h1><p class="page-subtitle">Track requests for unavailable titles.</p></div></div>
    <div class="card"><div class="table-responsive"><table class="data-table">
      <thead><tr><th>Reservation</th><th>Member</th><th>Book</th><th>Request Date</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${appState.state.reservations.length ? appState.state.reservations.map(reservation => {
        const member = appState.state.members.find(item => item.id === reservation.memberId);
        const book = appState.state.books.find(item => item.id === reservation.bookId);
        return `<tr><td><code>${utils.sanitize(reservation.id.slice(0, 8))}</code></td><td>${utils.sanitize(member?.name || 'Member')}</td>
          <td>${utils.sanitize(book?.title || 'Book')}</td><td>${utils.formatDate(reservation.date)}</td><td>${badge(reservation.status, 'badge-warning')}</td>
          <td>${reservation.status === 'Pending' ? `<button class="btn btn-sm btn-secondary btn-cancel-reservation" data-id="${utils.sanitize(reservation.id)}">Cancel</button>` : '-'}</td></tr>`;
      }).join('') : tableEmpty('No reservations found.', 6)}</tbody>
    </table></div></div>
  `;
}

function renderFines() {
  return `
    <div class="page-header"><div><h1 class="page-title">Fines Management</h1><p class="page-subtitle">Overdue charges and recorded payments.</p></div></div>
    <div class="card"><div class="table-responsive"><table class="data-table">
      <thead><tr><th>Fine</th><th>Member</th><th>Book</th><th>Days Overdue</th><th>Amount</th><th>Paid</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${appState.state.fines.length ? appState.state.fines.map(fine => {
        const member = appState.state.members.find(item => item.id === fine.memberId);
        const book = appState.state.books.find(item => item.id === fine.bookId);
        const balance = fine.amount - fine.paidAmount;
        return `<tr><td><code>${utils.sanitize(fine.id.slice(0, 8))}</code></td><td>${utils.sanitize(member?.name || 'Member')}</td>
          <td>${utils.sanitize(book?.title || 'Book')}</td><td>${fine.daysOverdue}</td><td>${utils.formatCurrency(fine.amount)}</td>
          <td>${utils.formatCurrency(fine.paidAmount)}</td><td>${badge(fine.status, fine.status === 'Paid' ? 'badge-success' : 'badge-danger')}</td>
          <td>${isStaff() && balance > 0 ? `<button class="btn btn-sm btn-primary btn-pay-fine" data-id="${utils.sanitize(fine.id)}" data-balance="${balance}">Record Payment</button>` : '-'}</td></tr>`;
      }).join('') : tableEmpty('No fines found.', 8)}</tbody>
    </table></div></div>
  `;
}

function renderReports() {
  const { books, members, issues, reservations, fines } = appState.state;
  const categoryCounts = new Map();
  books.forEach(book => categoryCounts.set(book.category, (categoryCounts.get(book.category) || 0) + 1));
  const monthlyCounts = new Map();
  issues.forEach(issue => {
    const month = issue.issueDate.slice(0, 7);
    monthlyCounts.set(month, (monthlyCounts.get(month) || 0) + 1);
  });
  const outstanding = fines.reduce((total, fine) => total + fine.amount - fine.paidAmount, 0);
  return `
    <div class="page-header"><div><h1 class="page-title">Reports & Analytics</h1><p class="page-subtitle">Current metrics from the library database.</p></div></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Book Titles</div><div class="stat-value">${books.length}</div></div>
      <div class="stat-card"><div class="stat-label">Members</div><div class="stat-value">${members.length}</div></div>
      <div class="stat-card"><div class="stat-label">Loans</div><div class="stat-value">${issues.length}</div></div>
      <div class="stat-card"><div class="stat-label">Pending Reservations</div><div class="stat-value">${reservations.filter(item => item.status === 'Pending').length}</div></div>
      <div class="stat-card"><div class="stat-label">Outstanding Fines</div><div class="stat-value">${utils.formatCurrency(outstanding)}</div></div>
    </div>
    <div class="dashboard-grid">
      <div class="card"><h3 class="card-title">Titles by Category</h3><div class="table-responsive"><table class="data-table"><thead><tr><th>Category</th><th>Titles</th></tr></thead>
        <tbody>${categoryCounts.size ? [...categoryCounts].sort((a, b) => b[1] - a[1]).map(([category, count]) => `<tr><td>${utils.sanitize(category)}</td><td>${count}</td></tr>`).join('') : tableEmpty('No catalog data available.', 2)}</tbody></table></div></div>
      <div class="card"><h3 class="card-title">Monthly Loans</h3><div class="table-responsive"><table class="data-table"><thead><tr><th>Month</th><th>Loans</th></tr></thead>
        <tbody>${monthlyCounts.size ? [...monthlyCounts].sort(([a], [b]) => b.localeCompare(a)).slice(0, 12).map(([month, count]) => `<tr><td>${utils.sanitize(month)}</td><td>${count}</td></tr>`).join('') : tableEmpty('No circulation data available.', 2)}</tbody></table></div></div>
    </div>
  `;
}

function renderSettings() {
  return `
    <div class="page-header"><div><h1 class="page-title">Settings & Data</h1><p class="page-subtitle">Export a copy of the library records available to your account.</p></div></div>
    <div class="card" style="max-width:650px;gap:1.25rem"><h3 class="card-title">Data Backup</h3>
      <p style="font-size:.88rem;color:var(--text-muted)">Exports the records visible to your account as a JSON file.</p>
      <button class="btn btn-primary" id="btn-export-json">Export Data (JSON)</button>
    </div>
  `;
}

const renderers = {
  dashboard: renderDashboard,
  books: renderBooks,
  members: renderMembers,
  circulation: renderCirculation,
  reservations: renderReservations,
  fines: renderFines,
  reports: renderReports,
  settings: renderSettings
};

function renderCurrentSection() {
  const section = appState.state.currentSection;
  if (!renderers[section]) appState.state.currentSection = 'dashboard';
  const currentSection = appState.state.currentSection;
  document.getElementById('main-content').innerHTML = renderers[currentSection]();
  document.querySelectorAll('.nav-item[data-section]').forEach(button => {
    button.classList.toggle('active', button.dataset.section === currentSection);
  });
  bindSectionEvents(currentSection);
}

async function runMutation(action, successMessage) {
  try {
    await action();
    await refreshLibraryData();
    renderCurrentSection();
    modal.close();
    toast.show(successMessage, 'success');
  } catch (error) {
    toast.show(error.message || 'The operation failed.', 'error', 'Unable to save');
  }
}

function formField(label, id, type = 'text', value = '', required = true, extra = '') {
  return `<div class="form-group"><label class="form-label" for="${id}">${label}</label><input class="form-input" id="${id}" name="${id}" type="${type}" value="${utils.sanitize(value)}" ${required ? 'required' : ''} ${extra}></div>`;
}

function openBookModal(book = null) {
  const isEditing = Boolean(book);
  const categories = [...new Set([...appState.state.books.map(item => item.category), 'Computer Science', 'Information Technology', 'Artificial Intelligence', 'Electronics & Communication'])].sort();
  const categoryOptions = categories.map(category => `<option value="${utils.sanitize(category)}" ${book?.category === category ? 'selected' : ''}>${utils.sanitize(category)}</option>`).join('');
  const body = `<form id="book-form" class="form-grid">
    ${formField('Book title', 'book-title', 'text', book?.title || '', true, 'maxlength="300"')}
    ${formField('Author(s)', 'book-author', 'text', book?.author || '', true, 'maxlength="300"')}
    <div class="form-group"><label class="form-label" for="book-category">Category</label><select class="form-select" id="book-category" required>${categoryOptions}</select></div>
    ${formField('ISBN', 'book-isbn', 'text', book?.isbn || '', false, 'maxlength="40"')}
    ${formField('Shelf', 'book-shelf', 'text', book?.shelf || '', false, 'maxlength="100"')}
    ${formField('Total copies', 'book-copies', 'number', book?.totalCopies ?? 1, true, 'min="1" step="1"')}
  </form>`;
  const footer = `<button class="btn btn-secondary" type="button" data-close-modal>Cancel</button><button class="btn btn-primary" type="submit" form="book-form">${isEditing ? 'Save Changes' : 'Add Book'}</button>`;
  modal.open(isEditing ? 'Edit Book' : 'Add Book', body, footer);
  document.querySelector('[data-close-modal]').addEventListener('click', () => modal.close());
  document.getElementById('book-form').addEventListener('submit', event => {
    event.preventDefault();
    const bookData = {
      title: document.getElementById('book-title').value.trim(),
      author: document.getElementById('book-author').value.trim(),
      category: document.getElementById('book-category').value,
      isbn: document.getElementById('book-isbn').value.trim(),
      shelf: document.getElementById('book-shelf').value.trim(),
      totalCopies: Number(document.getElementById('book-copies').value)
    };
    if (!Number.isInteger(bookData.totalCopies) || bookData.totalCopies < 1) {
      toast.show('Total copies must be a positive whole number.', 'error');
      return;
    }
    void runMutation(
      () => isEditing ? libraryApi.updateBook(book.id, bookData) : libraryApi.addBook(bookData),
      isEditing ? 'Book updated.' : 'Book added.'
    );
  });
}

function openMemberModal(member = null) {
  const body = `<form id="member-form" class="form-grid">
    ${formField('Full name', 'member-name', 'text', member?.name || '', true, 'maxlength="120"')}
    ${formField('Email', 'member-email', 'email', member?.email || '', true, 'maxlength="254"')}
    ${formField('Phone', 'member-phone', 'tel', member?.phone || '', false, 'maxlength="40"')}
    ${formField('Department', 'member-department', 'text', member?.department || '', false, 'maxlength="120"')}
    ${formField('Address', 'member-address', 'text', member?.address || '', false, 'maxlength="300"')}
    <div class="form-group"><label class="form-label" for="member-type">Membership type</label><select class="form-select" id="member-type"><option value="student">Student</option><option value="faculty">Faculty</option><option value="staff">Staff</option></select></div>
    ${member ? `<div class="form-group"><label class="form-label" for="member-status">Status</label><select class="form-select" id="member-status"><option value="Active" ${member.status === 'Active' ? 'selected' : ''}>Active</option><option value="Suspended" ${member.status === 'Suspended' ? 'selected' : ''}>Suspended</option><option value="Inactive" ${member.status === 'Inactive' ? 'selected' : ''}>Inactive</option></select></div>` : ''}
  </form>`;
  const footer = `<button class="btn btn-secondary" type="button" data-close-modal>Cancel</button><button class="btn btn-primary" type="submit" form="member-form">${member ? 'Save Changes' : 'Add Member'}</button>`;
  modal.open(member ? 'Edit Member' : 'Add Member', body, footer);
  document.getElementById('member-type').value = member?.role || 'student';
  document.querySelector('[data-close-modal]').addEventListener('click', () => modal.close());
  document.getElementById('member-form').addEventListener('submit', event => {
    event.preventDefault();
    const changes = {
      name: document.getElementById('member-name').value.trim(),
      email: document.getElementById('member-email').value.trim(),
      phone: document.getElementById('member-phone').value.trim(),
      department: document.getElementById('member-department').value.trim(),
      address: document.getElementById('member-address').value.trim(),
      role: document.getElementById('member-type').value,
      status: document.getElementById('member-status')?.value || 'Active'
    };
    void runMutation(
      () => member ? libraryApi.updateMember(member.id, changes) : libraryApi.addMember(changes),
      member ? 'Member updated.' : 'Member added.'
    );
  });
}

function openIssueModal() {
  const activeMembers = appState.state.members.filter(member => member.status === 'Active');
  const availableBooks = appState.state.books.filter(book => book.availableCopies > 0);
  const body = `<form id="issue-form" class="form-grid">
    <div class="form-group full-width"><label class="form-label" for="issue-member">Member</label><select class="form-select" id="issue-member" required>${activeMembers.map(member => `<option value="${utils.sanitize(member.id)}">${utils.sanitize(member.name)}</option>`).join('')}</select></div>
    <div class="form-group full-width"><label class="form-label" for="issue-book">Book</label><select class="form-select" id="issue-book" required>${availableBooks.map(book => `<option value="${utils.sanitize(book.id)}">${utils.sanitize(book.title)} (${book.availableCopies} available)</option>`).join('')}</select></div>
    <div class="form-group full-width"><label class="form-label" for="issue-due">Due date</label><input class="form-input" id="issue-due" type="date" min="${new Date().toISOString().slice(0, 10)}" value="${new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)}" required></div>
    ${!activeMembers.length || !availableBooks.length ? '<p class="text-muted">An active member and an available book are required.</p>' : ''}
  </form>`;
  const footer = `<button class="btn btn-secondary" type="button" data-close-modal>Cancel</button><button class="btn btn-primary" type="submit" form="issue-form" ${!activeMembers.length || !availableBooks.length ? 'disabled' : ''}>Issue Book</button>`;
  modal.open('Issue Book to Member', body, footer);
  document.querySelector('[data-close-modal]').addEventListener('click', () => modal.close());
  document.getElementById('issue-form').addEventListener('submit', event => {
    event.preventDefault();
    void runMutation(
      () => libraryApi.issueBook(
        document.getElementById('issue-member').value,
        document.getElementById('issue-book').value,
        document.getElementById('issue-due').value
      ),
      'Book issued.'
    );
  });
}

function openPaymentModal(fineId, balance) {
  const body = `<form id="payment-form" class="form-grid">
    <p>Outstanding balance: <strong>${utils.formatCurrency(balance)}</strong></p>
    <div class="form-group full-width"><label class="form-label" for="payment-amount">Payment amount</label><input class="form-input" id="payment-amount" type="number" min="0.01" max="${balance}" step="0.01" value="${balance}" required></div>
    <div class="form-group full-width"><label class="form-label" for="payment-method">Method</label><select class="form-select" id="payment-method"><option value="cash">Cash</option><option value="upi">UPI (recorded manually)</option><option value="other">Other</option></select></div>
  </form>`;
  const footer = '<button class="btn btn-secondary" type="button" data-close-modal>Cancel</button><button class="btn btn-primary" type="submit" form="payment-form">Record Payment</button>';
  modal.open('Record Fine Payment', body, footer);
  document.querySelector('[data-close-modal]').addEventListener('click', () => modal.close());
  document.getElementById('payment-form').addEventListener('submit', event => {
    event.preventDefault();
    void runMutation(
      () => libraryApi.recordFinePayment(
        fineId,
        Number(document.getElementById('payment-amount').value),
        document.getElementById('payment-method').value
      ),
      'Payment recorded.'
    );
  });
}

function bindSectionEvents(section) {
  if (section === 'dashboard') {
    document.getElementById('btn-quick-issue')?.addEventListener('click', openIssueModal);
    document.getElementById('btn-dashboard-books')?.addEventListener('click', () => navigateTo('books'));
  } else if (section === 'books') {
    document.getElementById('btn-add-book')?.addEventListener('click', () => openBookModal());
    const search = document.getElementById('book-search-input');
    const category = document.getElementById('book-filter-category');
    const sort = document.getElementById('book-sort-by');
    const applyFilters = () => {
      const query = search.value.trim().toLowerCase();
      const categoryValue = category.value;
      const books = appState.state.books.filter(book =>
        (!categoryValue || book.category === categoryValue)
        && (!query || [book.title, book.author, book.isbn, book.id].some(value => value.toLowerCase().includes(query)))
      ).sort((a, b) => sort.value === 'author'
        ? a.author.localeCompare(b.author)
        : sort.value === 'available' ? b.availableCopies - a.availableCopies : a.title.localeCompare(b.title));
      document.querySelector('.data-table tbody').innerHTML = bookRows(books);
      bindBookActions();
    };
    search.addEventListener('input', applyFilters);
    category.addEventListener('change', applyFilters);
    sort.addEventListener('change', applyFilters);
    bindBookActions();
  } else if (section === 'members') {
    document.getElementById('btn-add-member')?.addEventListener('click', () => openMemberModal());
    document.querySelectorAll('.btn-edit-member').forEach(button => {
      button.addEventListener('click', () => {
        const member = appState.state.members.find(item => item.id === button.dataset.id);
        if (member) openMemberModal(member);
      });
    });
  } else if (section === 'circulation') {
    document.getElementById('btn-issue-book-action')?.addEventListener('click', openIssueModal);
    document.querySelectorAll('.btn-return-action').forEach(button => {
      button.addEventListener('click', () => void runMutation(
        () => libraryApi.returnBook(button.dataset.id),
        'Book returned.'
      ));
    });
  } else if (section === 'reservations') {
    document.querySelectorAll('.btn-cancel-reservation').forEach(button => {
      button.addEventListener('click', () => void runMutation(
        () => libraryApi.cancelReservation(button.dataset.id),
        'Reservation cancelled.'
      ));
    });
  } else if (section === 'fines') {
    document.querySelectorAll('.btn-pay-fine').forEach(button => {
      button.addEventListener('click', () => openPaymentModal(button.dataset.id, Number(button.dataset.balance)));
    });
  } else if (section === 'settings') {
    document.getElementById('btn-export-json')?.addEventListener('click', exportData);
  }
}

function bindBookActions() {
  document.querySelectorAll('.btn-edit-book').forEach(button => {
    button.addEventListener('click', () => {
      const book = appState.state.books.find(item => item.id === button.dataset.id);
      if (book) openBookModal(book);
    });
  });
  document.querySelectorAll('.btn-delete-book').forEach(button => {
    button.addEventListener('click', () => {
      const book = appState.state.books.find(item => item.id === button.dataset.id);
      if (book && window.confirm(`Archive "${book.title}" from the catalog?`)) {
        void runMutation(() => libraryApi.archiveBook(book.id), 'Book archived.');
      }
    });
  });
  document.querySelectorAll('.btn-reserve-book').forEach(button => {
    button.addEventListener('click', () => void runMutation(
      () => libraryApi.reserveBook(button.dataset.id),
      'Reservation created.'
    ));
  });
}

function navigateTo(section) {
  const memberSections = ['dashboard', 'books', 'circulation', 'reservations', 'fines'];
  if ((!isAdmin() && section === 'settings') || (!isStaff() && !memberSections.includes(section))) {
    toast.show('Your account does not have access to that page.', 'error', 'Access denied');
    return;
  }
  appState.setState('currentSection', section);
  renderCurrentSection();
  document.getElementById('app-sidebar').classList.remove('mobile-open');
}

function exportData() {
  const blob = new Blob([JSON.stringify({
    exportedAt: new Date().toISOString(),
    ...appState.state
  }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'libracore-library-data.json';
  anchor.click();
  URL.revokeObjectURL(url);
  toast.show('Your accessible data was exported.', 'success');
}

function openNotifications() {
  const overdue = appState.state.issues.filter(issue => issue.status === 'Overdue').length;
  const reservations = appState.state.reservations.filter(item => item.status === 'Pending').length;
  const fines = appState.state.fines.filter(fine => fine.status !== 'Paid').length;
  modal.open('Library Notifications', `
    <ul class="notification-list">
      <li>${overdue} overdue loans</li>
      <li>${reservations} pending reservations</li>
      <li>${fines} unpaid or partial fines</li>
    </ul>
  `);
}

function openSearch() {
  document.getElementById('search-modal-backdrop').classList.add('show');
  const input = document.getElementById('global-search-input');
  input.value = '';
  document.getElementById('global-search-results').innerHTML = '';
  input.focus();
}

function renderSearchResults(query) {
  const results = document.getElementById('global-search-results');
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    results.innerHTML = '';
    return;
  }
  const books = appState.state.books.filter(book =>
    [book.title, book.author, book.isbn].some(value => value.toLowerCase().includes(normalized))
  ).slice(0, 8);
  const members = isStaff() ? appState.state.members.filter(member =>
    [member.name, member.email].some(value => value.toLowerCase().includes(normalized))
  ).slice(0, 8) : [];
  results.innerHTML = [
    ...books.map(book => `<button class="search-result-item" data-search-section="books"><strong>${utils.sanitize(book.title)}</strong><span>${utils.sanitize(book.author)} · ${book.availableCopies} available</span></button>`),
    ...members.map(member => `<button class="search-result-item" data-search-section="members"><strong>${utils.sanitize(member.name)}</strong><span>${utils.sanitize(member.email)}</span></button>`)
  ].join('') || '<p class="text-muted">No results found.</p>';
  results.querySelectorAll('[data-search-section]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('search-modal-backdrop').classList.remove('show');
      navigateTo(button.dataset.searchSection);
    });
  });
}

async function bootApp() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session) {
    window.location.replace('login.html');
    return;
  }

  const profile = await libraryApi.getProfile(data.session.user.id);
  if (profile.status !== 'active') {
    await supabase.auth.signOut();
    window.location.replace('login.html');
    return;
  }

  appState.state.currentUser = {
    id: profile.id,
    memberId: null,
    name: profile.full_name,
    email: data.session.user.email || '',
    role: profile.role,
    status: profile.status
  };
  const libraryData = await libraryApi.loadLibraryData();
  const currentMember = libraryData.members.find(member =>
    member.authUserId === appState.state.currentUser.id && member.status === 'Active'
  );
  appState.state.currentUser.memberId = currentMember?.id || null;
  Object.assign(appState.state, libraryData);

  updateUserDisplay();
  renderCurrentSection();
  document.getElementById('app-sidebar').classList.remove('mobile-open');
}

document.getElementById('sidebar-nav').addEventListener('click', event => {
  const button = event.target.closest('.nav-item[data-section]');
  if (button && !button.hidden) navigateTo(button.dataset.section);
});
document.getElementById('mobile-toggle').addEventListener('click', () => {
  document.getElementById('app-sidebar').classList.toggle('mobile-open');
});
document.getElementById('btn-theme-toggle').addEventListener('click', () => {
  const nextTheme = appState.state.theme === 'dark' ? 'light' : 'dark';
  appState.state.theme = nextTheme;
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('libracore_theme', nextTheme);
});
document.getElementById('btn-global-search').addEventListener('click', openSearch);
document.getElementById('global-search-input').addEventListener('input', event => renderSearchResults(event.target.value));
document.getElementById('search-modal-backdrop').addEventListener('click', event => {
  if (event.target === event.currentTarget) event.currentTarget.classList.remove('show');
});
document.getElementById('btn-modal-close').addEventListener('click', () => modal.close());
document.getElementById('modal-backdrop').addEventListener('click', event => {
  if (event.target === event.currentTarget) modal.close();
});
document.getElementById('user-menu-btn').addEventListener('click', () => {
  const dropdown = document.getElementById('user-dropdown');
  const isOpen = dropdown.classList.toggle('show');
  document.getElementById('user-menu-btn').setAttribute('aria-expanded', String(isOpen));
});
document.getElementById('user-dropdown').addEventListener('click', async event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  event.preventDefault();
  document.getElementById('user-dropdown').classList.remove('show');
  if (action === 'profile') openProfile();
  if (action === 'settings') navigateTo('settings');
  if (action === 'logout') {
    const { error } = await supabase.auth.signOut();
    if (error) toast.show(error.message, 'error');
    else window.location.replace('login.html');
  }
});
document.getElementById('btn-notifications').addEventListener('click', openNotifications);
document.getElementById('btn-shortcuts-help').addEventListener('click', () => {
  modal.open('Shortcuts & Help', '<p>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search the catalog. Press <kbd>Escape</kbd> to close dialogs.</p>');
});
window.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch();
  } else if (event.key === 'Escape') {
    modal.close();
    document.getElementById('search-modal-backdrop').classList.remove('show');
  }
});
supabase.auth.onAuthStateChange(event => {
  if (event === 'SIGNED_OUT') window.location.replace('login.html');
});
document.documentElement.setAttribute('data-theme', appState.state.theme);
document.getElementById('main-content').innerHTML = '<div class="card" role="status">Loading library data…</div>';
bootApp().catch(error => {
  console.error('Library initialization failed:', error);
  const main = document.getElementById('main-content');
  main.innerHTML = `<div class="card" role="alert"><h1 class="page-title">Unable to load the library</h1><p>${utils.sanitize(error.message)}</p><button class="btn btn-secondary" id="btn-retry">Try Again</button></div>`;
  document.getElementById('btn-retry').addEventListener('click', () => window.location.reload());
});
