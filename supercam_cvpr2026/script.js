// Run once on load to set initial 50% state
window.onload = () => {
    document.querySelectorAll('.diag-slider').forEach(s => s.dispatchEvent(new Event('input')));
};

// Initialize all clips at 50% on load
window.onload = () => {
    document.querySelectorAll('.diag-slider').forEach(s => {
        const target = s.previousElementSibling.id;
        updateDiag(s, target);
    });
};

const diagSliders = document.querySelectorAll('.diag-slider');

diagSliders.forEach(slider => {
    const syncElements = () => {
        const val = slider.value; // 0-100
        const wrapper = slider.closest('.comp-wrapper');
        const handle = wrapper.querySelector('.handle');
        const arrow = wrapper.querySelector('.arrow-indicator');

        // Safety check: if handle or img don't exist yet, stop the function
        if (!handle || !arrow) return;

        // Apply positions
        handle.style.left = val + "%";
        // 2. Slow the arrow down
        // We map 0-100 to a smaller range (e.g., 20 to 80)
        // This makes the arrow move "within" the handle's range
        const min = 7.5
        const max = 93
        const mappedVal = min + ((val - (-35)) * (max - min) / (135 - (-35)));

        // Apply slow movement
        arrow.style.left = mappedVal + "%";
        arrow.style.top = mappedVal + "%";
        
    };
    slider.value = 50;
    syncElements(); // Initial run

    slider.addEventListener('input', syncElements);
});

const vertSliders = document.querySelectorAll('.vert-slider');

vertSliders.forEach(slider => {
    const syncElements = () => {
        const val = slider.value; // 0-100
        const wrapper = slider.closest('.comp-wrapper');
        const handle = wrapper.querySelector('.dt_handle');
        const arrow = wrapper.querySelector('.arrow-horiz');

        // Safety check: if handle or img don't exist yet, stop the function
        if (!handle || !arrow) return;

        // Apply positions
        handle.style.left = val + "%";
        arrow.style.left = `calc(${val}% + 0.5%)`;
        arrow.style.top = "50%";
        
    };
    slider.value = 50;
    syncElements(); // Initial run

    slider.addEventListener('input', syncElements);
});

function updateDiag(slider, imgId, handleId) {
    const val = parseInt(slider.value);
    const img = document.getElementById(imgId);
    const handle = document.getElementById(handleId);
    
    // Safety check: if handle or img don't exist yet, stop the function
    if (!handle || !img) return;
    
    // Update the handle line position
    handle.style.left = val + "%";
    
    // Maintain the 45-degree tilt
    // The "offset" value must be constant to keep the angle
    const offset = 50; 
    const p1 = Math.max(0, val - offset);
    const p2 = Math.min(100, val + offset);
    
    // polygon format: (top-right-point, bottom-right-point, bottom-left-point, top-left-point)
    // We adjust both the top and bottom to create the slant
    img.style.clipPath = `polygon(${val + 50}% 0, 100% 0, 100% 100%, ${val - 50}% 100%)`;
}

function updateVert(slider, imgId, handleId) {
    const val = parseInt(slider.value); // 0 to 100
    const img = document.getElementById(imgId);
    const handle = document.getElementById(handleId);

    // Safety check: if handle or img don't exist yet, stop the function
    if (!handle || !img) return;
    
    // Move the line
    handle.style.left = val + "%";
    
    // Create a simple vertical cut
    // Format: (x1, top), (x2, top), (x2, bottom), (x1, bottom)
    img.style.clipPath = `polygon(${val}% 0, 100% 0, 100% 100%, ${val}% 100%)`;
}

window.addEventListener('DOMContentLoaded', () => {
    // Select all sliders in your grid
    const allSliders = document.querySelectorAll('.diag-slider');

    allSliders.forEach(slider => {
        // 1. Force value to middle
        slider.value = 50;

        // 2. Identify the target image and handle
        // Assuming your oninput is: updateDiag(this, 'clipX', 'handleX')
        const imgId = slider.getAttribute('oninput').match(/'([^']+)'/g)[0].replace(/'/g, "");
        const handleId = slider.getAttribute('oninput').match(/'([^']+)'/g)[1].replace(/'/g, "");

        // 3. Trigger the visual update
        updateDiag(slider, imgId, handleId);
    });
});

const video = document.getElementById('resultsVideo');
const spinner = document.getElementById('loadingSpinner');

// Hide spinner when the first frame of the video is ready
video.addEventListener('loadeddata', () => {
    spinner.style.display = 'none';
});

// Also hide it if the video was already cached/loaded
if (video.readyState >= 2) {
    spinner.style.display = 'none';
}

// Force play (for Firefox/Safari)
video.play().catch(() => {
    console.log("Autoplay prevented; waiting for user click.");
});
