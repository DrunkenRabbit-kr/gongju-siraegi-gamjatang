const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.main-nav a');

menuToggle?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('nav-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const backgroundSlides = document.querySelectorAll('.background-slide');

if (backgroundSlides.length > 1) {
  let activeSlide = 0;
  window.setInterval(() => {
    backgroundSlides[activeSlide].classList.remove('is-active');
    activeSlide = (activeSlide + 1) % backgroundSlides.length;
    backgroundSlides[activeSlide].classList.add('is-active');
  }, 6500);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const form = document.querySelector('#inquiry-form');
const status = document.querySelector('#form-status');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  const endpoint = form.dataset.formEndpoint?.trim();

  status.textContent = '상담 신청을 확인하고 있습니다…';
  status.style.color = '#bd3f28';

  if (!endpoint) {
    localStorage.setItem('gongjuSiraegiInquiryDraft', JSON.stringify({ ...payload, savedAt: new Date().toISOString() }));
    status.textContent = '현재는 신청자 브라우저에만 임시 저장됩니다. 관리자 확인용 전송 주소를 연결해야 실제 접수가 가능합니다.';
    form.reset();
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });
    if (!response.ok) throw new Error('request failed');
    status.textContent = '신청이 접수되었습니다. 확인 후 연락드리겠습니다.';
    form.reset();
  } catch (error) {
    status.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    status.style.color = '#8c1e12';
  }
});
