// ==========================================================================
// ( 1. BACK TO TOP BUTTON )
// ==========================================================================
// ( Selects the back-to-top button element from the document by its ID )
const backToTopBtn = document.getElementById("backToTopBtn");

// ( Listens for the user scrolling the webpage to determine when to show the button )
window.addEventListener("scroll", function() {
    if (backToTopBtn) {
        // ( Displays the button if the page is scrolled vertically more than 300 pixels )
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.style.display = "flex"; 
        } else {
            // ( Hides the button if the scroll position is near the top )
            backToTopBtn.style.display = "none";
        }
    }
});

// ( Adds a click event listener to smoothly scroll the page back to the top )
if(backToTopBtn) {
    backToTopBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ==========================================================================
// ( 2. FORM VALIDATION )
// ==========================================================================
// ( Selects the contact form element )
const formLienHe = document.getElementById("contactForm");
if (formLienHe) {
    // ( Prevents default submission and validates the email field when the form is submitted )
    formLienHe.addEventListener("submit", function(event) {
        const oNhapEmail = document.getElementById("email");
        const dongBaoLoi = document.getElementById("emailError");
        
        if (oNhapEmail && dongBaoLoi) {
            const giaTriEmail = oNhapEmail.value;
            // ( Checks if the entered email address ends with the specific domain "@gmail.com" )
            if (!giaTriEmail.endsWith("@gmail.com")) {
                event.preventDefault(); 
                // ( Shows the error message and highlights the input border in red if invalid )
                dongBaoLoi.style.display = "block";
                oNhapEmail.style.borderColor = "#e50914";
            } else {
                // ( Hides the error message and resets border color if valid )
                dongBaoLoi.style.display = "none";
                oNhapEmail.style.borderColor = "#444";
                event.preventDefault(); 
                // ( Displays a success alert and clears the form inputs )
                alert("Cảm ơn bạn! Thông tin đã được gửi thành công.");
                formLienHe.reset();
            }
        }
    });
}

// ==========================================================================
// ( FEATURES LOADED AFTER HTML IS FULLY READY )
// ==========================================================================
// ( Ensures the DOM content is fully loaded before executing the enclosed functions )
document.addEventListener("DOMContentLoaded", function() {
    
    // ----------------------------------------------------------------------
    // ( 3. SCHEDULE FILTER & AUTOMATIC URL FILTERING )
    // ----------------------------------------------------------------------
    // ( Selects all filter buttons and table rows inside the training schedule )
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tableRows = document.querySelectorAll('#trainingSchedule tbody tr'); 

    if (filterBtns.length > 0 && tableRows.length > 0) {
        // ( Assigns click events to each filter button to handle the highlighting logic )
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // ( Removes the active state from all buttons and applies it to the clicked one )
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // ( Retrieves the specific category to filter by from the data attribute )
                const filterValue = this.getAttribute('data-filter');

                // ( Iterates through table rows and cells to find and highlight matching class types )
                tableRows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    cells.forEach((cell, index) => {
                        // ( Skips the first column which usually contains time slots )
                        if (index === 0) return;
                        // ( Resets previously highlighted cells )
                        cell.classList.remove('highlight-red');
                        const cellText = cell.textContent.trim().toLowerCase();
                        if (cellText === '' || filterValue === 'all') return;

                        let shouldHighlight = false;
                        // ( Compares the cell text with the selected filter category )
                        if (filterValue === 'co-ban' && cellText.includes('cơ bản')) shouldHighlight = true;
                        else if (filterValue === 'nang-cao' && cellText.includes('nâng cao')) shouldHighlight = true;
                        else if (filterValue === 'tre-em' && cellText.includes('trẻ em')) shouldHighlight = true;
                        else if (filterValue === 'the-luc' && cellText.includes('thể lực')) shouldHighlight = true;

                        // ( Applies the red highlight class if a match is found )
                        if (shouldHighlight) cell.classList.add('highlight-red');
                    });
                });
            });
        });

        // ( Reads URL parameters to check if a specific filter is requested upon page load )
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter'); 
        if (filterParam) {
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
            if (targetBtn) {
                // ( Automatically clicks the target filter button and scrolls down to the table )
                setTimeout(() => {
                    targetBtn.click(); 
                    const scheduleTable = document.getElementById('trainingSchedule');
                    if (scheduleTable) {
                        scheduleTable.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        }
    }

    // ----------------------------------------------------------------------
    // ( 4. ANIMATED STATS ON HOME PAGE )
    // ----------------------------------------------------------------------
    // ( Selects the statistics container and the numeric elements inside it )
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statsSection && statNumbers.length > 0) {
        let hasAnimated = false; 
        // ( Function to animate numbers from zero to their target data value )
        const animateNumbers = () => {
            statNumbers.forEach(number => {
                const target = +number.getAttribute('data-target'); 
                const speed = 50; 
                const increment = target / speed; 
                
                // ( Recursively updates the number until it reaches the target )
                const updateCount = () => {
                    const count = +number.innerText; 
                    if (count < target) {
                        number.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 30); 
                    } else {
                        number.innerText = target; 
                    }
                };
                updateCount();
            });
        };

        // ( Uses an IntersectionObserver to trigger the animation only when the section is visible on screen )
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateNumbers();
                hasAnimated = true; 
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // ----------------------------------------------------------------------
    // ( 5. MODAL/POPUP INFO HANDLING )
    // ----------------------------------------------------------------------
    // ( Attaches click events to buttons that trigger modal popups )
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-target');
            const modal = document.getElementById(modalId);
            // ( Displays the corresponding modal block )
            if (modal) modal.style.display = "block";
        });
    });

    // ( Attaches click events to close buttons inside the modals )
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-target');
            const modal = document.getElementById(modalId);
            // ( Hides the modal block )
            if (modal) modal.style.display = "none";
        });
    });

    // ( Closes the modal if the user clicks anywhere outside of the modal content area )
    window.addEventListener("click", function(event) {
        if (event.target.classList.contains('custom-modal')) {
            event.target.style.display = "none";
        }
    });

    // ----------------------------------------------------------------------
    // ( 6. SCROLL REVEAL EFFECT FOR ABOUT PAGE )
    // ----------------------------------------------------------------------
    // ( Selects elements designated for zig-zag scroll animation )
    const zzItems = document.querySelectorAll('.zz-item');
    if (zzItems.length > 0) {
        // ( Uses an IntersectionObserver to fade in elements as they scroll into the viewport )
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.2 });
        zzItems.forEach(item => scrollObserver.observe(item));
    }

    // ----------------------------------------------------------------------
    // ( 7. TAB SWITCHING HANDLING FOR ABOUT AND CLASSES )
    // ----------------------------------------------------------------------
    // ( A reusable function to handle tab navigation logic across different sections )
    function initTabs(btnSelector, paneSelector) {
        const btns = document.querySelectorAll(btnSelector);
        const panes = document.querySelectorAll(paneSelector);

        if (btns.length > 0) {
            btns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // ( Removes active classes from all buttons and content panes )
                    btns.forEach(b => b.classList.remove('active'));
                    panes.forEach(p => p.classList.remove('active'));

                    // ( Sets the clicked button and its corresponding content pane to active )
                    this.classList.add('active');
                    const targetId = this.getAttribute('data-target');
                    const targetPane = document.getElementById(targetId);
                    
                    // ( Pauses any playing videos in hidden panes to save resources and stop audio )
                    panes.forEach(p => {
                        const vids = p.querySelectorAll('video');
                        vids.forEach(v => v.pause());
                    });

                    if (targetPane) {
                        targetPane.classList.add('active');
                        // ( Automatically plays the video inside the newly activated tab )
                        const activeVideo = targetPane.querySelector('video');
                        if (activeVideo) activeVideo.play();
                    }
                });
            });
        }
    }
    
    // ( Initializes tab functionality for general profile and class showcase sections )
    initTabs('.tab-btn', '.tab-pane');
    initTabs('.sc-tab-btn', '.sc-tab-pane');

    // ----------------------------------------------------------------------
    // ( 8. IMAGE/VIDEO SLIDER FOR ABOUT PAGE )
    // ----------------------------------------------------------------------
    // ( A reusable function to create standard carousel sliders for media elements )
    function initSlider(slidePrefix, prevBtnId, nextBtnId, isVideoSlider) {
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const slides = document.querySelectorAll(`[id^="${slidePrefix}"]`);

        if (slides.length > 0 && prevBtn && nextBtn) {
            let currentIndex = 0;
            const total = slides.length;

            // ( Updates the visible slide based on the current index )
            function updateDisplay() {
                slides.forEach(slide => {
                    slide.classList.remove('active');
                    // ( Pauses videos if the slider contains video elements )
                    if (isVideoSlider) {
                        const vid = slide.querySelector('video');
                        if (vid) vid.pause();
                    }
                });
                const targetSlide = document.getElementById(`${slidePrefix}${currentIndex}`);
                if (targetSlide) targetSlide.classList.add('active');
            }

            // ( Handles the next button click, looping back to the start if at the end )
            nextBtn.addEventListener('click', function() {
                currentIndex++;
                if (currentIndex >= total) currentIndex = 0;
                updateDisplay();
            });

            // ( Handles the previous button click, looping to the end if at the start )
            prevBtn.addEventListener('click', function() {
                currentIndex--;
                if (currentIndex < 0) currentIndex = total - 1;
                updateDisplay();
            });
        }
    }
    
    // ( Initializes specific sliders for images and videos using distinct IDs )
    initSlider('img-slide-', 'prev-img', 'next-img', false);
    initSlider('vid-slide-', 'prev-vid', 'next-vid', true);
});