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

  const crmForm = `
    <section class="contact-form-card sitemap-contact-form">
      <h3>${page.lang === "en" ? "Get a free quote" : "Få et gratis, uforpligtende tilbud"}</h3>
      <p>${page.lang === "en" ? "Fill in the form and we will get back to you as soon as possible." : "Udfyld formularen nedenfor, og vi vender tilbage hurtigst muligt."}</p>
      <form id="SimplyWebForm" class="SimplyWebForm" name="Hjemmesideformular" action="https://homiehandvaerkerservice80.simply-crm.dk/modules/Webforms/capture.php" method="post" accept-charset="utf-8" enctype="multipart/form-data">
        <input type="hidden" name="publicid" value="bb26e8ff3252b680d4f4c244fe4d9bf6">
        <input type="hidden" name="urlencodeenable" value="1">
        <input type="hidden" name="name" value="Hjemmesideformular">
        <input type="hidden" name="potentialname" value="Nyt lead" required>
        <input type="hidden" name="closingdate" value="2025-06-25" required>
        <select name="sales_stage" data-label="sales_stage" required hidden>
          <option value="">Vælg værdi</option>
          <option value="Booking" selected>Booking</option>
          <option value="Gennemgang">Gennemgang</option>
          <option value="Online gennemgang">Online gennemgang</option>
          <option value="Tilbud sendt/Opfølgning">Tilbud sendt/Opfølgning</option>
          <option value="Accepteret tilbud">Accepteret tilbud</option>
          <option value="Planlagt opgave">Planlagt opgave</option>
          <option value="Syn gennemført">Syn gennemført</option>
          <option value="Fakturering gennemført">Fakturering gennemført</option>
        </select>
        <div class="form-grid">
          <div class="form-group">
            <label for="cf_fulde_navn_page">${page.lang === "en" ? "Full name" : "Fulde navn"}</label>
            <input type="text" id="cf_fulde_navn_page" name="cf_fulde_navn">
          </div>
          <div class="form-group">
            <label for="cf_telefonnummer_page">${page.lang === "en" ? "Phone number" : "Telefonnummer"}</label>
            <input type="text" id="cf_telefonnummer_page" name="cf_telefonnummer">
          </div>
          <div class="form-group">
            <label for="cf_email_page">E-mail</label>
            <input type="email" id="cf_email_page" name="cf_email">
          </div>
          <div class="form-group">
            <label for="cf_fraflytningsdato_page">${page.lang === "en" ? "Move-out date, if relevant" : "Fraflytningsdato, såfremt relevant"}</label>
            <input type="date" id="cf_fraflytningsdato_page" name="cf_fraflytningsdato">
          </div>
          <div class="form-group">
            <label for="cf_adresse_page">${page.lang === "en" ? "Address, including floor if relevant" : "Adresse (inkl. etage, hvis relevant)"}</label>
            <input type="text" id="cf_adresse_page" name="cf_adresse">
          </div>
          <div class="form-group">
            <label for="cf_postnummer_page">${page.lang === "en" ? "Postal code" : "Postnummer"}</label>
            <input type="number" id="cf_postnummer_page" name="cf_postnummer">
          </div>
          <div class="form-group full">
            <label for="description_page">${page.lang === "en" ? "Message" : "Skriv din besked"}</label>
            <textarea id="description_page" name="description"></textarea>
          </div>
          <div class="form-group full">
            <select name="leadsource" data-label="leadsource" hidden>
              <option value="">Vælg værdi</option>
              <option value="Web Site" selected>Hjemmeside</option>
            </select>
            <input type="submit" value="${page.lang === "en" ? "Submit" : "Send forespørgsel"}">
          </div>
        </div>
      </form>
    </section>
  `;
  const contactMarkup = pageId === "kontakt" || pageId === "en/contact" ? crmForm : "";
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
          <article class="content-main">${contactMarkup}${sectionMarkup}</article>
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
