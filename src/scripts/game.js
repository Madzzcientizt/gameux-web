/**
 * Shared Game Page Functionality
 * Includes: Section navigation, Game info nav arrows, and Back-to-top button
 */

document.addEventListener("DOMContentLoaded", () => {
    // Shared Elements
    const gameInfoNav = document.getElementById("game-info-nav");
    const gameInfoNavLeft = document.getElementById("game-info-nav-left");
    const gameInfoNavRight = document.getElementById("game-info-nav-right");
    const backToTopButton = document.getElementById("back-to-top");
    const backToTopProgress = document.getElementById("back-to-top-progress");
    const sectionRadios = Array.from(document.querySelectorAll('input[name="game-section"]'));
    const gameSections = Array.from(document.querySelectorAll(".game-sections"));

    // --- Sections Navigation ---
    function showGameSection(sectionId) {
        gameSections.forEach((section) => {
            const isActive = section.id === sectionId;
            section.classList.toggle("is-active", isActive);
            section.setAttribute("aria-hidden", String(!isActive));
        });
    }

    function getSectionIdFromHash() {
        const rawHash = window.location.hash || "";
        const hash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
        if (!hash) return null;
        return gameSections.some((section) => section.id === hash) ? hash : null;
    }

    function syncSectionFromHash() {
        const hashSectionId = getSectionIdFromHash();
        if (!hashSectionId) return false;

        const matchingRadio = sectionRadios.find((radio) => radio.value === hashSectionId);
        if (matchingRadio) matchingRadio.checked = true;
        showGameSection(hashSectionId);
        return true;
    }

    // Initialize Sections
    if (sectionRadios.length > 0) {
        const defaultSection = document.querySelector('input[name="game-section"]:checked');
        if (!syncSectionFromHash()) {
            showGameSection(defaultSection ? defaultSection.value : "short-description");
        }

        sectionRadios.forEach((radio) => {
            radio.addEventListener("change", () => {
                if (!radio.checked) return;
                showGameSection(radio.value);
                if (history.replaceState) {
                    history.replaceState(null, "", `#${radio.value}`);
                } else {
                    window.location.hash = radio.value;
                }
            });
        });

        window.addEventListener("hashchange", syncSectionFromHash);
    }

    // --- Game Info Nav Arrows ---
    function updateGameInfoNavArrows() {
        if (!gameInfoNav || !gameInfoNavLeft || !gameInfoNavRight) return;

        const maxScrollLeft = gameInfoNav.scrollWidth - gameInfoNav.clientWidth;
        const canScroll = maxScrollLeft > 1;
        const canScrollLeft = canScroll && gameInfoNav.scrollLeft > 1;
        const canScrollRight = canScroll && gameInfoNav.scrollLeft < maxScrollLeft - 1;

        gameInfoNavLeft.hidden = !canScrollLeft;
        gameInfoNavRight.hidden = !canScrollRight;
    }

    function scrollGameInfoNavBy(distance) {
        if (!gameInfoNav) return;
        gameInfoNav.scrollBy({ left: distance, behavior: "smooth" });
    }

    if (gameInfoNav && gameInfoNavLeft && gameInfoNavRight) {
        gameInfoNav.addEventListener("scroll", updateGameInfoNavArrows);
        gameInfoNavLeft.addEventListener("click", () => {
            scrollGameInfoNavBy(-Math.max(200, Math.floor(gameInfoNav.clientWidth * 0.5)));
        });
        gameInfoNavRight.addEventListener("click", () => {
            scrollGameInfoNavBy(Math.max(200, Math.floor(gameInfoNav.clientWidth * 0.5)));
        });
        window.addEventListener("resize", updateGameInfoNavArrows);
        updateGameInfoNavArrows();
    }

    // --- Back-to-Top Button ---
    const progressRadius = 22;
    const progressCircumference = 2 * Math.PI * progressRadius;

    if (backToTopProgress) {
        backToTopProgress.style.strokeDasharray = String(progressCircumference);
        backToTopProgress.style.strokeDashoffset = String(progressCircumference);
    }

    function updateBackToTop() {
        if (!backToTopButton || !backToTopProgress) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? Math.min(scrollTop / scrollableHeight, 1) : 0;
        const dashOffset = progressCircumference * (1 - progress);

        backToTopProgress.style.strokeDashoffset = String(dashOffset);
        backToTopButton.classList.toggle("is-visible", scrollTop > 160);
    }

    if (backToTopButton) {
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    window.addEventListener("resize", updateBackToTop);
    updateBackToTop();
});
