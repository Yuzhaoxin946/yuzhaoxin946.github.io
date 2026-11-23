const topics = {
  all: ['All', '全部'],
  sci: ['Scientific Reasoning', '科学推理'],
  ttr: ['Test-Time Reasoning', 'Test-Time 推理'],
  psy: ['Computational Psychology', '计算心理学'],
  other: ['Other', '其他']
};
const papers = [];
const filters = document.querySelector('.filter-row');
const selects = [...document.querySelectorAll('.mobile-filter select')];
const list = document.getElementById('paper-list');
let activeTopic = 'all';

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const navToggle = document.querySelector('.nav-toggle');
const sectionLinks = document.getElementById('section-links');

function closeNavigation() {
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
});

sectionLinks.addEventListener('click', closeNavigation);
document.addEventListener('click', event => {
  if (!navToggle.contains(event.target) && !sectionLinks.contains(event.target)) closeNavigation();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    closeNavigation();
    navToggle.focus();
  }
});
document.addEventListener('focusin', event => {
  if (event.target !== navToggle && !sectionLinks.contains(event.target)) closeNavigation();
});
window.matchMedia('(max-width:600px)').addEventListener('change', closeNavigation);

for (const button of document.querySelectorAll('.lang-btn')) {
  button.addEventListener('click', () => {
    const lang = button.id.replace('btn-', '');
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    for (const item of document.querySelectorAll('.lang-btn')) {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    }
  });
}

function selectTopic(topic) {
  activeTopic = topic;
  for (const button of filters.children) {
    const active = button.dataset.topic === topic;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  for (const select of selects) select.value = topic;
  for (const article of list.children) {
    article.classList.toggle('hidden', topic !== 'all' && article.dataset.topic !== topic);
  }
}

function buildFilters() {
  for (const [key, labels] of Object.entries(topics)) {
    const count = papers.filter(p => key === 'all' || p.topic === key).length;
    const button = element('button', 'filter-btn');
    button.dataset.topic = key;
    for (const [i, lang] of ['en', 'zh'].entries()) {
      const text = labels[i] + ' (' + count + ')';
      button.append(element('span', lang, text));
      document.querySelector('.mobile-filter .' + lang + ' select').add(new Option(text, key));
    }
    button.addEventListener('click', () => selectTopic(key));
    filters.append(button);
  }
  for (const select of selects) select.addEventListener('change', () => selectTopic(select.value));
  selectTopic(activeTopic);
}

// Each publication file supplies its own metadata and image path.
function addPublication(paper) {
  const source = document.currentScript.src;
  const folder = new URL('.', source).pathname.split('/').filter(Boolean).pop();
  const article = element('article', 'pub');
  article.dataset.topic = paper.topic;
  const link = element('a', 'paper-link', paper.title);
  link.href = paper.url;
  link.target = '_blank';
  link.rel = 'noopener';
  const content = element('div', 'paper-text');
  const title = element('h3', 'pub-title');
  title.id = 'paper-' + folder;
  title.append(link);
  const authors = element('div', 'pub-authors');
  paper.authors.forEach((name, i) => {
    if (i) authors.append(', ');
    authors.append(name === 'Zhaoxin Yu' ? element('strong', '', name) : name);
    if (paper.equalFirstAuthors?.includes(name)) authors.append(element('sup', '', '*'));
  });
  const summary = element('p', 'tldr');
  summary.append(element('b', '', 'TL;DR'), element('span', 'en', paper.tldr.en),
    element('span', 'zh', paper.tldr.zh));
  content.append(title, authors, element('div', 'pub-venue', paper.venue), summary);
  const figure = element('img', 'paper-figure');
  figure.alt = '';
  figure.decoding = 'async';
  figure.src = new URL(paper.figure, source).href;
  article.append(content, figure);
  list.append(article);
  papers.push(paper);
}

// Classic scripts also work when the page is opened directly from disk.
const publicationLoads = publicationFolders.map(folder => new Promise(resolve => {
  const script = document.createElement('script');
  script.async = false;
  script.src = 'assets/publications/' + encodeURIComponent(folder) + '/paper.js';
  script.onload = resolve;
  script.onerror = () => {
    console.error('Unable to load publication:', folder);
    resolve();
  };
  document.head.append(script);
}));
Promise.all(publicationLoads).then(buildFilters);
