// ========================================
// LIBRARY MANAGEMENT SYSTEM
// JAVASCRIPT
// ========================================


// ========================================
// DEFAULT DATA
// ========================================

const defaultBooks = [

    {
        id: 1,
        title: "Java Programming",
        author: "James Gosling",
        category: "Programming",
        copies: 10,
        available: 7,
        isbn: "978123456789",
        status: "Available"
    },

    {
        id: 2,
        title: "React Complete Guide",
        author: "Max",
        category: "Web Development",
        copies: 5,
        available: 2,
        isbn: "978987654321",
        status: "Available"
    },

    {
        id: 3,
        title: "Python Programming",
        author: "Guido van Rossum",
        category: "Programming",
        copies: 8,
        available: 0,
        isbn: "978456789123",
        status: "Issued"
    },

    {
        id: 4,
        title: "Database Management",
        author: "Abraham Silberschatz",
        category: "Database",
        copies: 6,
        available: 4,
        isbn: "978111222333",
        status: "Available"
    }

];


const defaultMembers = [

    {
        id: 1,
        name: "Roni",
        email: "roni@example.com",
        phone: "9876543210",
        role: "Student",
        status: "Active",
        books: 2
    },

    {
        id: 2,
        name: "John Smith",
        email: "john@example.com",
        phone: "9876543211",
        role: "Student",
        status: "Active",
        books: 1
    },

    {
        id: 3,
        name: "Sarah Williams",
        email: "sarah@example.com",
        phone: "9876543212",
        role: "Teacher",
        status: "Active",
        books: 3
    }

];


// ========================================
// LOAD DATA FROM LOCALSTORAGE
// ========================================

let books =
    JSON.parse(
        localStorage.getItem("books")
    ) || defaultBooks;


let members =
    JSON.parse(
        localStorage.getItem("members")
    ) || defaultMembers;


let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];


// ========================================
// SAVE DATA
// ========================================

function saveBooks() {

    localStorage.setItem(
        "books",
        JSON.stringify(books)
    );

}


function saveMembers() {

    localStorage.setItem(
        "members",
        JSON.stringify(members)
    );

}


function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value;


        const password =
            document
                .getElementById("loginPassword")
                .value;


        if (
            email === "admin@library.com"
            &&
            password === "admin123"
        ) {

            document
                .getElementById("loginPage")
                .classList
                .add("hidden");


            document
                .getElementById("app")
                .classList
                .remove("hidden");


            localStorage.setItem(
                "loggedIn",
                "true"
            );


            showToast(
                "Login successful!"
            );


            initializeApp();

        }

        else {

            alert(
                "Invalid Email or Password!\n\nDemo:\nadmin@library.com\nadmin123"
            );

        }

    }
);


// ========================================
// AUTO LOGIN
// ========================================

window.addEventListener(
    "load",
    function() {

        const loggedIn =
            localStorage.getItem(
                "loggedIn"
            );


        if (
            loggedIn === "true"
        ) {

            document
                .getElementById("loginPage")
                .classList
                .add("hidden");


            document
                .getElementById("app")
                .classList
                .remove("hidden");


            initializeApp();

        }

    }
);


// ========================================
// INITIALIZE APPLICATION
// ========================================

function initializeApp() {

    renderBooks();

    renderMembers();

    renderIssuedBooks();

    updateDashboard();

    updateIssueForm();

    updateReturnForm();

}


// ========================================
// PASSWORD TOGGLE
// ========================================

const togglePassword =
    document.getElementById(
        "togglePassword"
    );


togglePassword.addEventListener(
    "click",
    function() {

        const passwordInput =
            document.getElementById(
                "loginPassword"
            );


        if (
            passwordInput.type === "password"
        ) {

            passwordInput.type = "text";

            this.classList.remove(
                "fa-eye"
            );

            this.classList.add(
                "fa-eye-slash"
            );

        }

        else {

            passwordInput.type = "password";

            this.classList.remove(
                "fa-eye-slash"
            );

            this.classList.add(
                "fa-eye"
            );

        }

    }
);


