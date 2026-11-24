const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
const nav = document.querySelector<HTMLElement>("[data-nav]");

if (toggle && nav) {
  const media = window.matchMedia("(max-width: 900px)");

  const setOpen = (open: boolean) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) nav.querySelector<HTMLElement>("a")?.focus();
  };

  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    setOpen(open);
    if (!open) toggle.focus();
  });

  nav.addEventListener("click", (event) => {
    if ((event.target as Element | null)?.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (!media.matches || !nav.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
      return;
    }
    if (event.key !== "Tab") return;
    const items = [toggle, ...nav.querySelectorAll<HTMLElement>("a")];
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  media.addEventListener("change", () => {
    if (!media.matches) setOpen(false);
  });
}
