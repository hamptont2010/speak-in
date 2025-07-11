
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

function lookupDistrictGoogle() {
    const address = document.getElementById('address').value;
    const confirmationEl = document.getElementById('district-confirmation');

    if (!address || address.trim().length < 5) {
        alert("Please enter a valid address.");
        return;
    }

    const apiKey = "AIzaSyC7XuWDxJC-QDxw9dD9oA4UQ4iJv432t8w"; // 🔐 <- Replace with your actual API key
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodedAddress}&key=${apiKey}&levels=administrativeArea1&roles=legislatorLowerBody&roles=legislatorUpperBody`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const offices = data.offices || [];
            const officials = data.officials || [];

            let houseRep = null;
            let senateRep = null;

            offices.forEach(office => {
                if (office.name.includes("State House")) {
                    houseRep = officials[office.officialIndices[0]];
                } else if (office.name.includes("State Senate")) {
                    senateRep = officials[office.officialIndices[0]];
                }
            });

            if (!houseRep || !senateRep) {
                confirmationEl.textContent = "Could not find state-level legislators for that address.";
                return;
            }

            confirmationEl.innerHTML = `
                🏛️ House: <strong>${houseRep.name}</strong><br>
                📞 ${houseRep.phones?.[0] || "No phone listed"}<br><br>
                🏛️ Senate: <strong>${senateRep.name}</strong><br>
                📞 ${senateRep.phones?.[0] || "No phone listed"}
            `;
        })
        .catch(error => {
            console.error("Google Civic API Error:", error);
            confirmationEl.textContent = "Failed to retrieve representative information.";
        });
}


function goToIssue(issueId) {
    const zip = sessionStorage.getItem('userZip');

    if (!zip) {
        alert('Please enter your ZIP code first.');
        return;
    }

    fetch('zip-data.json')
        .then(response => response.json())
        .then(data => {
            if (!data[zip]) {
                alert('That ZIP code is not currently supported. Please enter a valid Indiana ZIP.');
                return;
            }

            // If valid, show routing message (or real action later)
            const county = data[zip].county;
            alert(`Routing to contacts for ${issueId} in ${county} County (ZIP ${zip})`);
        })
        .catch(error => {
            console.error('Error loading zip-data.json:', error);
            alert('Something went wrong trying to look up your district.');
        });
}

