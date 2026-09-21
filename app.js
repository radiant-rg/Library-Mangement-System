/*
==========================================================================
1. INITIAL SAMPLE SEED DATA & MODEL CONTRACTS
==========================================================================
*/
const INITIAL_BOOKS = [
{ id: "BK-1001", title: "Clean Code", author: "Robert C. Martin", category: "Computer Science", isbn: "978-0132350884", publisher: "Prentice Hall", year: 2008, shelf: "CS-01",
totalCopies: 8, availableCopies: 5, rating: 4.8, issueCount: 42, coverBg: "#1e293b" },
{ id: "BK-1002", title: "The Pragmatic Programmer", author: "Andrew Hunt, David Thomas",
category: "Computer Science", isbn: "978-0201616224", publisher: "Addison-Wesley", year: 1999,
shelf: "CS-01", totalCopies: 6, availableCopies: 2, rating: 4.9, issueCount: 38, coverBg: "#0f172a"
},
{ id: "BK-1003", title: "Database System Concepts", author: "Abraham Silberschatz",
category: "Information Technology", isbn: "978-0078022159", publisher: "McGraw-Hill", year:
2019, shelf: "IT-03", totalCopies: 12, availableCopies: 7, rating: 4.6, issueCount: 55, coverBg:
"#1e3a8a" },
{ id: "BK-1004", title: "Operating System Concepts", author: "Abraham Silberschatz, Peter B. Galvin", category: "Computer Science", isbn: "978-1118063330", publisher: "Wiley", year: 2018,
shelf: "CS-02", totalCopies: 10, availableCopies: 4, rating: 4.5, issueCount: 49, coverBg:
"#0369a1" },
{ id: "BK-1005", title: "Computer Networks", author: "Andrew S. Tanenbaum", category:
"Electronics & Communication", isbn: "978-0132126953", publisher: "Pearson", year: 2013, shelf:
"ECE-04", totalCopies: 9, availableCopies: 3, rating: 4.7, issueCount: 31, coverBg: "#047857" },
{ id: "BK-1006", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", category: "Artificial Intelligence", isbn: "978-0134610993", publisher: "Pearson",
year: 2020, shelf: "AI-01", totalCopies: 7, availableCopies: 1, rating: 4.9, issueCount: 64, coverBg:
"#6b21a8" },
{ id: "BK-1007", title: "Machine Learning", author: "Tom M. Mitchell", category: "Artificial Intelligence", isbn: "978-0070428072", publisher: "McGraw-Hill", year: 1997, shelf: "AI-02",
totalCopies: 5, availableCopies: 3, rating: 4.4, issueCount: 22, coverBg: "#581c87" },
{ id: "BK-1008", title: "Python Crash Course", author: "Eric Matthes", category: "Computer Science", isbn: "978-1593279288", publisher: "No Starch Press", year: 2019, shelf: "CS-04",
totalCopies: 15, availableCopies: 9, rating: 4.8, issueCount: 78, coverBg: "#15803d" },
{ id: "BK-1009", title: "JavaScript: The Definitive Guide", author: "David Flanagan", category:
"Computer Science", isbn: "978-1491952023", publisher: "O'Reilly", year: 2020, shelf: "CS-03",
totalCopies: 8, availableCopies: 4, rating: 4.6, issueCount: 29, coverBg: "#b45309" },
{ id: "BK-1010", title: "Introduction to Algorithms", author: "Thomas H. Cormen", category:

"Computer Science", isbn: "978-0262033848", publisher: "MIT Press", year: 2009, shelf: "CS-02",
totalCopies: 14, availableCopies: 6, rating: 4.9, issueCount: 88, coverBg: "#b91c1c" },
{ id: "BK-1011", title: "Computer Organization and Design", author: "David A. Patterson",
category: "Electronics & Computer Science", isbn: "978-0128122754", publisher: "Morgan Kaufmann", year: 2017, shelf: "ECS-01", totalCopies: 6, availableCopies: 3, rating: 4.5,
issueCount: 19, coverBg: "#334155" },
{ id: "BK-1012", title: "Software Engineering", author: "Ian Sommerville", category: "Computer Science", isbn: "978-0133943030", publisher: "Pearson", year: 2015, shelf: "CS-05", totalCopies:
8, availableCopies: 5, rating: 4.3, issueCount: 24, coverBg: "#1e293b" },
{ id: "BK-1013", title: "Data Structures and Algorithms in Java", author: "Robert Lafore",
category: "Computer Science", isbn: "978-0672324536", publisher: "Sams Publishing", year:
2002, shelf: "CS-02", totalCopies: 11, availableCopies: 7, rating: 4.7, issueCount: 45, coverBg:
"#0f172a" },
{ id: "BK-1014", title: "Deep Learning", author: "Ian Goodfellow, Yoshua Bengio", category:
"Artificial Intelligence", isbn: "978-0262035613", publisher: "MIT Press", year: 2016, shelf: "AI-01",
totalCopies: 4, availableCopies: 1, rating: 4.8, issueCount: 33, coverBg: "#4c1d95" },
{ id: "BK-1015", title: "Design Patterns: Elements of Reusable Object-Oriented Software",
author: "Erich Gamma, Richard Helm", category: "Computer Science", isbn: "978-0201633610",
publisher: "Addison-Wesley", year: 1994, shelf: "CS-01", totalCopies: 7, availableCopies: 4, rating:
4.9, issueCount: 51, coverBg: "#1e1b4b" },
{ id: "BK-1016", title: "Let Us C", author: "Yashavant Kanetkar", category: "Computer Science",
isbn: "978-9388511742", publisher: "BPB Publications", year: 2020, shelf: "CS-04", totalCopies: 20,
availableCopies: 12, rating: 4.5, issueCount: 110, coverBg: "#854d0e" },
{ id: "BK-1017", title: "Head First Java", author: "Kathy Sierra, Bert Bates", category:
"Computer Science", isbn: "978-0596009205", publisher: "O'Reilly", year: 2005, shelf: "CS-04",
totalCopies: 9, availableCopies: 5, rating: 4.6, issueCount: 40, coverBg: "#9a3412" },
{ id: "BK-1018", title: "Digital Logic and Computer Design", author: "M. Morris Mano",
category: "Electronics & Communication", isbn: "978-9332542525", publisher: "Pearson", year:
2016, shelf: "ECE-02", totalCopies: 10, availableCopies: 6, rating: 4.4, issueCount: 27, coverBg:
"#065f46" },
{ id: "BK-1019", title: "Web Technologies", author: "Uttam K. Roy", category: "Information Technology", isbn: "978-0198066224", publisher: "Oxford University Press", year: 2010, shelf:
"IT-01", totalCopies: 8, availableCopies: 4, rating: 4.2, issueCount: 18, coverBg: "#1e40af" },
{ id: "BK-1020", title: "Cloud Computing: Concepts, Technology & Architecture", author:
"Thomas Erl", category: "Information Technology", isbn: "978-0133387520", publisher: "Prentice Hall", year: 2013, shelf: "IT-02", totalCopies: 6, availableCopies: 3, rating: 4.5, issueCount: 25,
coverBg: "#0284c7" }
];
const INITIAL_MEMBERS = [
{ id: "TMSL-M-01", name: "Ranik Ghosh", email: "ranik.ghosh@technomain.ac.in",
department: "Computer Science", phone: "+91 98301 12345", role: "Admin", status: "Active",
joinedDate: "2022-08-15" },

{ id: "TMSL-M-02", name: "Ananya Das", email: "ananya.das@technomain.ac.in", department:
"Information Technology", phone: "+91 98302 23456", role: "Librarian", status: "Active",
joinedDate: "2023-01-10" },
{ id: "TMSL-M-03", name: "Sourav Roy", email: "sourav.roy@technomain.ac.in", department:
"Electronics & Communication", phone: "+91 98303 34567", role: "Student", status: "Active",
joinedDate: "2023-07-20" },
{ id: "TMSL-M-04", name: "Priya Sharma", email: "priya.sharma@technomain.ac.in",
department: "Computer Science", phone: "+91 98304 45678", role: "Student", status: "Active",
joinedDate: "2023-08-01" },
{ id: "TMSL-M-05", name: "Dr. Abhijit Mukherjee", email: "abhijit.m@technomain.ac.in",
department: "Electronics & Computer Science", phone: "+91 98305 56789", role: "Faculty",
status: "Active", joinedDate: "2020-03-12" },
{ id: "TMSL-M-06", name: "Sneha Chakraborty", email: "sneha.c@technomain.ac.in",
department: "Mechanical Engineering", phone: "+91 98306 67890", role: "Student", status:
"Active", joinedDate: "2024-01-15" },
{ id: "TMSL-M-07", name: "Rahul Banerjee", email: "rahul.b@technomain.ac.in", department:
"Civil Engineering", phone: "+91 98307 78901", role: "Student", status: "Active", joinedDate:
"2024-02-01" },
{ id: "TMSL-M-08", name: "Debolina Bose", email: "debolina.bose@technomain.ac.in",
department: "Computer Science", phone: "+91 98308 89012", role: "Student", status: "Active",
joinedDate: "2023-09-10" },
{ id: "TMSL-M-09", name: "Arpan Sen", email: "arpan.sen@technomain.ac.in", department:
"Information Technology", phone: "+91 98309 90123", role: "Student", status: "Suspended",
joinedDate: "2022-11-05" },
{ id: "TMSL-M-10", name: "Dr. Suman Dutta", email: "suman.dutta@technomain.ac.in",
department: "Computer Science", phone: "+91 98310 01234", role: "Faculty", status: "Active",
joinedDate: "2019-06-01" }
];
const INITIAL_ISSUES = [
{ id: "ISS-501", memberId: "TMSL-M-03", bookId: "BK-1001", issueDate: "2026-09-01",
dueDate: "2026-09-15", returnDate: null, status: "Overdue" },
{ id: "ISS-502", memberId: "TMSL-M-04", bookId: "BK-1006", issueDate: "2026-09-10",
dueDate: "2026-09-24", returnDate: null, status: "Issued" },
{ id: "ISS-503", memberId: "TMSL-M-06", bookId: "BK-1008", issueDate: "2026-09-05",
dueDate: "2026-09-19", returnDate: null, status: "Overdue" },
{ id: "ISS-504", memberId: "TMSL-M-07", bookId: "BK-1010", issueDate: "2026-09-12",
dueDate: "2026-09-26", returnDate: null, status: "Issued" },
{ id: "ISS-505", memberId: "TMSL-M-08", bookId: "BK-1014", issueDate: "2026-08-20",
dueDate: "2026-09-03", returnDate: "2026-09-08", status: "Returned" },
{ id: "ISS-506", memberId: "TMSL-M-05", bookId: "BK-1003", issueDate: "2026-09-14",
dueDate: "2026-09-28", returnDate: null, status: "Issued" }
];

