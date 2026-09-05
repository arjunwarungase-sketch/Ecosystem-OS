// OPEN WINDOWS
const dockItems = document.querySelectorAll(".dock-item");
const closeButtons = document.querySelectorAll("[data-close-window]");
const minimizeButtons = document.querySelectorAll("[data-minimize-window]");

dockItems.forEach((item) => {
    item.addEventListener("click", () => {
        const windowId = item.dataset.window;
        const window = document.getElementById(windowId);

        window.hidden = false;
        item.classList.add("active");
        item.setAttribute("aria-pressed", "true");
    });
});


// CLOSE WINDOWS
closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const window = button.closest(".app-window");

        window.hidden = true;
    });
});


// MINIMIZE WINDOWS
minimizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const window = button.closest(".app-window");

        window.hidden = true;
    });
});