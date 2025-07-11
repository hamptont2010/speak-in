let districtData = {};

window.onload = () => {
    fetch('districts.json')
        .then(response => response.json())
        .then(data => {
            districtData = data;
            populateDistrictDropdowns(data);
            populateTownDropdown(data);
        })
        .catch(error => {
            console.error('Failed to load district data:', error);
        });
};

function populateDistrictDropdowns(data) {
    const houseSelect = document.getElementById('house-select');
    const senateSelect = document.getElementById('senate-select');

    for (let i = 1; i <= 100; i++) {
        const option = new Option(`District ${i}`, i);
        houseSelect.add(option.cloneNode(true));
    }

    for (let i = 1; i <= 50; i++) {
        const option = new Option(`District ${i}`, i);
        senateSelect.add(option.cloneNode(true));
    }

    houseSelect.addEventListener('change', () => {
        const district = houseSelect.value;
        showRepInfo('house', district, 'house-info');
    });

    senateSelect.addEventListener('change', () => {
        const district = senateSelect.value;
        showRepInfo('senate', district, 'senate-info');
    });
}

function showRepInfo(chamber, district, targetId) {
    const rep = districtData[chamber][district];
    const target = document.getElementById(targetId);

    if (rep) {
        target.innerHTML = `
            <h3>${chamber.charAt(0).toUpperCase() + chamber.slice(1)} Rep: ${rep.name}</h3>
            <p><strong>Party:</strong> ${rep.party}</p>
            <p><strong>Phone:</strong> <a href="tel:${rep.phone}">${rep.phone}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${rep.email}">${rep.email}</a></p>
            <p><strong>Residence:</strong> ${rep.residence}</p>
        `;
    } else {
        target.innerHTML = '';
    }
}

function populateTownDropdown(data) {
    const townSelect = document.getElementById('town-select');
    const townInfo = document.getElementById('town-info');

    const towns = new Set();

    ['house', 'senate'].forEach(chamber => {
        for (const district in data[chamber]) {
            const rep = data[chamber][district];
            if (rep && rep.residence) {
                towns.add(rep.residence);
            }
        }
    });

    Array.from(towns).sort().forEach(town => {
        const option = new Option(town, town);
        townSelect.add(option);
    });

    townSelect.addEventListener('change', () => {
        const selectedTown = townSelect.value;
        showRepsByTown(selectedTown, townInfo);
    });
}

function showRepsByTown(town, container) {
    let matches = [];

    ['house', 'senate'].forEach(chamber => {
        for (const district in districtData[chamber]) {
            const rep = districtData[chamber][district];
            if (rep.residence === town) {
                matches.push({
                    ...rep,
                    chamber: chamber,
                    district: district
                });
            }
        }
    });

    if (matches.length === 0) {
        container.innerHTML = '<p>No representatives found for that town.</p>';
        return;
    }

    container.innerHTML = matches.map(rep => `
        <div class="rep-block">
            <h3>${rep.chamber.charAt(0).toUpperCase() + rep.chamber.slice(1)} District ${rep.district}: ${rep.name}</h3>
            <p><strong>Party:</strong> ${rep.party}</p>
            <p><strong>Phone:</strong> <a href="tel:${rep.phone}">${rep.phone}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${rep.email}">${rep.email}</a></p>
        </div>
    `).join('');
}

function goToIssue(issueId) {
    alert(`Routing to contact options for issue: ${issueId}.\nDistrict selection will determine the recipient.`);
}

// Load issues and render them dynamically
fetch('issues.json')
    .then(response => response.json())
    .then(renderIssues)
    .catch(error => console.error('Failed to load issues.json:', error));

function renderIssues(issues) {
    const container = document.getElementById('issues-container');

    issues.forEach(issue => {
        const card = document.createElement('div');
        card.className = 'issue-card';

        const title = document.createElement('h3');
        title.textContent = issue.title;

        const summary = document.createElement('p');
        summary.textContent = issue.summary;

        const expandButton = document.createElement('button');
        expandButton.textContent = 'View Talking Points';
        expandButton.onclick = () => {
            content.classList.toggle('expanded');
            expandButton.textContent = content.classList.contains('expanded')
                ? 'Hide Talking Points'
                : 'View Talking Points';
        };

        const content = document.createElement('div');
        content.className = 'issue-details';
        content.style.display = 'none'; // initially hidden

        const points = document.createElement('ul');
        issue.talkingPoints.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point;
            points.appendChild(li);
        });

        const scriptPara = document.createElement('p');
        scriptPara.innerHTML = `<strong>Suggested Script:</strong><br>${issue.script}`;

        const callButton = document.createElement('button');
        callButton.textContent = 'Call Now';
        callButton.onclick = () => goToIssue(issue.id);

        // Show/hide toggle behavior
        content.appendChild(points);
        content.appendChild(scriptPara);
        content.style.display = 'none';
        content.classList.add('collapsed');

        expandButton.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        card.appendChild(title);
        card.appendChild(summary);
        card.appendChild(expandButton);
        card.appendChild(content);
        card.appendChild(callButton);

        container.appendChild(card);
    });
}