// ========================================
// NAVIGATION
// ========================================

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


navLinks.forEach(
    function(link) {

        link.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const pageName =
                    this.dataset.page;


                // Remove active class

                navLinks.forEach(
                    function(nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                // Add active class

                this.classList.add(
                    "active"
                );


                // Hide all pages

                document
                    .querySelectorAll(".page")
                    .forEach(
                        function(page) {

                            page.classList.remove(
                                "active-page"
                            );

                        }
                    );


                // Show selected page

                document
                    .getElementById(pageName)
                    .classList.add(
                        "active-page"
                    );


                // Update title

                const pageTitle =
                    this.innerText;


                document
                    .getElementById("pageTitle")
                    .innerText =
                    pageTitle;


                // Refresh page data

                initializeApp();

            }
        );

    }
);


// ========================================
// MOBILE SIDEBAR
// ========================================

const menuToggle =
    document.getElementById(
        "menuToggle"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


menuToggle.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "show"
        );

    }
);


// ========================================
// LOGOUT
// ========================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            localStorage.removeItem(
                "loggedIn"
            );


            document
                .getElementById("app")
                .classList
                .add("hidden");


            document
                .getElementById("loginPage")
                .classList
                .remove("hidden");

        }
    );


// ========================================
// BOOK MODAL
// ========================================

const bookModal =
    document.getElementById(
        "bookModal"
    );


document
    .getElementById("addBookBtn")
    .addEventListener(
        "click",
        function() {

            bookModal.classList.add(
                "show"
            );

        }
    );


document
    .getElementById("closeBookModal")
    .addEventListener(
        "click",
        function() {

            bookModal.classList.remove(
                "show"
            );

        }
    );


// ========================================
// ADD BOOK
// ========================================

document
    .getElementById("addBookForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const title =
                document
                    .getElementById("bookTitle")
                    .value;


            const author =
                document
                    .getElementById("bookAuthor")
                    .value;


            const category =
                document
                    .getElementById("bookCategory")
                    .value;


            const copies =
                Number(
                    document
                        .getElementById("bookCopies")
                        .value
                );


            const isbn =
                document
                    .getElementById("bookISBN")
                    .value;


            const newBook = {

                id: Date.now(),

                title: title,

                author: author,

                category: category,

                copies: copies,

                available: copies,

                isbn: isbn,

                status: "Available"

            };


            books.push(newBook);


            saveBooks();


            renderBooks();

            updateDashboard();

            updateIssueForm();


            this.reset();


            bookModal.classList.remove(
                "show"
            );


            showToast(
                "Book added successfully!"
            );

        }
    );


// ========================================
// RENDER BOOKS
// ========================================

