let participants = [];
let expenses = [];
let payments = [];  // NEW: store confirmed payments here
let chart;
let currentGroupId = localStorage.getItem('groupId');

let categoryChartInstance = null; 

async function fetchPayments() {
  try {
    const res = await fetch(`http://localhost:5000/api/groups/${currentGroupId}/payments`);
    if (!res.ok) throw new Error(`Failed to fetch payments: ${res.statusText}`);
    const data = await res.json();
    // Map raw rows into the shape your displaySummary expects:
    payments = data.payments.map(p => {
      const payer = participants.find(x => x.id === p.payer_id);
      const payee = participants.find(x => x.id === p.payee_id);
      return {
        amount: parseFloat(p.amount),
        from_name: payee ? payee.name : `ID ${p.payee_id}`,
        to_name: payer ? payer.name : `ID ${p.payer_id}`
      };
    });
  } catch (err) {
    console.error('Error fetching payments:', err);
    payments = [];
  }
}

function updateParticipantList() {
  const participantList = document.getElementById('participantList');
  participantList.innerHTML = '';

  if (participants.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No participants added yet.';
    li.style.fontStyle = 'italic';
    li.style.color = 'var(--gray)';
    participantList.appendChild(li);
    return;
  }

  participants.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.name;

    // Create delete button
    // Create delete button
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Remove';
deleteButton.style.fontSize = '12px'; // Adjust the font size
deleteButton.style.padding = '4px 8px'; // Adjust the padding
deleteButton.style.marginLeft = '5px'; // Optional: add some space between the name and the button
deleteButton.onclick = () => deleteParticipant(p.id);
li.appendChild(deleteButton);


    participantList.appendChild(li);
  });
}

// Delete participant
async function deleteParticipant(participantId) {
  if (!confirm('Are you sure you want to delete this participant?')) return;

  try {
    const response = await fetch(`http://localhost:5000/api/participant/${participantId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`Failed to delete participant: ${response.statusText}`);

    // Refresh the participant list
    await fetchParticipants(currentGroupId);
  } catch (error) {
    console.error('Error deleting participant:', error);
    alert('Failed to delete participant: ' + error.message);
  }
}

// Helper to update payer dropdown
function updatePayerSelect() {
  const payerSelect = document.getElementById('payerSelect');
  payerSelect.innerHTML = '<option value="">Select a payer</option>';
  participants.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = p.name;
    payerSelect.appendChild(option);
  });
}

// Add participant
const addParticipant = async () => {
  const participantName = document.getElementById('participantInput').value;
  if (!participantName || !currentGroupId) {
    alert('Please provide a name!!');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/participant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: participantName, group_id: parseInt(currentGroupId) })
    });

    const data = await response.json();  // Parse JSON response directly

    if (response.ok) {
      console.log('Participant added:', data);
      document.getElementById('participantInput').value = '';
      fetchParticipants(currentGroupId); 
    } else {
      // Show error message from backend, e.g. "Participant with this name already exists"
      alert('Failed to add participant: ' + (data.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to add participant: ' + error.message);
  }
};

async function handleOCR() {
  const fileInput = document.getElementById('ocrImageInput');
  const file = fileInput.files[0];
  
  const ocrResult = await uploadImageForOCR(file);
  if (ocrResult) {
    // Example: auto-fill your expense form fields
    document.getElementById('expenseAmount').value = ocrResult.amount || '';
    document.getElementById('expenseDescription').value = ocrResult.description || '';
  }
}

function removeBillFile() {
  const fileInput = document.getElementById('ocrImageInput');
  if (fileInput) {
    fileInput.value = '';  // Clear the selected file
    // Optionally clear extracted amount and description inputs
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDescription').value = '';
    alert('File removed and fields cleared.');
  } else {
    console.warn('File input element not found.');
  }
}


async function uploadImageForOCR(file) {
  if (!file) {
    alert('Please select an image file to upload.');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:8000/api/ocr-upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert('OCR upload failed: ' + (errorData.error || 'Unknown error'));
      return null;
    }

    const data = await response.json();
    // data = { amount: '...', description: '...' }
    console.log('OCR data:', data);
    return data;

  } catch (error) {
    console.error('Error uploading image for OCR:', error);
    alert('Failed to upload image for OCR: ' + error.message);
    return null;
  }
}

// Fetch participants
async function fetchParticipants(groupId) {
  console.log("Fetching participants for group:", groupId);
  try {
    const response = await fetch(`http://localhost:5000/api/groups/${groupId}/participant`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log("Fetched participants:", data);

    participants = data.participants;
    updateParticipantList();
    updatePayerSelect();
    displaySummary();
  } catch (error) {
    console.error("Error fetching participants:", error);
  }
}

// Add expense
function addExpense() {
  const amount = document.getElementById('expenseAmount').value;
  const description = document.getElementById('expenseDescription').value;
  const payerId = document.getElementById('payerSelect').value;

  if (!amount || !description || !payerId) {
    alert('Please fill in all fields including payer before adding an expense.');
    return;
  }

  fetch('http://localhost:5000/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: parseFloat(amount),
      description,
      payer_id: parseInt(payerId),
      group_id: parseInt(currentGroupId)
    })
  })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to add expense: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      console.log('Expense added:', data);
      document.getElementById('expenseAmount').value = '';
      document.getElementById('expenseDescription').value = '';
      fetchExpenses();
    })
    .catch(err => {
      console.error('Error adding expense:', err);
      alert('Failed to add expense. Check console for details.');
    });
}