const INITIAL_RESERVATIONS = [
{ id: "RES-201", memberId: "TMSL-M-04", bookId: "BK-1002", date: "2026-09-18", status:
"Pending" },
{ id: "RES-202", memberId: "TMSL-M-06", bookId: "BK-1006", date: "2026-09-19", status:
"Pending" },
{ id: "RES-203", memberId: "TMSL-M-08", bookId: "BK-1014", date: "2026-09-15", status:
"Approved" },
{ id: "RES-204", memberId: "TMSL-M-03", bookId: "BK-1010", date: "2026-09-10", status:
"Completed" },
{ id: "RES-205", memberId: "TMSL-M-07", bookId: "BK-1005", date: "2026-09-12", status:
"Cancelled" }
];
const INITIAL_FINES = [
{ id: "FN-801", memberId: "TMSL-M-03", bookId: "BK-1001", dueDate: "2026-09-15",
returnDate: null, daysOverdue: 6, amount: 30, status: "Unpaid" },
{ id: "FN-802", memberId: "TMSL-M-06", bookId: "BK-1008", dueDate: "2026-09-19",
returnDate: null, daysOverdue: 2, amount: 10, status: "Unpaid" },
{ id: "FN-803", memberId: "TMSL-M-08", bookId: "BK-1014", dueDate: "2026-09-03",
returnDate: "2026-09-08", daysOverdue: 5, amount: 25, status: "Paid" },
{ id: "FN-804", memberId: "TMSL-M-09", bookId: "BK-1004", dueDate: "2026-08-10",
returnDate: "2026-08-30", daysOverdue: 20, amount: 100, status: "Unpaid" },
{ id: "FN-805", memberId: "TMSL-M-07", bookId: "BK-1011", dueDate: "2026-07-15",
returnDate: "2026-07-25", daysOverdue: 10, amount: 50, status: "Paid" },
{ id: "FN-806", memberId: "TMSL-M-04", bookId: "BK-1002", dueDate: "2026-08-01",
returnDate: "2026-08-15", daysOverdue: 14, amount: 70, status: "Paid" }
];
const INITIAL_ACTIVITIES = [
{ id: "ACT-1", userName: "Ranik Ghosh", action: "Issued", bookTitle: "Clean Code", timestamp:
"Today, 10:42 AM", status: "success" },
{ id: "ACT-2", userName: "Ananya Das", action: "Returned", bookTitle: "Database System Concepts", timestamp: "Today, 09:30 AM", status: "info" },
{ id: "ACT-3", userName: "Sourav Roy", action: "Reserved", bookTitle: "Artificial Intelligence",
timestamp: "Yesterday, 04:15 PM", status: "warning" },
{ id: "ACT-4", userName: "Ranik Ghosh", action: "Added Book", bookTitle: "Cloud Computing",
timestamp: "Yesterday, 02:00 PM", status: "success" },
{ id: "ACT-5", userName: "Priya Sharma", action: "Paid Fine", bookTitle: "The Pragmatic Programmer", timestamp: "18 Sep 2026", status: "success" },
{ id: "ACT-6", userName: "Ananya Das", action: "Cancelled Reservation", bookTitle:
"Computer Networks", timestamp: "17 Sep 2026", status: "danger" }
];