function renderBooks(bookList = books) {

    const tableBody =
        document.getElementById(
            "bookTableBody"
        );


    tableBody.innerHTML = "";


    if (
        bookList.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No books found.
                </td>
            </tr>
        `;

        return;

    }


    bookList.forEach(
        function(book) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="book-cell">

                        <div class="book-image">
                            📘
                        </div>

                        <div>

                            <strong>
                                ${book.title}
                            </strong>

                            <br>

                            <small>
                                ISBN: ${book.isbn || "N/A"}
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${book.author}
                </td>


                <td>
                    ${book.category}
                </td>


                <td>
                    ${book.available} / ${book.copies}
                </td>


                <td>

                    <span class="badge ${
                        book.available > 0
                            ? "available"
                            : "issued"
                    }">

                        ${
                            book.available > 0
                                ? "Available"
                                : "Issued"
                        }

                    </span>

                </td>


                <td>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteBook(${book.id})"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// ========================================
// DELETE BOOK
// ========================================

function deleteBook(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (
        !confirmDelete
    ) {
        return;
    }


    books =
        books.filter(
            function(book) {

                return book.id !== id;

            }
        );


    saveBooks();


    renderBooks();

    updateDashboard();

    updateIssueForm();


    showToast(
        "Book deleted successfully!"
    );

}


// ========================================
// BOOK SEARCH
// ========================================

document
    .getElementById("bookSearch")
    .addEventListener(
        "input",
        function() {

            filterBooks();

        }
    );


// ========================================
// CATEGORY FILTER
// ========================================

document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        filterBooks
    );


// ========================================
// STATUS FILTER
// ========================================

document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        filterBooks
    );


// ========================================
// FILTER BOOKS
// ========================================

function filterBooks() {

    const search =
        document
            .getElementById("bookSearch")
            .value
            .toLowerCase();


    const category =
        document
            .getElementById("categoryFilter")
            .value;


    const status =
        document
            .getElementById("statusFilter")
            .value;


    const filteredBooks =
        books.filter(
            function(book) {

                const matchesSearch =

                    book.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    book.author
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =

                    category === ""

                    ||

                    book.category === category;


                const matchesStatus =

                    status === ""

                    ||

                    (
                        status === "Available"
                        &&
                        book.available > 0
                    )

                    ||

                    (
                        status === "Issued"
                        &&
                        book.available === 0
                    );


                return
                    matchesSearch
                    &&
                    matchesCategory
                    &&
                    matchesStatus;

            }
        );


    renderBooks(filteredBooks);

}


// ========================================
// MEMBER MODAL
// ========================================

const memberModal =
    document.getElementById(
        "memberModal"
    );


document
    .getElementById("addMemberBtn")
    .addEventListener(
        "click",
        function() {

            memberModal.classList.add(
                "show"
            );

        }
    );


document
    .getElementById("closeMemberModal")
    .addEventListener(
        "click",
        function() {

            memberModal.classList.remove(
                "show"
            );

        }
    );


// ========================================
// ADD MEMBER
// ========================================

document
    .getElementById("addMemberForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const newMember = {

                id: Date.now(),

                name:
                    document
                        .getElementById("memberName")
                        .value,

                email:
                    document
                        .getElementById("memberEmail")
                        .value,

                phone:
                    document
                        .getElementById("memberPhone")
                        .value,

                role:
                    document
                        .getElementById("memberRole")
                        .value,

                status: "Active",

                books: 0

            };


            members.push(newMember);


            saveMembers();


            renderMembers();

            updateDashboard();

            updateIssueForm();


            this.reset();


            memberModal.classList.remove(
                "show"
            );


            showToast(
                "Member added successfully!"
            );

        }
    );


// ========================================
// RENDER MEMBERS
// ========================================

function renderMembers(memberList = members) {

    const tableBody =
        document.getElementById(
            "memberTableBody"
        );


    tableBody.innerHTML = "";


    memberList.forEach(
        function(member) {

            const firstLetter =
                member.name.charAt(0)
                    .toUpperCase();


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="member-cell">

                        <div class="member-avatar">

                            ${firstLetter}

                        </div>


                        <strong>

                            ${member.name}

                        </strong>

                    </div>

                </td>


                <td>

                    ${member.email}

                </td>


                <td>

                    ${member.phone}

                </td>


                <td>

                    ${member.role}

                </td>


                <td>

                    <span class="badge available">

                        ${member.status}

                    </span>

                </td>


                <td>

                    ${member.books}

                </td>


                <td>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteMember(${member.id})"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// ========================================
// DELETE MEMBER
// ========================================

function deleteMember(id) {

    const confirmDelete =
        confirm(
            "Delete this member?"
        );


    if (
        !confirmDelete
    ) {
        return;
    }


    members =
        members.filter(
            member =>
                member.id !== id
        );


    saveMembers();


    renderMembers();

    updateDashboard();

    updateIssueForm();


    showToast(
        "Member deleted!"
    );

}


// ========================================
// MEMBER SEARCH
// ========================================

document
    .getElementById("memberSearch")
    .addEventListener(
        "input",
        function() {

            const search =
                this.value
                    .toLowerCase();


            const filteredMembers =
                members.filter(
                    function(member) {

                        return
                            member.name
                                .toLowerCase()
                                .includes(search)

                            ||

                            member.email
                                .toLowerCase()
                                .includes(search);

                    }
                );


            renderMembers(
                filteredMembers
            );

        }
    );


// ========================================
// UPDATE ISSUE FORM
// ========================================

function updateIssueForm() {

    const memberSelect =
        document.getElementById(
            "issueMember"
        );


    const bookSelect =
        document.getElementById(
            "issueBook"
        );


    memberSelect.innerHTML =
        `
        <option value="">
            Select Member
        </option>
        `;


    bookSelect.innerHTML =
        `
        <option value="">
            Select Book
        </option>
        `;


    members.forEach(
        function(member) {

            memberSelect.innerHTML += `

                <option value="${member.id}">

                    ${member.name}

                </option>

            `;

        }
    );


    books
        .filter(
            book =>
                book.available > 0
        )
        .forEach(
            function(book) {

                bookSelect.innerHTML += `

                    <option value="${book.id}">

                        ${book.title}
                        (${book.available} available)

                    </option>

                `;

            }
        );

}


// ========================================
// ISSUE BOOK
// ========================================

document
    .getElementById("issueBookForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const memberId =
                Number(
                    document
                        .getElementById("issueMember")
                        .value
                );


            const bookId =
                Number(
                    document
                        .getElementById("issueBook")
                        .value
                );


            const issueDate =
                document
                    .getElementById("issueDate")
                    .value;


            const dueDate =
                document
                    .getElementById("dueDate")
                    .value;


            const member =
                members.find(
                    member =>
                        member.id === memberId
                );


            const book =
                books.find(
                    book =>
                        book.id === bookId
                );


            if (
                !member
                ||
                !book
            ) {

                alert(
                    "Please select a valid member and book."
                );

                return;

            }


            if (
                book.available <= 0
            ) {

                alert(
                    "Book is not available."
                );

                return;

            }


            const transaction = {

                id: Date.now(),

                memberId: member.id,

                memberName: member.name,

                bookId: book.id,

                bookTitle: book.title,

                issueDate: issueDate,

                dueDate: dueDate,

                status: "Issued"

            };


            transactions.push(
                transaction
            );


            book.available--;


            member.books++;


            saveBooks();

            saveMembers();

            saveTransactions();


            renderBooks();

            renderMembers();

            renderIssuedBooks();

            updateIssueForm();

            updateReturnForm();

            updateDashboard();


            this.reset();


            showToast(
                "Book issued successfully!"
            );

        }
    );


// ========================================
// RENDER ISSUED BOOKS
// ========================================

function renderIssuedBooks() {

    const tableBody =
        document.getElementById(
            "issuedTableBody"
        );


    tableBody.innerHTML = "";


    if (
        transactions.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="5">

                    No books issued yet.

                </td>

            </tr>

        `;

        return;

    }


    transactions.forEach(
        function(transaction) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    ${transaction.bookTitle}

                </td>


                <td>

                    ${transaction.memberName}

                </td>


                <td>

                    ${transaction.issueDate}

                </td>


                <td>

                    ${transaction.dueDate}

                </td>


                <td>

                    <span class="badge issued">

                        ${transaction.status}

                    </span>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// ========================================
// UPDATE RETURN FORM
// ========================================

function updateReturnForm() {

    const select =
        document.getElementById(
            "returnTransaction"
        );


    select.innerHTML =
        `
        <option value="">
            Select Transaction
        </option>
        `;


    transactions.forEach(
        function(transaction) {

            select.innerHTML += `

                <option value="${transaction.id}">

                    ${transaction.bookTitle}
                    -
                    ${transaction.memberName}

                </option>

            `;

        }
    );

}


// ========================================
// RETURN DETAILS
// ========================================

document
    .getElementById("returnTransaction")
    .addEventListener(
        "change",
        function() {

            const transactionId =
                Number(this.value);


            const transaction =
                transactions.find(
                    transaction =>
                        transaction.id === transactionId
                );


            const details =
                document.getElementById(
                    "returnDetails"
                );


            if (
                !transaction
            ) {

                details.innerHTML =
                    "Select an issued book to view details.";

                return;

            }


            details.innerHTML = `

                <h3>
                    ${transaction.bookTitle}
                </h3>

                <br>

                <p>

                    <strong>Member:</strong>

                    ${transaction.memberName}

                </p>


                <p>

                    <strong>Issue Date:</strong>

                    ${transaction.issueDate}

                </p>


                <p>

                    <strong>Due Date:</strong>

                    ${transaction.dueDate}

                </p>

            `;

        }
    );


// ========================================
// RETURN BOOK
// ========================================

document
    .getElementById("returnBookBtn")
    .addEventListener(
        "click",
        function() {

            const select =
                document.getElementById(
                    "returnTransaction"
                );


            const transactionId =
                Number(
                    select.value
                );


            if (
                !transactionId
            ) {

                alert(
                    "Please select a transaction."
                );

                return;

            }


            const transaction =
                transactions.find(
                    transaction =>
                        transaction.id === transactionId
                );


            const book =
                books.find(
                    book =>
                        book.id === transaction.bookId
                );


            const member =
                members.find(
                    member =>
                        member.id === transaction.memberId
                );


            if (
                book
            ) {

                book.available++;

            }


            if (
                member
                &&
                member.books > 0
            ) {

                member.books--;

            }


            transactions =
                transactions.filter(
                    transaction =>
                        transaction.id !== transactionId
                );


            saveBooks();

            saveMembers();

            saveTransactions();


            renderBooks();

            renderMembers();

            renderIssuedBooks();

            updateIssueForm();

            updateReturnForm();

            updateDashboard();


            document
                .getElementById("returnDetails")
                .innerHTML =
                "Book returned successfully.";


            showToast(
                "Book returned successfully!"
            );

        }
    );


// ========================================
// DASHBOARD UPDATE
// ========================================

function updateDashboard() {

    const totalBookCopies =
        books.reduce(
            function(total, book) {

                return
                    total
                    +
                    book.copies;

            },
            0
        );


    document
        .getElementById("totalBooks")
        .innerText =
        totalBookCopies;


    document
        .getElementById("totalMembers")
        .innerText =
        members.length;


    document
        .getElementById("totalIssued")
        .innerText =
        transactions.length;

}


// ========================================
// TOAST
// ========================================

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    document
        .getElementById("toastMessage")
        .innerText =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


// ========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ========================================

window.addEventListener(
    "click",
    function(event) {

        if (
            event.target === bookModal
        ) {

            bookModal.classList.remove(
                "show"
            );

        }


        if (
            event.target === memberModal
        ) {

            memberModal.classList.remove(
                "show"
            );

        }

    }
);


// ========================================
// SET DEFAULT DATES
// ========================================

function setDefaultDates() {

    const today =
        new Date();


    const due =
        new Date();


    due.setDate(
        today.getDate() + 14
    );


    const todayString =
        today
            .toISOString()
            .split("T")[0];


    const dueString =
        due
            .toISOString()
            .split("T")[0];


    const issueDate =
        document.getElementById(
            "issueDate"
        );


    const dueDate =
        document.getElementById(
            "dueDate"
        );


    if (
        issueDate
    ) {

        issueDate.value =
            todayString;

    }


    if (
        dueDate
    ) {

        dueDate.value =
            dueString;

    }

}


setDefaultDates();