// Fetch expenses
async function fetchExpenses() {
  try {
    const response = await fetch(`http://localhost:5000/api/groups/${currentGroupId}/expenses`);
    if (!response.ok) throw new Error(`Failed to fetch expenses: ${response.statusText}`);
    const data = await response.json();
    if (Array.isArray(data.expenses)) {
      expenses = data.expenses;
      await fetchPayments();      // Fetch payments before showing summary
      displaySummary();
      drawExpenseChart();
      renderCategoryChart(data.expenses);

      updateExpensesTable();
    } else {
      console.error('Expected expenses array but got:', data.expenses);
    }
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
}

// Display summary
function displaySummary() {
  const summaryDiv = document.getElementById('summary');
  summaryDiv.innerHTML = '';

  if (participants.length === 0) {
    summaryDiv.innerHTML += '<p>No participants available to calculate debts.</p>';
    return;
  }

  const participantMap = Object.fromEntries(participants.map(p => [p.id, p.name]));
  const splits = {};

  // Calculate raw splits: how much each participant owes each other (equal split)
  expenses.forEach(exp => {
    const amountPerPerson = exp.amount / participants.length;

    participants.forEach(p => {
      if (String(p.id) !== String(exp.payer_id)) {
        const key = `${participantMap[exp.payer_id]} → ${p.name}`;
        splits[key] = (splits[key] || 0) + amountPerPerson;
      }
    });
  });

  // Subtract confirmed payments from splits
  payments.forEach(payment => {
    const key = `${payment.to_name} → ${payment.from_name}`; 
    // payment.to_name paid payment.from_name, so reduce that debt
    if (splits[key]) {
      splits[key] -= payment.amount;
      if (splits[key] < 0) splits[key] = 0;  // No negative debts
    }
  });

  // Prepare display structure excluding zero debts
  const participantOwes = {};
  Object.entries(splits).forEach(([key, amount]) => {
    if (amount > 0.01) { // Ignore near-zero debts
      const [payer, oweTo] = key.split(' → ');
      if (!participantOwes[payer]) participantOwes[payer] = [];
      participantOwes[payer].push({ oweTo, amount });
    }
  });

  window.transactionData = [];

  Object.entries(participantOwes).forEach(([payer, owesList], i) => {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = `${owesList.length} person(s) owe ${payer}`;
    details.appendChild(summary);

    owesList.forEach((entry, j) => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="checkbox" id="paid_${i}${j}" onchange="toggleTransaction('${i}${j}')">
        <span class="debt-text">${entry.oweTo} owes ${payer}: ₹${entry.amount.toFixed(2)}</span>
        <button id="confirmButton_${i}${j}" onclick="confirmPayment('${i}${j}')" disabled>Confirm</button>
      `;
      details.appendChild(label);
      details.appendChild(document.createElement('br'));

      window.transactionData.push({ payer, to: entry.oweTo, amount: entry.amount, index: `${i}${j}` });
    });

    summaryDiv.appendChild(details);
  });

  if (Object.keys(participantOwes).length === 0) {
    summaryDiv.innerHTML += '<p>All debts are cleared!</p>';
  }
}

// Toggle checkbox
function toggleTransaction(index) {
  const checkbox = document.getElementById(`paid_${index}`);
  const confirmButton = document.getElementById(`confirmButton_${index}`);
  confirmButton.disabled = !checkbox.checked;

  const label = checkbox.parentElement;
  const text = label.querySelector('.debt-text');
  if (text) text.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
}

// Confirm payment
async function confirmPayment(index) {
  const transaction = window.transactionData.find(t => t.index === index);
  if (!transaction) return;

  // IDs
  const payerObj = participants.find(p => p.name === transaction.payer);
  const payeeObj = participants.find(p => p.name === transaction.to);
  const expenseObj = expenses.find(e => e.payer_id === payerObj.id);
  const payer_id = payerObj.id, payee_id = payeeObj.id, expense_id = expenseObj.id;
  // Get label and checkbox elements inside this function
  const checkbox = document.getElementById(`paid_${index}`);
  const label = checkbox.parentElement;

  try {
    const res = await fetch('http://localhost:5000/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
       expense_id,
       payer_id,
       payee_id,
       amount: transaction.amount,
       group_id: parseInt(currentGroupId)   // ← include group_id now
     })
    });
    if (!res.ok) throw new Error('Failed to confirm payment');

    // On success, update UI
    const confirmationDiv = document.createElement('div');
    confirmationDiv.textContent = `${transaction.to} has paid ${transaction.payer}!`;
    confirmationDiv.style.animation = 'fadeIn 2s forwards';
    confirmationDiv.style.marginTop = '10px';
    confirmationDiv.style.fontSize = '18px';
    confirmationDiv.style.color = '#28a745';

    label.appendChild(confirmationDiv);

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    checkbox.disabled = true;

    setTimeout(async () => {
      label.style.display = 'none';
      const summary = label.closest('details').querySelector('summary');
      const count = parseInt(summary.textContent.match(/\d+/)[0]);
      summary.textContent = `${count - 1} person(s) owe ${transaction.payer}`;
      window.transactionData = window.transactionData.filter(t => t.index !== index);

      // REFRESH payments, expenses and summary to reflect changes
      await fetchPayments();
      fetchExpenses();
    }, 2000);

  } catch (err) {
    alert('Error confirming payment: ' + err.message);
  }
}


// Update expenses table
function updateExpensesTable() {
  const tableBody = document.querySelector('#expenseTable tbody');
  tableBody.innerHTML = '';

  const participantMap = Object.fromEntries(participants.map(p => [p.id, p.name]));

  expenses.forEach(exp => {
    const row = document.createElement('tr');

    // Description
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = exp.description;

    // Amount
    const amountCell = document.createElement('td');
    amountCell.textContent = `₹${parseFloat(exp.amount).toFixed(2)}`;

    // Payer
    const payerCell = document.createElement('td');
    payerCell.textContent = participantMap[exp.payer_id] || 'Unknown';

    // Category
    const categoryCell = document.createElement('td');
    categoryCell.textContent = exp.category || 'Uncategorized';

    // Date
    const dateCell = document.createElement('td');
    dateCell.textContent = new Date(exp.created_at).toLocaleString();

    // Actions (Delete)
    const actionsCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn-delete';
    deleteBtn.onclick = () => deleteExpense(exp.id);
    actionsCell.appendChild(deleteBtn);

    // Append all cells to row
    row.appendChild(descriptionCell);
    row.appendChild(amountCell);
    row.appendChild(payerCell);
    row.appendChild(categoryCell);
    row.appendChild(dateCell);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  });
}

// Delete expense
async function deleteExpense(expenseId) {
  if (!confirm('Are you sure you want to delete this expense?')) return;
  try {
    const res = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    // Refresh the list
    fetchExpenses();
  } catch (err) {
    console.error('Failed to delete expense:', err);
    alert('Could not delete expense. See console for details.');
  }
}

document.getElementById('downloadPdfBtn')
        .addEventListener('click', ()=>{
  const groupId = localStorage.getItem('groupId');
  window.open(`http://localhost:5000/api/groups/${groupId}/expenses/pdf`, '_blank');
});


// Draw charts
function drawExpenseChart() {
  const payerTotals = {};
  const descriptionTotals = {};

  participants.forEach(p => payerTotals[p.name] = 0);
  expenses.forEach(e => {
    const payer = participants.find(p => p.id === e.payer_id);
    if (payer) payerTotals[payer.name] += parseFloat(e.amount);

    const desc = e.description || 'Misc';
    descriptionTotals[desc] = (descriptionTotals[desc] || 0) + parseFloat(e.amount);
  });

  if (window.barChart) window.barChart.destroy();
  if (window.pieChart) window.pieChart.destroy();

  const barCtx = document.getElementById('expenseChart').getContext('2d');
  window.barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(payerTotals),
      datasets: [{
        label: 'Total amount paid',
        data: Object.values(payerTotals),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Payments by Each Person', font: { size: 18 } }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  const pieCtx = document.getElementById('descriptionChart').getContext('2d');
  const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#2ecc71', '#f39c12', '#1abc9c', '#e74c3c'];

  window.pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(descriptionTotals),
      datasets: [{
        
        data: Object.values(descriptionTotals),
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Expense Distribution by Description',
          font: { size: 18 }
        }
      }
    }
  });
}

function renderCategoryChart(expenses) {
    const categoryCounts = {};

    for (const expense of expenses) {
        const category = expense.category || "Other";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    const ctx = document.getElementById("categoryChart").getContext("2d");

    // Destroy existing chart if it exists
    if (categoryChartInstance !== null) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryCounts),
            datasets: [{
                data: Object.values(categoryCounts),
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF", "#80FF80"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}



// Initial load
window.onload = async function () {
  const groupName = localStorage.getItem("groupName");
  if (!groupName || !currentGroupId) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("groupHeader").innerText = "Group: " + groupName;

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_name: groupName })
    });
    const data = await response.json();
    if (data.success) {
      participants = data.participant || [];
      localStorage.setItem("groupId", data.group_id);
      currentGroupId = data.group_id;

      updateParticipantList();
      updatePayerSelect();
      await fetchParticipants(currentGroupId);
      await fetchExpenses();  // this fetches payments too now
    }
  } catch (error) {
    console.error("Error loading participants:", error);
  }
};