/*
==========================================================================
2. CENTRAL STATE & CACHE ARCHITECTURE
==========================================================================
*/
const STORAGE_KEY = 'libracore_tmsl_state';
class AppState {
constructor() {
this.state = {
books: [],
members: [],
issues: [],
reservations: [],
fines: [],
activities: [],
currentUser: INITIAL_MEMBERS[0], // Default Admin Ranik Ghosh
currentSection: 'dashboard',
theme: localStorage.getItem('libracore_theme') || 'light',
rowsPerPage: 10,
notifications: [
{ id: 1, title: "2 Books Overdue", desc: "Clean Code & Python Crash Course are past due date.", unread: true },
{ id: 2, title: "New Reservation", desc: "Sourav Roy requested Computer Networks.",
unread: true }
]
};
this.cache = {
data: null,
timestamp: 0,
ttl: 300000 // 5 min TTL
};
this.listeners = [];
this.init();
}
init() {
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {

try {
const parsed = JSON.parse(saved);
this.state = { ...this.state, ...parsed };
} catch (e) {
console.error('Failed to parse stored state, re-seeding.', e);
this.seedDemoData();
}
} else {
this.seedDemoData();
}
}
seedDemoData() {
this.state.books = [...INITIAL_BOOKS];
this.state.members = [...INITIAL_MEMBERS];
this.state.issues = [...INITIAL_ISSUES];
this.state.reservations = [...INITIAL_RESERVATIONS];
this.state.fines = [...INITIAL_FINES];
this.state.activities = [...INITIAL_ACTIVITIES];
this.save();
}
save() {
localStorage.setItem(STORAGE_KEY, JSON.stringify({
books: this.state.books,
members: this.state.members,
issues: this.state.issues,
reservations: this.state.reservations,
fines: this.state.fines,
activities: this.state.activities
}));
this.invalidateCache();
this.notify();
}
invalidateCache() {
this.cache.timestamp = 0;
}
subscribe(listener) {
this.listeners.push(listener);
return () => {
this.listeners = this.listeners.filter(l => l !== listener);

};
}
notify() {
this.listeners.forEach(fn => fn(this.state));
}
setState(key, value) {
this.state[key] = value;
this.save();
}
}
const appState = new AppState();
/*
==========================================================================
3. SERVICE LAYER (PROMISE-BASED FOR FUTURE REST COMPATIBILITY)
==========================================================================
*/
// Note: Authentication must be implemented server-side with JWT in production.
const apiService = {
async getBooks() {
return new Promise(resolve => setTimeout(() => resolve([...appState.state.books]), 50));
},
async addBook(bookData) {
const newBook = {
...bookData,
id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
rating: 4.5,
issueCount: 0,
availableCopies: bookData.totalCopies,
coverBg: "#1e293b"
};
appState.state.books.unshift(newBook);
appState.state.activities.unshift({
id: `ACT-${Date.now()}`,
userName: appState.state.currentUser.name,
action: "Added Book",
bookTitle: newBook.title,
timestamp: "Just now",
status: "success"

});
appState.save();
return newBook;
},
async updateBook(id, update) {
const index = appState.state.books.findIndex(b => b.id === id);
if (index !== -1) {
appState.state.books[index] = { ...appState.state.books[index], ...update };
appState.save();
}
},
async deleteBook(id) {
appState.state.books = appState.state.books.filter(b => b.id !== id);
appState.save();
},
async issueBook(memberId, bookId, dueDate) {
const book = appState.state.books.find(b => b.id === bookId);
const member = appState.state.members.find(m => m.id === memberId);
if (!book || book.availableCopies <= 0) throw new Error("Book unavailable");
book.availableCopies--;
book.issueCount++;
const newIssue = {
id: `ISS-${Math.floor(500 + Math.random() * 500)}`,
memberId,
bookId,
issueDate: new Date().toISOString().split('T')[0],
dueDate,
returnDate: null,
status: "Issued"
};
appState.state.issues.unshift(newIssue);
appState.state.activities.unshift({
id: `ACT-${Date.now()}`,
userName: member.name,
action: "Issued",
bookTitle: book.title,
timestamp: "Just now",
status: "success"
});
appState.save();

return newIssue;
},
async returnBook(issueId) {
const issue = appState.state.issues.find(i => i.id === issueId);
if (!issue) return;
const book = appState.state.books.find(b => b.id === issue.bookId);
const member = appState.state.members.find(m => m.id === issue.memberId);
const today = new Date().toISOString().split('T')[0];
issue.returnDate = today;
issue.status = "Returned";
if (book) book.availableCopies++;
// Calculate fine if overdue (₹5 per day)
const due = new Date(issue.dueDate);
const ret = new Date(today);
const diffDays = Math.ceil((ret - due) / (1000 * 60 * 60 * 24));
if (diffDays > 0) {
const fineAmount = diffDays * 5;
appState.state.fines.unshift({
id: `FN-${Math.floor(800 + Math.random() * 200)}`,
memberId: issue.memberId,
bookId: issue.bookId,
dueDate: issue.dueDate,
returnDate: today,
daysOverdue: diffDays,
amount: fineAmount,
status: "Unpaid"
});
}
appState.state.activities.unshift({
id: `ACT-${Date.now()}`,
userName: member ? member.name : "Member",
action: "Returned",
bookTitle: book ? book.title : "Book",
timestamp: "Just now",
status: "info"
});
appState.save();
},

async payFine(fineId) {
const fine = appState.state.fines.find(f => f.id === fineId);
if (fine) {
fine.status = "Paid";
appState.save();
}
}
};
/*
==========================================================================
4. UI HELPERS, FORMATTERS & UTILS
==========================================================================
*/
const utils = {
formatCurrency(val) {
return `₹${val ?? 0}`;
},
formatDate(dateStr) {
if (!dateStr) return '-';
const d = new Date(dateStr);
return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
},
sanitize(str) {
const temp = document.createElement('div');
temp.textContent = str;
return temp.innerHTML;
}
};
/*
==========================================================================
5. TOAST & MODAL SYSTEM
==========================================================================
*/
const toast = {
show(msg, type = 'info', title = 'Notification') {
const container = document.getElementById('toast-container');
const element = document.createElement('div');
element.className = `toast ${type}`;
element.innerHTML = `

<div class="toast-content">
<div class="toast-title">${utils.sanitize(title)}</div>
<div class="toast-msg">${utils.sanitize(msg)}</div>
</div>
`;
container.appendChild(element);
setTimeout(() => {
element.style.opacity = '0';
setTimeout(() => element.remove(), 300);
}, 4000);
}
};
const modal = {
open(title, bodyHtml, footerHtml) {
document.getElementById('modal-title').textContent = title;
document.getElementById('modal-body').innerHTML = bodyHtml;
document.getElementById('modal-footer').innerHTML = footerHtml || '';
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
document.getElementById('btn-modal-close').addEventListener('click', () => modal.close());
document.getElementById('modal-backdrop').addEventListener('click', (e) => {
if (e.target === document.getElementById('modal-backdrop')) modal.close();
});
/*
==========================================================================
6. VIEW RENDERERS (COMPONENTS)
==========================================================================
*/
const renderers = {

// DASHBOARD VIEW
dashboard() {
const { books, members, issues, reservations, fines, activities, currentUser } =
appState.state;
const totalBooks = books.length;
const availableBooks = books.reduce((sum, b) => sum + (b.availableCopies ?? 0), 0);
const issuedCount = issues.filter(i => i.status === 'Issued' || i.status === 'Overdue').length;
const overdueCount = issues.filter(i => i.status === 'Overdue').length;
const activeReservations = reservations.filter(r => r.status === 'Pending').length;
return `
<div class="page-header">
<div>
<h1 class="page-title">Good day, ${utils.sanitize(currentUser.name)} 👋</h1>
<p class="page-subtitle">Here's what's happening at Techno Main Salt Lake Central
Library today.</p>
</div>
<button class="btn btn-primary" id="btn-quick-issue">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Issue Book
</button>
</div>
<!-- STATS GRID -->
<div class="stats-grid">
<div class="stat-card">
<div class="stat-header">
<div class="stat-label">Total Titles</div>
<div class="stat-icon">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path
d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
</div>
</div>
<div class="stat-value">${totalBooks}</div>
<div class="stat-footer">
<span class="stat-trend up">↑ 8.2%</span> vs last semester
</div>
</div>
<div class="stat-card">
<div class="stat-header">

<div class="stat-label">Available Copies</div>
<div class="stat-icon success">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
</div>
</div>
<div class="stat-value">${availableBooks}</div>
<div class="stat-footer">
In stock & ready for issue
</div>
</div>
<div class="stat-card">
<div class="stat-header">
<div class="stat-label">Active Borrowings</div>
<div class="stat-icon">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/></svg>
</div>
</div>
<div class="stat-value">${issuedCount}</div>
<div class="stat-footer">
Currently with students/faculty
</div>
</div>
<div class="stat-card">
<div class="stat-header">
<div class="stat-label">Total Members</div>
<div class="stat-icon">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
</div>
</div>
<div class="stat-value">${members.length}</div>
<div class="stat-footer">
Registered TMSL users
</div>
</div>

<div class="stat-card">
<div class="stat-header">
<div class="stat-label">Overdue Books</div>
<div class="stat-icon danger">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
</div>
</div>
<div class="stat-value">${overdueCount}</div>
<div class="stat-footer">
Requires immediate return
</div>
</div>
<div class="stat-card">
<div class="stat-header">
<div class="stat-label">Pending Reservations</div>
<div class="stat-icon warning">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
</div>
</div>
<div class="stat-value">${activeReservations}</div>
<div class="stat-footer">
Awaiting approval
</div>
</div>
</div>
<!-- DASHBOARD SPLIT GRID -->
<div class="dashboard-grid">
<!-- POPULAR BOOKS -->
<div class="card">
<div class="card-header">
<h3 class="card-title">Popular Books in Demand</h3>
<button class="btn btn-sm btn-secondary"
onclick="appState.setState('currentSection','books')">View All</button>
</div>
<div class="books-grid">
${books.slice(0, 4).map(book => `
<div class="book-card">

<div class="book-cover" style="background:${book.coverBg || '#1e293b'}">
<div class="book-cover-title">${utils.sanitize(book.title)}</div>
</div>
<div class="book-card-body">
<div class="book-title"
title="${utils.sanitize(book.title)}">${utils.sanitize(book.title)}</div>
<div class="book-author">${utils.sanitize(book.author)}</div>
<div class="book-meta">
<span class="badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}">
${book.availableCopies > 0 ? `${book.availableCopies} available` : 'Out of stock'}
</span>
<span>★ ${book.rating}</span>
</div>
</div>
</div>
`).join('')}
</div>
</div>
<!-- RECENT ACTIVITY TIMELINE -->
<div class="card">
<div class="card-header">
<h3 class="card-title">Recent Activity</h3>
</div>
<div class="activity-list">
${activities.slice(0, 5).map(act => `
<div class="activity-item">
<div class="activity-avatar">${act.userName.charAt(0)}</div>
<div class="activity-details">
<div><strong>${utils.sanitize(act.userName)}</strong>
${act.action.toLowerCase()} <em>"${utils.sanitize(act.bookTitle)}"</em></div>
<div class="activity-time">${act.timestamp}</div>
</div>
</div>
`).join('')}
</div>
</div>
</div>
`;
},

// BOOK CATALOG VIEW
books() {
const { books } = appState.state;
return `
<div class="page-header">
<div>
<h1 class="page-title">Book Catalog</h1>
<p class="page-subtitle">Manage catalog, view availability, and update shelf
locations.</p>
</div>
<button class="btn btn-primary" id="btn-add-book">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19"
y2="12"/></svg> Add New Book
</button>
</div>
<div class="card">
<div class="toolbar">
<div class="search-box">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
<input type="text" id="book-search-input" placeholder="Search by title, author, or ISBN...">
</div>
<div class="filter-group">
<select class="form-select" id="book-filter-category">
<option value="">All Categories</option>
<option value="Computer Science">Computer Science</option>
<option value="Information Technology">Information Technology</option>
<option value="Artificial Intelligence">Artificial Intelligence</option>
<option value="Electronics & Communication">Electronics &
Communication</option>
</select>
<select class="form-select" id="book-sort-by">
<option value="title">Sort by Title</option>
<option value="author">Sort by Author</option>
<option value="available">Sort by Availability</option>
</select>
</div>
</div>
<div class="table-responsive">

<table class="data-table">
<thead>
<tr>
<th>Book ID</th>
<th>Title & Author</th>
<th>Category</th>
<th>ISBN</th>
<th>Shelf</th>
<th>Copies (Avail/Total)</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
${books.map(b => `
<tr>
<td><code>${b.id}</code></td>
<td>
<div style="font-weight:600">${utils.sanitize(b.title)}</div>
<div
style="font-size:0.78rem;color:var(--text-muted)">${utils.sanitize(b.author)}</div>
</td>
<td>${utils.sanitize(b.category)}</td>
<td><small>${b.isbn}</small></td>
<td>${b.shelf}</td>
<td><strong>${b.availableCopies}</strong> /${b.totalCopies}</td>
<td>
<span class="badge ${b.availableCopies > 0 ? 'badge-success' : 'badge-danger'}">
${b.availableCopies > 0 ? 'Available' : 'Out of Stock'}
</span>
</td>
<td>
<button class="btn btn-sm btn-secondary btn-edit-book"
data-id="${b.id}">Edit</button>
<button class="btn btn-sm btn-danger btn-delete-book"
data-id="${b.id}">Delete</button>
</td>
</tr>
`).join('')}
</tbody>
</table>
</div>

</div>
`;
},
// MEMBERS VIEW
members() {
const { members } = appState.state;
return `
<div class="page-header">
<div>
<h1 class="page-title">Library Members</h1>
<p class="page-subtitle">Directory of students, faculty, and administrative
staff.</p>
</div>
<button class="btn btn-primary" id="btn-add-member">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7"
r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> Add
Member
</button>
</div>
<div class="card">
<div class="table-responsive">
<table class="data-table">
<thead>
<tr>
<th>Member ID</th>
<th>Name</th>
<th>Department</th>
<th>Role</th>
<th>Phone</th>
<th>Status</th>
<th>Joined</th>
</tr>
</thead>
<tbody>
${members.map(m => `
<tr>
<td><code>${m.id}</code></td>
<td>
<div style="font-weight:600">${utils.sanitize(m.name)}</div>
<div

style="font-size:0.78rem;color:var(--text-muted)">${utils.sanitize(m.email)}</div>
</td>
<td>${utils.sanitize(m.department)}</td>
<td><span class="badge badge-primary">${m.role}</span></td>
<td>${m.phone}</td>
<td>
<span class="badge ${m.status === 'Active' ? 'badge-success' : 'badge-danger'}">${m.status}</span>
</td>
<td>${utils.formatDate(m.joinedDate)}</td>
</tr>
`).join('')}
</tbody>
</table>
</div>
</div>
`;
},
// CIRCULATION VIEW
circulation() {
const { issues, books, members } = appState.state;
return `
<div class="page-header">
<div>
<h1 class="page-title">Circulation Management</h1>
<p class="page-subtitle">Process book issues, returns, and track active
borrowings.</p>
</div>
<div style="display:flex;gap:0.75rem;">
<button class="btn btn-primary" id="btn-issue-book-action">Issue Book</button>
</div>
</div>
<div class="card">
<div class="card-header">
<h3 class="card-title">Active & Recent Circulation Records</h3>
</div>
<div class="table-responsive">
<table class="data-table">
<thead>
<tr>
<th>Issue ID</th>

<th>Member</th>
<th>Book Title</th>
<th>Issue Date</th>
<th>Due Date</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>
<tbody>
${issues.map(iss => {
const book = books.find(b => b.id === iss.bookId);
const member = members.find(m => m.id === iss.memberId);
return `
<tr>
<td><code>${iss.id}</code></td>
<td>${member ? utils.sanitize(member.name) : iss.memberId}</td>
<td>${book ? utils.sanitize(book.title) : iss.bookId}</td>
<td>${utils.formatDate(iss.issueDate)}</td>
<td>${utils.formatDate(iss.dueDate)}</td>
<td>
<span class="badge ${iss.status === 'Returned' ? 'badge-secondary' : iss.status === 'Overdue' ? 'badge-danger' : 'badge-primary'}">
${iss.status}
</span>
</td>
<td>
${iss.status !== 'Returned' ? `
<button class="btn btn-sm btn-secondary btn-return-action"
data-id="${iss.id}">Return Book</button>
` : '<small class="text-muted">Completed</small>'}
</td>
</tr>
`;
}).join('')}
</tbody>
</table>
</div>
</div>
`;
},
// FINES VIEW
fines() {

const { fines, members, books } = appState.state;
return `
<div class="page-header">
<div>
<h1 class="page-title">Fines Management</h1>
<p class="page-subtitle">Track overdue penalties, collect payments, and view
receipts.</p>
</div>
</div>
<div class="card">
<div class="table-responsive">
<table class="data-table">
<thead>
<tr>
<th>Fine ID</th>
<th>Member</th>
<th>Book</th>
<th>Days Overdue</th>
<th>Amount</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>
<tbody>
${fines.map(f => {
const member = members.find(m => m.id === f.memberId);
const book = books.find(b => b.id === f.bookId);
return `
<tr>
<td><code>${f.id}</code></td>
<td>${member ? utils.sanitize(member.name) : f.memberId}</td>
<td>${book ? utils.sanitize(book.title) : f.bookId}</td>
<td>${f.daysOverdue} days</td>
<td><strong>${utils.formatCurrency(f.amount)}</strong></td>
<td>
<span class="badge ${f.status === 'Paid' ? 'badge-success' : 'badge-danger'}">${f.status}</span>
</td>
<td>
${f.status === 'Unpaid' ? `
<button class="btn btn-sm btn-primary btn-pay-fine"
data-id="${f.id}">Mark Paid</button>

` : '<span style="color:var(--success)">✓ Paid</span>'}
</td>
</tr>
`;
}).join('')}
</tbody>
</table>
</div>
</div>
`;
},
// RESERVATIONS VIEW
reservations() {
const { reservations, members, books } = appState.state;
return `
<div class="page-header">
<div>
<h1 class="page-title">Book Reservations</h1>
<p class="page-subtitle">Manage user reservation requests for unavailable
titles.</p>
</div>
</div>
<div class="card">
<div class="table-responsive">
<table class="data-table">
<thead>
<tr>
<th>Res ID</th>
<th>Member</th>
<th>Book Title</th>
<th>Request Date</th>
<th>Status</th>
</tr>
</thead>
<tbody>
${reservations.map(r => {
const member = members.find(m => m.id === r.memberId);
const book = books.find(b => b.id === r.bookId);
return `
<tr>
<td><code>${r.id}</code></td>

<td>${member ? utils.sanitize(member.name) : r.memberId}</td>
<td>${book ? utils.sanitize(book.title) : r.bookId}</td>
<td>${utils.formatDate(r.date)}</td>
<td><span class="badge badge-warning">${r.status}</span></td>
</tr>
`;
}).join('')}
</tbody>
</table>
</div>
</div>
`;
},
// REPORTS VIEW WITH CUSTOM SVG CHARTS
reports() {
return `
<div class="page-header">
<div>
<h1 class="page-title">Reports & Analytics</h1>
<p class="page-subtitle">Visual analytics on library utilization, departmental trends,
and fine metrics.</p>
</div>
</div>
<div class="dashboard-grid">
<div class="card">
<h3 class="card-title" style="margin-bottom:1rem">Monthly Circulation
Trends</h3>
<div class="chart-container">
<svg width="100%" height="100%" viewBox="0 0 500 200"
style="overflow:visible">
<line x1="40" y1="160" x2="480" y2="160" stroke="var(--border)"
stroke-width="1"/>
<line x1="40" y1="110" x2="480" y2="110" stroke="var(--border)"
stroke-dasharray="4" stroke-width="1"/>
<line x1="40" y1="60" x2="480" y2="60" stroke="var(--border)"
stroke-dasharray="4" stroke-width="1"/>
<path d="M40,140 Q120,40 200,90 T360,30 T480,70" fill="none"
stroke="var(--primary)" stroke-width="3"/>
<circle cx="40" cy="140" r="4" fill="var(--primary)"/>
<circle cx="200" cy="90" r="4" fill="var(--primary)"/>
<circle cx="360" cy="30" r="4" fill="var(--primary)"/>

<circle cx="480" cy="70" r="4" fill="var(--primary)"/>
<text x="40" y="180" font-size="12" fill="var(--text-muted)">May</text>
<text x="180" y="180" font-size="12" fill="var(--text-muted)">Jun</text>
<text x="340" y="180" font-size="12" fill="var(--text-muted)">Jul</text>
<text x="460" y="180" font-size="12" fill="var(--text-muted)">Aug</text>
</svg>
</div>
</div>
<div class="card">
<h3 class="card-title" style="margin-bottom:1rem">Department Borrowing
Share</h3>
<div class="chart-container"
style="display:flex;align-items:center;justify-content:center;">
<svg width="180" height="180" viewBox="0 0 36 36">
<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border)" stroke-width="3.8"/>
<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" stroke-dasharray="45, 100" stroke-width="3.8"/>
<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--success)" stroke-dasharray="30, 100" stroke-dashoffset="-45"
stroke-width="3.8"/>
</svg>
</div>
</div>
</div>
`;
},
// SETTINGS VIEW
settings() {
return `
<div class="page-header">
<div>
<h1 class="page-title">Settings & System Data</h1>
<p class="page-subtitle">System configuration, data export/import, and demo
reset options.</p>
</div>
</div>
<div class="card" style="max-width:650px;gap:1.25rem;">
<h3 class="card-title">Data Backup & Recovery</h3>
<p style="font-size:0.88rem;color:var(--text-muted)">Export full library database to

JSON or import existing backup.</p>
<div style="display:flex;gap:1rem;">
<button class="btn btn-primary" id="btn-export-json">Export Data
(JSON)</button>
<button class="btn btn-secondary" id="btn-reset-demo"
style="color:var(--danger)">Reset Demo Data</button>
</div>
</div>
`;
}
};
/*
==========================================================================
7. EVENT BINDINGS & CONTROLLER
==========================================================================
*/
function renderCurrentSection() {
const main = document.getElementById('main-content');
const section = appState.state.currentSection;
if (renderers[section]) {
main.innerHTML = renderers[section]();
bindSectionEvents(section);
}
// Update active nav button
document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
btn.classList.toggle('active', btn.dataset.section === section);
});
}
function bindSectionEvents(section) {
if (section === 'dashboard') {
document.getElementById('btn-quick-issue')?.addEventListener('click', openIssueModal);
} else if (section === 'books') {
document.getElementById('btn-add-book')?.addEventListener('click', openAddBookModal);

// Search, category filter and sorting
const searchInput = document.getElementById('book-search-input');
const categoryFilter = document.getElementById('book-filter-category');
const sortSelect = document.getElementById('book-sort-by');

const applyBookFilters = () => {
const query = (searchInput?.value || '').trim().toLowerCase();
const category = categoryFilter?.value || '';
const sortBy = sortSelect?.value || 'title';

let filteredBooks = [...appState.state.books].filter(book => {
const matchesSearch = !query ||
book.title.toLowerCase().includes(query) ||
book.author.toLowerCase().includes(query) ||
String(book.isbn).toLowerCase().includes(query) ||
book.id.toLowerCase().includes(query);
const matchesCategory = !category || book.category === category;
return matchesSearch && matchesCategory;
});

filteredBooks.sort((a, b) => {
if (sortBy === 'author') return a.author.localeCompare(b.author);
if (sortBy === 'available') return b.availableCopies - a.availableCopies;
return a.title.localeCompare(b.title);
});

const tbody = document.querySelector('.data-table tbody');
if (!tbody) return;

tbody.innerHTML = filteredBooks.length ? filteredBooks.map(b => `
<tr>
<td><code>${b.id}</code></td>
<td>
<div style="font-weight:600">${utils.sanitize(b.title)}</div>
<div style="font-size:0.78rem;color:var(--text-muted)">${utils.sanitize(b.author)}</div>
</td>
<td>${utils.sanitize(b.category)}</td>
<td><small>${utils.sanitize(b.isbn)}</small></td>
<td>${utils.sanitize(b.shelf)}</td>
<td><strong>${b.availableCopies}</strong> / ${b.totalCopies}</td>
<td>
<span class="badge ${b.availableCopies > 0 ? 'badge-success' : 'badge-danger'}">
${b.availableCopies > 0 ? 'Available' : 'Out of Stock'}
</span>
</td>
<td>
<button class="btn btn-sm btn-secondary btn-edit-book" data-id="${b.id}">Edit</button>
<button class="btn btn-sm btn-danger btn-delete-book" data-id="${b.id}">Delete</button>
</td>
</tr>
`).join('') : `
<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted)">No books found.</td></tr>`;

bindBookRowEvents();
};

searchInput?.addEventListener('input', applyBookFilters);
categoryFilter?.addEventListener('change', applyBookFilters);
sortSelect?.addEventListener('change', applyBookFilters);

function bindBookRowEvents() {
document.querySelectorAll('.btn-edit-book').forEach(btn => {
btn.addEventListener('click', () => openEditBookModal(btn.dataset.id));
});

document.querySelectorAll('.btn-delete-book').forEach(btn => {
btn.addEventListener('click', async () => {
const id = btn.dataset.id;
if (confirm(`Delete book ${id}?`)) {
await apiService.deleteBook(id);
toast.show('Book removed successfully', 'success');
renderCurrentSection();
}
});
});
}

bindBookRowEvents();
} else if (section === 'circulation') {
document.getElementById('btn-issue-book-action')?.addEventListener('click',
openIssueModal);
document.querySelectorAll('.btn-return-action').forEach(btn => {
btn.addEventListener('click', async (e) => {
await apiService.returnBook(e.target.dataset.id);
toast.show('Book returned successfully', 'success');
renderCurrentSection();
});
});
} else if (section === 'fines') {
document.querySelectorAll('.btn-pay-fine').forEach(btn => {
btn.addEventListener('click', async (e) => {
await apiService.payFine(e.target.dataset.id);
toast.show('Fine marked as paid', 'success');
renderCurrentSection();
});
});
} else if (section === 'settings') {
document.getElementById('btn-export-json')?.addEventListener('click', () => {
const dataStr = "data:text/json;charset=utf-8," +
encodeURIComponent(JSON.stringify(appState.state, null, 2));
const dlAnchor = document.createElement('a');
dlAnchor.setAttribute("href", dataStr);
dlAnchor.setAttribute("download", "libracore-tmsl-data.json");
document.body.appendChild(dlAnchor);
dlAnchor.click();
dlAnchor.remove();
toast.show('Data exported to JSON file', 'success');
});
document.getElementById('btn-reset-demo')?.addEventListener('click', () => {
if (confirm('Are you sure you want to reset all demo data to initial state?')) {
appState.seedDemoData();
toast.show('Demo data reset', 'info');
renderCurrentSection();

}
});
}
}
// MODAL FORM OPENERS
function openIssueModal() {
const body = `
<form id="form-issue-book" class="form-grid">
<div class="form-group full-width">
<label class="form-label">Select Member</label>
<select class="form-select" id="issue-member-id" required>
${appState.state.members.map(m => `<option
value="${m.id}">${utils.sanitize(m.name)} (${m.id})</option>`).join('')}
</select>
</div>
<div class="form-group full-width">
<label class="form-label">Select Book</label>
<select class="form-select" id="issue-book-id" required>
${appState.state.books.filter(b => b.availableCopies > 0).map(b => `<option
value="${b.id}">${utils.sanitize(b.title)} (${b.availableCopies} available)</option>`).join('')}
</select>
</div>
<div class="form-group full-width">
<label class="form-label">Due Date</label>
<input type="date" class="form-input" id="issue-due-date" value="2026-10-05"
required>
</div>
</form>
`;
const footer = `
<button class="btn btn-secondary" onclick="modal.close()">Cancel</button>
<button class="btn btn-primary" id="btn-submit-issue">Issue Book</button>
`;
modal.open('Issue Book to Member', body, footer);
document.getElementById('btn-submit-issue').addEventListener('click', async () => {
const memberId = document.getElementById('issue-member-id').value;
const bookId = document.getElementById('issue-book-id').value;
const dueDate = document.getElementById('issue-due-date').value;
try {
await apiService.issueBook(memberId, bookId, dueDate);

modal.close();
toast.show('Book issued successfully!', 'success');
renderCurrentSection();
} catch (err) {
toast.show(err.message, 'error');
}
});
}
function openEditBookModal(bookId) {
const book = appState.state.books.find(b => b.id === bookId);
if (!book) {
 toast.show('Book not found', 'error');
 return;
}

const body = `
<form id="form-edit-book" class="form-grid">
<div class="form-group full-width">
<label class="form-label">Book Title</label>
<input type="text" class="form-input" id="edit-book-title" value="${utils.sanitize(book.title)}" required>
</div>
<div class="form-group">
<label class="form-label">Author(s)</label>
<input type="text" class="form-input" id="edit-book-author" value="${utils.sanitize(book.author)}" required>
</div>
<div class="form-group">
<label class="form-label">Category</label>
<select class="form-select" id="edit-book-category">
<option value="Computer Science" ${book.category === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
<option value="Information Technology" ${book.category === 'Information Technology' ? 'selected' : ''}>Information Technology</option>
<option value="Artificial Intelligence" ${book.category === 'Artificial Intelligence' ? 'selected' : ''}>Artificial Intelligence</option>
<option value="Electronics & Communication" ${book.category === 'Electronics & Communication' ? 'selected' : ''}>Electronics & Communication</option>
<option value="Electronics & Computer Science" ${book.category === 'Electronics & Computer Science' ? 'selected' : ''}>Electronics & Computer Science</option>
</select>
</div>
<div class="form-group">
<label class="form-label">ISBN</label>
<input type="text" class="form-input" id="edit-book-isbn" value="${utils.sanitize(book.isbn)}" required>
</div>
<div class="form-group">
<label class="form-label">Total Copies</label>
<input type="number" class="form-input" id="edit-book-copies" value="${book.totalCopies}" min="1" required>
</div>
<div class="form-group">
<label class="form-label">Available Copies</label>
<input type="number" class="form-input" id="edit-book-available" value="${book.availableCopies}" min="0" required>
</div>
<div class="form-group">
<label class="form-label">Shelf</label>
<input type="text" class="form-input" id="edit-book-shelf" value="${utils.sanitize(book.shelf)}" required>
</div>
</form>
`;

const footer = `
<button class="btn btn-secondary" onclick="modal.close()">Cancel</button>
<button class="btn btn-primary" id="btn-update-book">Save Changes</button>
`;

modal.open('Edit Book', body, footer);

document.getElementById('btn-update-book').addEventListener('click', async () => {
const title = document.getElementById('edit-book-title').value.trim();
const author = document.getElementById('edit-book-author').value.trim();
const category = document.getElementById('edit-book-category').value;
const isbn = document.getElementById('edit-book-isbn').value.trim();
const totalCopies = parseInt(document.getElementById('edit-book-copies').value, 10);
const availableCopies = parseInt(document.getElementById('edit-book-available').value, 10);
const shelf = document.getElementById('edit-book-shelf').value.trim();

if (!title || !author || !isbn || !shelf || !Number.isInteger(totalCopies) || !Number.isInteger(availableCopies)) {
 toast.show('Please fill in all fields correctly', 'error');
 return;
}

if (totalCopies < 1 || availableCopies < 0 || availableCopies > totalCopies) {
 toast.show('Available copies cannot exceed total copies', 'error');
 return;
}

await apiService.updateBook(bookId, { title, author, category, isbn, totalCopies, availableCopies, shelf });
modal.close();
toast.show('Book updated successfully', 'success');
renderCurrentSection();
});
}

