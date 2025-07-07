
function storeZip() {
    const zip = document.getElementById('zip').value;
    if (zip.length === 5 && /^[0-9]+$/.test(zip)) {
        sessionStorage.setItem('userZip', zip);
        alert('ZIP code stored: ' + zip);
    } else {
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
