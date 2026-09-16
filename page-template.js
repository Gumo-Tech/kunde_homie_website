(function () {
  const pageId = document.body.dataset.page;
  const root = document.body.dataset.root || "";
  const page = window.HOMIE_PAGES && window.HOMIE_PAGES[pageId];

  if (!page) {
    document.body.innerHTML = "<main class=\"section\"><div class=\"container\"><h1>Page not found</h1></div></main>";
    return;
  }

  document.documentElement.lang = page.lang || "da";
  document.title = `${page.title} - Homie`;
  const description = document.querySelector("meta[name='description']");
  if (description) description.setAttribute("content", page.description || "");

  const daLinks = [
    ["Forside", root + "index.html"],
    ["Ydelser", root + "istandsaettelse-ved-fraflytning/"],
    ["Sildeben", root + "sildeben/"],
    ["Om os", root + "om-os/"],
    ["Booking", root + "booking-widget.html"],
    ["Kontakt", root + "kontakt/"]
  ];
  const enLinks = [
    ["Home", root + "en/"],
    ["Services", root + "en/refurbishment/"],
    ["About us", root + "en/about-us/"],
    ["Booking", root + "booking-widget.html"],
    ["Contact", root + "en/contact/"]
  ];
  const navLinks = page.lang === "en" ? enLinks : daLinks;
  const phone = page.lang === "en" ? "30 30 00 22" : "70 40 42 56";
  const tel = page.lang === "en" ? "+4530300022" : "+4570404256";

  const services = page.lang === "en"
    ? [
        ["Refurbishment", root + "en/refurbishment/"],
        ["Painting Service", root + "en/painting-service/"],
        ["Floor Service", root + "en/floor-service/"],
        ["FAQ", root + "en/frequently-asked-questions/"]
      ]
    : [
        ["Istandsættelse ved fraflytning", root + "istandsaettelse-ved-fraflytning/"],
        ["Malerservice", root + "malerservice/"],
        ["Gulvservice", root + "gulvservice/"],
        ["Renovering Erhverv", root + "renovering-erhverv/"],
        ["Nordisk Sildeben", root + "sildeben/"],
        ["FAQ", root + "faq/"]
      ];

  // Contact/booking now goes through the real booking system (kontakt/ and
  // en/contact/ are both hand-built pages, not rendered via this template),
  // never a form that posts to a disconnected third-party CRM.
  const sectionMarkup = page.sections.map((section) => `
    <section class="copy-section">
      <h2>${section.heading}</h2>
      ${section.body.map((text) => `<p>${text}</p>`).join("")}
    </section>
  `).join("");

  document.body.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a href="${root}index.html" class="logo">
          <img src="https://homie.nu/wp-content/uploads/2023/10/Logo_nyt-1-300x75-1.webp" alt="Homie Håndværkerservice">
        </a>
        <nav class="main-nav">
          ${navLinks.map(([label, href]) => `<a href="${href}" class="nav-link">${label}</a>`).join("")}
        </nav>
        <div class="header-right">
          <div class="lang-toggle">
            <a class="lang-flag ${page.lang === "en" ? "active" : ""}" href="${root}en/" aria-label="English"><img src="${root}assets/en-flag.png" alt=""><span>EN</span></a>
            <a class="lang-flag ${page.lang === "da" ? "active" : ""}" href="${root}index.html" aria-label="Dansk"><img src="${root}assets/dk-flag.png" alt=""><span>DA</span></a>
          </div>
          <a href="tel:${tel}" class="nav-phone-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.07 5.37 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L9 10.67a16 16 0 0 0 4.33 4.33l1.24-1.24a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92z"/></svg>
            ${phone}
          </a>
        </div>
      </div>
    </header>
    <main>
      <section class="page-banner content-hero">
        <div class="page-banner-glow"></div>
        <div class="container">
          <div class="section-tag">${page.hero.kicker}</div>
          <h1>${page.hero.heading}</h1>
          <p>${page.hero.text}</p>
          <div class="content-hero-actions">
            <a href="${root}${page.lang === "en" ? "en/contact/" : "kontakt/"}" class="btn btn-white btn-lg">${page.lang === "en" ? "Get a free quote" : "Få et gratis tilbud"}</a>
            <a href="tel:${tel}" class="btn btn-ghost btn-lg"><svg class="btn-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.07 5.37 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L9 10.67a16 16 0 0 0 4.33 4.33l1.24-1.24a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92z"/></svg>${phone}</a>
          </div>
        </div>
      </section>
      <section class="section content-page">
        <div class="container content-layout">
          <article class="content-main">${sectionMarkup}</article>
          <aside class="content-sidebar">
            <h3>${page.lang === "en" ? "Services" : "Ydelser"}</h3>
            ${services.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
          </aside>
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <div class="container footer-bottom">
        <div>© 2024 Homie Håndværkerservice ApS &nbsp;·&nbsp; CVR: 41208546</div>
        <div class="footer-bottom-links">
          <a href="${root}${page.lang === "en" ? "en/contact/" : "kontakt/"}">${page.lang === "en" ? "Contact" : "Kontakt"}</a>
          <a href="${root}privatlivspolitik/">${page.lang === "en" ? "Privacy Policy" : "Privatlivspolitik"}</a>
          <a href="${root}sitemap.xml">Sitemap</a>
        </div>
      </div>
    </footer>
  `;
})();
