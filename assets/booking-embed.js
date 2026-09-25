// The booking (homie-booking) runs in an iframe. It reports its own height, and
// this sets the iframe to exactly that — so the booking reads as part of the
// page, with no scroll area inside it.
(function () {
  var ORIGIN = 'https://homie-booking.gustavboye1994.workers.dev';
  window.addEventListener('message', function (e) {
    if (e.origin !== ORIGIN || !e.data || e.data.type !== 'homie-booking:height') return;
    var h = Math.max(320, Math.min(6000, Number(e.data.height) || 0));
    document.querySelectorAll('iframe[src^="' + ORIGIN + '"]').forEach(function (f) {
      if (f.contentWindow === e.source) { f.style.height = h + 'px'; f.setAttribute('scrolling', 'no'); }
    });
  });
})();