function openAddBookModal() {
const body = `
<form id="form-add-book" class="form-grid">
<div class="form-group full-width">
<label class="form-label">Book Title</label>
<input type="text" class="form-input" id="new-book-title" placeholder="e.g. Clean Architecture" required>
</div>
<div class="form-group">
<label class="form-label">Author(s)</label>
<input type="text" class="form-input" id="new-book-author" placeholder="e.g. Robert C. Martin" required>
</div>
<div class="form-group">
<label class="form-label">Category</label>
<select class="form-select" id="new-book-category">
<option value="Computer Science">Computer Science</option>
<option value="Information Technology">Information Technology</option>
<option value="Artificial Intelligence">Artificial Intelligence</option>
<option value="Electronics & Communication">Electronics &
Communication</option>
</select>
</div>
<div class="form-group">
<label class="form-label">ISBN</label>
<input type="text" class="form-input" id="new-book-isbn" placeholder="978-..."
required>
</div>
<div class="form-group">
<label class="form-label">Total Copies</label>
<input type="number" class="form-input" id="new-book-copies" value="5" min="1"
required>
</div>
</form>

`;
const footer = `
<button class="btn btn-secondary" onclick="modal.close()">Cancel</button>
<button class="btn btn-primary" id="btn-submit-book">Save Book</button>
`;
modal.open('Add New Book to Catalog', body, footer);
document.getElementById('btn-submit-book').addEventListener('click', async () => {
const title = document.getElementById('new-book-title').value.trim();
const author = document.getElementById('new-book-author').value.trim();
const category = document.getElementById('new-book-category').value;
const isbn = document.getElementById('new-book-isbn').value.trim();
const totalCopies = parseInt(document.getElementById('new-book-copies').value, 10);
if (!title || !author) {
toast.show('Please fill in required fields', 'error');
return;
}
await apiService.addBook({ title, author, category, isbn, totalCopies, shelf: 'CS-01',
publisher: 'TMSL Press', year: 2026 });
modal.close();
toast.show('New book added to catalog', 'success');
renderCurrentSection();
});
}
/*
==========================================================================
8. GLOBAL NAVIGATION, SHORTCUTS & INITIALIZATION
==========================================================================
*/
// Sidebar Section Router
document.getElementById('sidebar-nav').addEventListener('click', (e) => {
const btn = e.target.closest('.nav-item[data-section]');
if (btn) {
appState.setState('currentSection', btn.dataset.section);
renderCurrentSection();
document.getElementById('app-sidebar').classList.remove('mobile-open');
}
});

