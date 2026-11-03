const mobileLayout = window.matchMedia('(max-width: 1130px)');
const sidebar = document.querySelector('.sidebar');
const news = document.querySelector('.sidebar-news');
const olderNews = document.querySelector('.older-news');
const container = document.querySelector('.container');
const resources = document.querySelector('.resources-overlay');
const resourcesTrigger = document.querySelector('.resources-trigger');
const resourcesBack = document.querySelector('.resources-back');
const mainContent = document.querySelector('.main-content');
let profileScroll = 0;

function adaptLayout() {
  // Move the existing news section so reading and keyboard order follow the layout.
  (mobileLayout.matches ? container : sidebar).append(news);
  olderNews.open = !mobileLayout.matches;
}

adaptLayout();
mobileLayout.addEventListener('change', adaptLayout);

// "scroll ↓" next to the News heading, while the panel has more below
const newsPanel = document.querySelector('.news-panel');
const newsScroll = document.querySelector('.news-scroll');

function updateNewsHint() {
  const more = newsPanel.scrollHeight - newsPanel.clientHeight - newsPanel.scrollTop > 4;
  newsScroll.classList.toggle('visible', more);
}

newsPanel.addEventListener('scroll', updateNewsHint, { passive: true });
window.addEventListener('resize', updateNewsHint);
mobileLayout.addEventListener('change', updateNewsHint);
updateNewsHint();

resourcesTrigger.addEventListener('click', (event) => {
  event.preventDefault();
  if (!resources.hidden) return;
  profileScroll = window.scrollY;
  resources.hidden = false;
  mainContent.inert = true;
  resourcesTrigger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('resources-open');
  resourcesBack.focus({ preventScroll: true });
  if (mobileLayout.matches) resources.scrollIntoView({ block: 'start' });
});

function closeResources() {
  resources.hidden = true;
  mainContent.inert = false;
  resourcesTrigger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('resources-open');
  resourcesTrigger.focus({ preventScroll: true });
  window.scrollTo({ top: profileScroll, behavior: 'instant' });
}

resourcesBack.addEventListener('click', closeResources);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !resources.hidden) closeResources();
});
