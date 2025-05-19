class ContactForm {
    constructor(selector) {
      this.form = document.querySelector(selector);
      this.loading = this.form.querySelector(".loading");
      this.errorMsg = this.form.querySelector(".error-message");
      this.sentMsg = this.form.querySelector(".sent-message");
    }
  
    onInit() {
      this.form.addEventListener("submit", e => this.handleSubmit(e));
    }
  
    async handleSubmit(e) {
      e.preventDefault();
      this.loading.style.display = "block";
      this.errorMsg.style.display = "none";
      this.sentMsg.style.display = "none";
  
      const formData = {
        name: this.form.name.value.trim(),
        email: this.form.email.value.trim(),
        subject: this.form.subject.value.trim(),
        message: this.form.message.value.trim()
      };
  
      try {
        const response = await fetch("api/contact.php", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(formData)
        });
  
        const result = await response.json();
        this.loading.style.display = "none";
  
        if (response.ok && result.success) {
          this.sentMsg.style.display = "block";
          this.form.reset();
        } else {
          this.errorMsg.innerHTML = result.message || "Ocurrió un error inesperado.";
          this.errorMsg.style.display = "block";
        }
      } catch (error) {
        this.loading.style.display = "none";
        this.errorMsg.innerHTML = "Error de red o servidor no disponible.";
        this.errorMsg.style.display = "block";
        console.error("Error en la petición:", error);
      }
    }
  }
  
  class Services {
    constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);
    }
  
    async onInit() {
      try {
        const res = await fetch("api/get-services.php");
        const data = await res.json();
        this.render(data);
      } catch (error) {
        console.error("Error cargando servicios:", error);
      }
    }
  
    render(data) {
      this.container.innerHTML = data.map(service => `
        <div class="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up">
          <div class="icon flex-shrink-0"><i class="${service.icono}"></i></div>
          <div>
            <h4 class="title">
              <a href="service-details.html?id=${service.id}" class="stretched-link">${service.titulo}</a>
            </h4>
            <p class="description">${service.descripcion}</p>
          </div>
        </div>
      `).join('');
    }
  }
  
  class Portfolio {
    constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);
    }
  
    async onInit() {
      try {
        const res = await fetch("api/get-portfolio.php");
        const data = await res.json();
        this.render(data);
        this.lazyLoadImages();
      } catch (error) {
        console.error("Error cargando portfolio:", error);
      }
    }
  
    render(data) {
      this.container.innerHTML = data.map(item => `
        <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-${item.categoria}">
          <div class="portfolio-content h-100">
            <img data-src="assets/img/portfolio/${item.imagen}" class="img-fluid lazy" alt="${item.titulo}">
            <div class="portfolio-info">
              <h4>${item.titulo}</h4>
              <p>${item.descripcion}</p>
              <a href="assets/img/portfolio/${item.imagen}" class="glightbox preview-link" title="${item.titulo}" data-gallery="portfolio-gallery-${item.categoria}"><i class="bi bi-zoom-in"></i></a>
              <a href="portfolio-details.html?id=${item.id}" class="details-link"><i class="bi bi-link-45deg"></i></a>
            </div>
          </div>
        </div>
      `).join('');
    }
  
    lazyLoadImages() {
      const images = this.container.querySelectorAll('img.lazy');
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if(entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      }, {rootMargin: "0px 0px 50px 0px"});
      
      images.forEach(img => observer.observe(img));
    }
  }
  
  // Inicialización al cargar el DOM
  document.addEventListener("DOMContentLoaded", () => {
    const contactForm = new ContactForm(".php-email-form");
    const services = new Services("#services .row");
    const portfolio = new Portfolio(".isotope-container");
  
    contactForm.onInit();
    services.onInit();
    portfolio.onInit();
  });
  