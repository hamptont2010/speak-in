
function storeZip() {
    const zip = document.getElementById('zip').value;
    const confirmationEl = document.getElementById('zip-confirmation');

    if (zip.length === 5 && /^[0-9]+$/.test(zip)) {
        // Save the ZIP to session
        sessionStorage.setItem('userZip', zip);

        // Fetch zip-data.json from the hosted site
        fetch('zip-data.json')
            .then(response => response.json())
            .then(data => {
                if (data[zip]) {
                    const county = data[zip].county;
                    confirmationEl.textContent = `ZIP ${zip} is in ${county} County.`;
                } else {
                    confirmationEl.textContent = `ZIP ${zip} is not currently supported.`;
                }
            })
            .catch(error => {
                console.error('Error loading zip-data.json:', error);
                confirmationEl.textContent = 'Error retrieving county information.';
            });
    } else {
        confirmationEl.textContent = '';
        alert('Please enter a valid 5-digit ZIP code.');
    }
}


function goToIssue(issueId) {
    const zip = sessionStorage.getItem('userZip');
    if (!zip) {
        alert('Please enter your ZIP code first.');
        return;
    }
    alert(`Routing to contacts for ${issueId} in ZIP ${zip}`);
}
