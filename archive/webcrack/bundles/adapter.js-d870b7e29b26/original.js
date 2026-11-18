/*
 * Compatibility bridge, not a visual recreation. The original SystemYA DOM,
 * imagery and CSS remain untouched. A 2023 URL/search form can launch the
 * modern Scramjet/Wisp engine in the separate /browser route.
 */
(() => {
  const destination = (value) => `/browser/#url=${encodeURIComponent(value.trim())}`;
  function looksLikeAddressField(input) {
    const label = [input.name, input.id, input.placeholder, input.getAttribute('aria-label')]
      .filter(Boolean).join(' ').toLowerCase();
    return /url|link|search|address|website|browse|proxy/.test(label);
  }
  document.addEventListener('submit', (event) => {
    if (!(event.target instanceof HTMLFormElement)) return;
    const form = event.target;
    const candidates = [...form.querySelectorAll('input:not([type=hidden])')]
      .filter((i) => i instanceof HTMLInputElement && /^(text|url|search|)$/.test(i.type));
    const chosen = candidates.find(looksLikeAddressField) || (candidates.length === 1 ? candidates[0] : null);
    if (!chosen?.value?.trim()) return;
    event.preventDefault();
    window.location.assign(destination(chosen.value));
  }, true);
})();
