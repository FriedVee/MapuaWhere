
        function markResolved() {
            // Update status buttons
            const buttons = document.querySelectorAll('.status-header .btn');
            buttons.forEach(btn => btn.classList.replace('btn-dark', 'btn-outline-dark'));
            buttons[2].classList.replace('btn-outline-dark', 'btn-dark');

            // Add timestamped entry to log
            const log = document.getElementById('activity-log');
            const now = new Date();
            const timestamp = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            const newEntry = document.createElement('li');
            newEntry.className = "list-group-item d-flex justify-content-between p-2 fw-bold text-success";
            newEntry.innerHTML = `<span>Item Resolved</span><span class="badge bg-success rounded-pill">${timestamp}</span>`;
            log.appendChild(newEntry);

            // Update status text
            document.getElementById('current-status-text').innerText = "RESOLVED";
            document.getElementById('current-status-text').parentElement.classList.replace('text-danger', 'text-success');

            alert("Item marked as resolved at " + timestamp);
        }

        function toggleCollabSidebar() {
    const sidebar = document.getElementById('collab-sidebar');
    // Louise's active class trigger
    sidebar.classList.toggle('active');
}
    