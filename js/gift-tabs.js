// Without JS both panels stay readable; activate ARIA tabs only with working handlers.
export function setupGiftTabs(root) {
  const tablist = root.querySelector('[role="tablist"]');
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map(tab => root.querySelector(`#${tab.getAttribute('aria-controls')}`));

  function select(index, focus = false) {
    tabs.forEach((tab, current) => {
      const active = current === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[current].hidden = !active;
    });
    if (focus) tabs[index].focus({ preventScroll: true });
  }

  tabs.forEach((tab, index) => {
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next, true);
    });
  });
  select(0);
  tablist.hidden = false;
}