// Mobile Toggle
document.getElementById('mobile-toggle').addEventListener('click', () => {
document.getElementById('app-sidebar').classList.toggle('mobile-open');
});
// Theme Toggle
document.getElementById('btn-theme-toggle').addEventListener('click', () => {
const currentTheme = document.documentElement.getAttribute('data-theme');
const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
document.documentElement.setAttribute('data-theme', nextTheme);
localStorage.setItem('libracore_theme', nextTheme);
});
// Keyboard Shortcuts (Ctrl+K Global Search)
window.addEventListener('keydown', (e) => {
if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
e.preventDefault();
document.getElementById('search-modal-backdrop').classList.add('show');
document.getElementById('global-search-input').focus();
} else if (e.key === 'Escape') {
modal.close();
document.getElementById('search-modal-backdrop').classList.remove('show');
}
});
document.getElementById('btn-global-search').addEventListener('click', () => {
document.getElementById('search-modal-backdrop').classList.add('show');
document.getElementById('global-search-input').focus();
});
document.getElementById('search-modal-backdrop').addEventListener('click', (e) => {
if (e.target === document.getElementById('search-modal-backdrop')) {
document.getElementById('search-modal-backdrop').classList.remove('show');
}
});
// Initial App Boot
document.addEventListener('DOMContentLoaded', () => {
const theme = localStorage.getItem('libracore_theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);
renderCurrentSection();
});
