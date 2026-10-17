const header = document.querySelector('[data-header]');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const screens = {
  main: {
    number: '01 / ГЛАВНАЯ',
    title: 'Что требует решения сейчас?',
    text: 'Свободный остаток, распределения, счета, капитал, цели и инвестиции сходятся в одном месте. Не отчёт ради отчёта — точка принятия решения.',
    bullets: ['Свободные и уже распределённые деньги', 'Капитал и динамика месяца', 'Быстрый переход к действию'],
    image: 'https://cdn.jsdelivr.net/gh/kapital-app/leto@8270db31d19010daa2c7b7c64ad58c4fb484d120/assets/landing-v13-hires/main.webp',
    alt: 'Экран Главная приложения Капитал',
  },
  money: {
    number: '02 / ДЕНЬГИ',
    title: 'Что произошло за месяц?',
    text: 'План, факт и анализ доходов и расходов. Видишь результат месяца без превращения жизни в ежедневный учёт каждого чека.',
    bullets: ['План и факт отдельно', 'Доходы, расходы и остаток', 'Финансовая логика по месяцам'],
    image: 'https://cdn.jsdelivr.net/gh/kapital-app/leto@8270db31d19010daa2c7b7c64ad58c4fb484d120/assets/landing-v13-hires/money.webp',
    alt: 'Экран Деньги приложения Капитал',
  },
  accounts: {
    number: '03 / СЧЕТА',
    title: 'Где реально лежат деньги?',
    text: 'Наличные, карты и валюты сводятся в одну картину. Видно не только общую сумму, но и структуру денег по местам хранения.',
    bullets: ['Несколько счетов и валют', 'Остатки и переводы', 'История месячных снимков'],
    image: 'https://cdn.jsdelivr.net/gh/kapital-app/leto@8270db31d19010daa2c7b7c64ad58c4fb484d120/assets/landing-v13-hires/accounts.webp',
    alt: 'Экран Счета приложения Капитал',
  },
  balance: {
    number: '04 / БАЛАНС',
    title: 'Сколько у тебя есть после долгов?',
    text: 'Деньги, активы и обязательства складываются в чистый капитал. Здесь видно, растёт финансовое состояние или просто перемещаются деньги.',
    bullets: ['Активы и обязательства', 'Чистый капитал', 'Историческая динамика'],
    image: 'https://cdn.jsdelivr.net/gh/kapital-app/leto@8270db31d19010daa2c7b7c64ad58c4fb484d120/assets/landing-v13-hires/balance.webp',
    alt: 'Экран Баланс приложения Капитал',
  },
  more: {
    number: '05 / ЕЩЁ',
    title: 'И это только основа.',
    text: 'Цели, аналитика, инвестиции, категории, валюты, безопасность, экспорт и другие инструменты остаются внутри одной финансовой системы.',
    bullets: ['Цели и распределения', 'Инвестиции и аналитика', 'Категории, валюты и данные'],
    image: 'https://cdn.jsdelivr.net/gh/kapital-app/leto@8270db31d19010daa2c7b7c64ad58c4fb484d120/assets/landing-v13-hires/more.webp',
    alt: 'Экран Ещё приложения Капитал',
  },
};

const product = document.querySelector('[data-product]');
if (product) {
  const copy = product.querySelector('[data-product-copy]');
  const image = product.querySelector('[data-product-image]');
  product.querySelectorAll('[data-screen]').forEach((button) => {
    button.addEventListener('click', () => {
      const screen = screens[button.dataset.screen];
      if (!screen || !copy || !image) return;
      product.querySelectorAll('[data-screen]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      copy.innerHTML = `<span class="screen-number">${screen.number}</span><h3>${screen.title}</h3><p>${screen.text}</p><ul>${screen.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}</ul>`;
      image.src = screen.image;
      image.alt = screen.alt;
    });
  });
}
