import { supabase } from './client.js';

function unwrap(result) {
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data;
}

function displayStatus(value) {
  const status = String(value || '');
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function mapBook(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    isbn: book.isbn || '',
    publisher: book.publisher || '',
    year: book.year,
    shelf: book.shelf || '',
    totalCopies: book.total_copies,
    availableCopies: book.available_copies,
    rating: Number(book.rating) || 0,
    issueCount: book.issue_count || 0,
    coverBg: book.cover_bg || '#1e293b'
  };
}

function mapMember(member) {
  return {
    id: member.id,
    authUserId: member.auth_user_id,
    name: member.name,
    email: member.email || '',
    address: member.address || '',
    department: member.department || '',
    phone: member.phone || '',
    role: String(member.role || 'Student').toLowerCase(),
    status: displayStatus(member.status),
    joinedDate: member.joined_date
  };
}

function mapLoan(loan) {
  const isReturned = String(loan.status).toLowerCase() === 'returned';
  const isOverdue = !isReturned && loan.due_date < new Date().toISOString().slice(0, 10);
  return {
    id: loan.id,
    memberId: loan.member_id,
    bookId: loan.book_id,
    issueDate: loan.issue_date,
    dueDate: loan.due_date,
    returnDate: loan.return_date,
    status: isReturned ? 'Returned' : isOverdue ? 'Overdue' : 'Issued'
  };
}

function mapReservation(reservation) {
  return {
    id: reservation.id,
    memberId: reservation.member_id,
    bookId: reservation.book_id,
    date: reservation.reservation_date,
    status: displayStatus(reservation.status)
  };
}

function mapFine(fine) {
  return {
    id: fine.id,
    memberId: fine.member_id,
    bookId: fine.book_id,
    dueDate: fine.due_date,
    returnDate: fine.return_date,
    daysOverdue: fine.days_overdue,
    amount: Number(fine.amount),
    paidAmount: Number(fine.paid_amount),
    status: displayStatus(fine.status)
  };
}

export async function getProfile(userId) {
  return unwrap(await supabase
    .from('user_profiles')
    .select('id, full_name, phone, role, status')
    .eq('id', userId)
    .single());
}

export async function loadLibraryData() {
  const [bookResult, memberResult, loanResult, reservationResult, fineResult] = await Promise.all([
    supabase.from('books').select('*').is('archived_at', null).order('created_at', { ascending: false }),
    supabase.from('members').select('*').order('name'),
    supabase.from('loans').select('*').order('issue_date', { ascending: false }),
    supabase.from('reservations').select('*').order('reservation_date', { ascending: false }),
    supabase.from('fines').select('*').order('created_at', { ascending: false })
  ]);

  const books = unwrap(bookResult).map(mapBook);
  const members = unwrap(memberResult).map(mapMember);
  const issues = unwrap(loanResult).map(mapLoan);
  const reservations = unwrap(reservationResult).map(mapReservation);
  const fines = unwrap(fineResult).map(mapFine);
  const memberById = new Map(members.map(member => [member.id, member]));
  const bookById = new Map(books.map(book => [book.id, book]));
  const activities = issues.slice(0, 10).map(issue => ({
    id: issue.id,
    userName: memberById.get(issue.memberId)?.name || 'Library member',
    action: issue.status === 'Returned' ? 'Returned' : 'Issued',
    bookTitle: bookById.get(issue.bookId)?.title || 'Book',
    timestamp: issue.returnDate || issue.issueDate,
    status: issue.status === 'Returned' ? 'info' : 'success'
  }));

  return { books, members, issues, reservations, fines, activities };
}

export async function addBook(book) {
  return mapBook(unwrap(await supabase.from('books').insert({
    title: book.title,
    author: book.author,
    category: book.category,
    isbn: book.isbn || null,
    publisher: book.publisher || null,
    year: book.year || null,
    shelf: book.shelf || null,
    total_copies: book.totalCopies,
    available_copies: book.totalCopies,
    rating: 0,
    issue_count: 0
  }).select().single()));
}

export async function updateBook(id, changes) {
  return mapBook(unwrap(await supabase.rpc('update_book', {
    p_book_id: id,
    p_title: changes.title,
    p_author: changes.author,
    p_category: changes.category,
    p_isbn: changes.isbn,
    p_shelf: changes.shelf,
    p_total_copies: changes.totalCopies
  })));
}

export async function archiveBook(id) {
  return unwrap(await supabase.rpc('archive_book', { p_book_id: id }));
}

export async function addMember(member) {
  const role = member.role.toLowerCase();
  return mapMember(unwrap(await supabase.from('members').insert({
    id: `MEM-${crypto.randomUUID()}`,
    name: member.name,
    email: member.email,
    phone: member.phone || null,
    address: member.address || null,
    department: member.department || null,
    role: role.charAt(0).toUpperCase() + role.slice(1),
    status: 'Active',
    joined_date: new Date().toISOString().slice(0, 10)
  }).select().single()));
}

export async function updateMember(id, changes) {
  const role = changes.role.toLowerCase();
  return mapMember(unwrap(await supabase.from('members').update({
    name: changes.name,
    email: changes.email,
    phone: changes.phone || null,
    address: changes.address || null,
    department: changes.department || null,
    role: role.charAt(0).toUpperCase() + role.slice(1),
    status: changes.status
  }).eq('id', id).select().single()));
}

export async function issueBook(memberId, bookId, dueDate) {
  return unwrap(await supabase.rpc('issue_book', {
    p_book_id: bookId,
    p_member_id: memberId,
    p_due_date: dueDate
  }));
}

export async function returnBook(loanId) {
  return unwrap(await supabase.rpc('return_book', { p_loan_id: loanId }));
}

export async function reserveBook(bookId) {
  return unwrap(await supabase.rpc('reserve_book', { p_book_id: bookId }));
}

export async function cancelReservation(reservationId) {
  return unwrap(await supabase.rpc('cancel_reservation', {
    p_reservation_id: reservationId
  }));
}

export async function recordFinePayment(fineId, amount, paymentMethod = 'cash') {
  return unwrap(await supabase.rpc('record_fine_payment', {
    p_fine_id: fineId,
    p_amount: amount,
    p_payment_method: paymentMethod
  }));
}
