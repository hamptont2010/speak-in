
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

function lookupDistrict() {
    const address = document.getElementById('address').value;
    const confirmationEl = document.getElementById('district-confirmation');

    if (!address || address.trim().length < 5) {
        alert("Please enter a valid address.");
        return;
    }

    // Encode and build Census Geocoder URL
    const baseURL = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";
    const params = new URLSearchParams({
        address: address,
        benchmark: "Public_AR_Current",
        vintage: "Current_Current",
        format: "json"
    });

    fetch(`${baseURL}?${params}`)
        .then(response => response.json())
        .then(data => {
            const geo = data.result?.geographies;
            const house = geo?.["State Legislative Districts - Lower"]?.[0]?.NAME;
            const senate = geo?.["State Legislative Districts - Upper"]?.[0]?.NAME;

            if (!house || !senate) {
                confirmationEl.textContent = "Couldn't find districts for that address.";
                return;
            }

            confirmationEl.textContent = `🏛️ House District: ${house} | Senate District: ${senate}`;

            // Now load local rep info from districts.json
            fetch("districts.json")
                .then(resp => resp.json())
                .then(districtData => {
                    const rep = districtData.house[house];
                    const sen = districtData.senate[senate];

                    if (rep && sen) {
                        alert(`Your Rep is ${rep.name} (${rep.phone})\nYour Senator is ${sen.name} (${sen.phone})`);
                        // Optionally: store in sessionStorage if needed
                    } else {
                        alert("Found district numbers, but couldn’t match to names in database.");
                    }
                });
        })
        .catch(err => {
            console.error("Error in geocoder:", err);
            confirmationEl.textContent = "Failed to retrieve district info.";
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

