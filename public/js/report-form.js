document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('report-item-form');
    const btnLost = document.getElementById('btn-mode-lost');
    const btnFound = document.getElementById('btn-mode-found');
    const typeInput = document.getElementById('report-type');

    const dateLabel = document.getElementById('date-label');
    const locationHeading = document.getElementById('location-heading');
    const foundCollectionSection = document.getElementById('section-found-collection');

    function setReportMode(mode) {
        if (mode === 'lost') {
            typeInput.value = 'lost';
            btnLost.classList.add('active');
            btnLost.setAttribute('aria-checked', 'true');
            btnFound.classList.remove('active');
            btnFound.setAttribute('aria-checked', 'false');

            dateLabel.textContent = 'Date Lost';
            locationHeading.textContent = 'Last-Seen Location';
            foundCollectionSection.classList.add('d-none');

        } else {
            typeInput.value = 'found';
            btnFound.classList.add('active');
            btnFound.setAttribute('aria-checked', 'true');
            btnLost.classList.remove('active');
            btnLost.setAttribute('aria-checked', 'false');

            dateLabel.textContent = 'Date Found';
            locationHeading.textContent = 'Discovery Location';
            foundCollectionSection.classList.remove('d-none');
        }
    }

    btnLost.addEventListener('click', () => setReportMode('lost'));
    btnFound.addEventListener('click', () => setReportMode('found'));

    const dateInput = document.getElementById('item-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (typeof validateReportForm === 'function') {
                const validation = validateReportForm(form);
                if (!validation.isValid) {
                    alert(`Please fix the error(s) before submitting: \n${validation.errors.map(err => err.message).join('\n')}`);
                    return;
                }
            }

            const reportData = {
                type: typeInput.value,
                title: document.getElementById('item-title').value.trim(),
                category: document.getElementById('item-category').value,
                date: document.getElementById('item-date').value,
                description: document.getElementById('item-desc').value.trim(),
                campus: document.getElementById('item-campus').value,
                building: document.getElementById('item-building').value.trim(),
                room: document.getElementById('item-room').value.trim(),
                handoverMethod: document.querySelector('input[name="handoverMethod"]:checked')?.value || null
            };

            const photoInput = document.getElementById('item-photos');
            const photos = photoInput ? Array.from(photoInput.files) : [];

            if (photos.length > 3) {
                alert('You can upload up to 3 photos.');
                return;
            }

            const tooLarge = photos.find((photo) => photo.size > 5 * 1024 * 1024);
            if (tooLarge) {
                alert(`"${tooLarge.name}" is larger than 5 MB.`);
                return;
            }

            // Send the form as multipart/form-data so the photos are uploaded too.
            const formData = new FormData();
            Object.entries(reportData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });
            photos.forEach((photo) => formData.append('photos', photo));

            console.log('Report submission data:', reportData, `${photos.length} photo(s)`);
            fetch('/api/items', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.message || 'Failed to submit report');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Report created successfully:', data);
                    alert('✓ Report submitted successfully!');

                    form.reset();

                    if (dateInput) {
                        dateInput.value = new Date().toISOString().split('T')[0];
                    }

                    setTimeout(() => {
                        window.location.href = 'browse.html';
                    }, 1500);
                })
                .catch(error => {
                    console.error('Error submitting report:', error);
                    alert('✗ Error submitting report:\n' + error.message);
                });
        });
    }
});