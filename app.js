const CAT_MAP = {
  delivery: { label: '零食配送', icon: '🍜', tagClass: 'tag-delivery' },
  luggage:  { label: '行李快递', icon: '📦', tagClass: 'tag-luggage' },
  tutor:    { label: '校外家教', icon: '📚', tagClass: 'tag-tutor' },
  online:   { label: '线上兼职', icon: '💻', tagClass: 'tag-online' },
};

const SEED_DATA = [
  { id: 1, cat: 'delivery', title: '宿舍零食代购配送', pay: '5元/单', desc: '帮你从超市或便利店购买零食送到宿舍，接单快速，当天可达。', contact: 'wx: xiaomai2024', time: '10分钟前' },
  { id: 2, cat: 'luggage',  title: '期末行李打包寄存服务', pay: '30元起', desc: '提供行李整理、打包、快递代寄服务，假期前后均可预约，上门取件。', contact: 'wx: dabao_express', time: '1小时前' },
  { id: 3, cat: 'tutor',    title: '高中数学/物理家教', pay: '80元/小时', desc: '师范大学在读，有两年家教经验，擅长高中数学和物理，可上门辅导。', contact: '电话: 138xxxx6789', time: '2小时前' },
  { id: 4, cat: 'online',   title: '短视频脚本撰写', pay: '50-200元/篇', desc: '招募有创意的同学撰写短视频脚本，内容方向不限，按质付酬，长期合作。', contact: 'wx: vlogteam01', time: '3小时前' },
  { id: 5, cat: 'delivery', title: '奶茶外卖代购', pay: '3-8元/单', desc: '校内奶茶代购，限学校周边500米内，单笔起送10元以上，随叫随到。', contact: 'wx: naicha_run', time: '5小时前' },
  { id: 6, cat: 'online',   title: '电商客服（在家可做）', pay: '2500元/月', desc: '某电商平台客服岗位，工作时间灵活，手机即可操作，有空就能做，长期岗位。', contact: 'wx: hr_ecom2024', time: '昨天' },
  { id: 7, cat: 'tutor',    title: '小学英语/语文辅导', pay: '60元/小时', desc: '英语专业大三在读，CET-6高分，有耐心，可辅导小学1-6年级英语、语文。', contact: '电话: 139xxxx0011', time: '昨天' },
  { id: 8, cat: 'luggage',  title: '开学行李搬运托运', pay: '面议', desc: '帮助新生或老生搬运行李、托运大件物品，有车，价格合理，欢迎咨询。', contact: 'wx: move_helper', time: '2天前' },
];

function getJobs() {
  const stored = localStorage.getItem('xj_jobs');
  return stored ? JSON.parse(stored) : [...SEED_DATA];
}

function saveJobs(jobs) {
  localStorage.setItem('xj_jobs', JSON.stringify(jobs));
}

function getMyIds() {
  const stored = localStorage.getItem('xj_my_ids');
  return stored ? JSON.parse(stored) : [];
}

function saveMyId(id) {
  const ids = getMyIds();
  ids.unshift(id);
  localStorage.setItem('xj_my_ids', JSON.stringify(ids));
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  return Math.floor(diff / 86400000) + '天前';
}

function buildCard(job) {
  const cat = CAT_MAP[job.cat];
  const time = job.ts ? timeAgo(job.ts) : job.time;
  const card = document.createElement('div');
  card.className = 'job-card';
  card.innerHTML = `
    <div class="job-card-top">
      <span class="job-title">${job.title}</span>
      <span class="job-pay">${job.pay}</span>
    </div>
    <p class="job-desc">${job.desc}</p>
    <div class="job-footer">
      <span class="job-tag ${cat.tagClass}">${cat.icon} ${cat.label}</span>
      <span class="job-time">${time}</span>
    </div>
  `;
  card.addEventListener('click', () => openModal(job));
  return card;
}

function renderList(container, jobs) {
  container.innerHTML = '';
  if (!jobs.length) {
    container.innerHTML = '<p class="empty-tip">暂无相关兼职信息</p>';
    return;
  }
  jobs.forEach(job => container.appendChild(buildCard(job)));
}

function openModal(job) {
  const cat = CAT_MAP[job.cat];
  document.getElementById('modalContent').innerHTML = `
    <span class="modal-cat-tag ${cat.tagClass}">${cat.icon} ${cat.label}</span>
    <p class="modal-title">${job.title}</p>
    <p class="modal-pay">${job.pay}</p>
    <p class="modal-desc-label">详情描述</p>
    <p class="modal-desc">${job.desc}</p>
    <div class="modal-contact-box">
      <span>📱</span>
      <div class="modal-contact-info">
        <p>联系方式</p>
        <p>${job.contact}</p>
      </div>
    </div>
  `;
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

// Navigation
let currentPage = 'home';
function switchPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`.tab[data-page="${page}"]`).classList.add('active');
  currentPage = page;
  if (page === 'browse') refreshBrowse();
  if (page === 'mine') refreshMine();
}

let currentFilter = 'all';
function refreshBrowse() {
  const jobs = getJobs();
  const filtered = currentFilter === 'all' ? jobs : jobs.filter(j => j.cat === currentFilter);
  renderList(document.getElementById('browseList'), filtered);
}

function refreshMine() {
  const myIds = getMyIds();
  const jobs = getJobs();
  const myJobs = jobs.filter(j => myIds.includes(j.id));
  const container = document.getElementById('myList');
  if (!myJobs.length) {
    container.innerHTML = '<p class="empty-tip">你还没有发布过兼职</p>';
  } else {
    renderList(container, myJobs);
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Home latest
  const jobs = getJobs();
  renderList(document.getElementById('homeLatest'), jobs.slice(0, 4));

  // Tab navigation
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchPage(tab.dataset.page));
  });

  // Category cards → browse with filter
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      currentFilter = card.dataset.cat;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`.filter-btn[data-filter="${currentFilter}"]`).classList.add('active');
      switchPage('browse');
    });
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      refreshBrowse();
    });
  });

  // Post form
  document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const cat = document.querySelector('input[name="cat"]:checked')?.value;
    if (!cat) { showToast('请选择分类'); return; }
    const jobs = getJobs();
    const newJob = {
      id: Date.now(),
      cat,
      title: document.getElementById('postTitle').value.trim(),
      pay: document.getElementById('postPay').value.trim(),
      desc: document.getElementById('postDesc').value.trim(),
      contact: document.getElementById('postContact').value.trim(),
      ts: Date.now(),
    };
    jobs.unshift(newJob);
    saveJobs(jobs);
    saveMyId(newJob.id);
    e.target.reset();
    showToast('✅ 发布成功！');
    setTimeout(() => switchPage('browse'), 1000);
  });

  // Modal close
  document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.add('hidden');
  });
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) {
      document.getElementById('modalOverlay').classList.add('hidden');
    }
  });

  // Search
  document.getElementById('searchBtn').addEventListener('click', () => {
    document.getElementById('searchBar').classList.remove('hidden');
    document.getElementById('searchInput').focus();
  });
  document.getElementById('searchClose').addEventListener('click', () => {
    document.getElementById('searchBar').classList.add('hidden');
    document.getElementById('searchInput').value = '';
    if (currentPage === 'browse') refreshBrowse();
  });
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) { refreshBrowse(); return; }
    switchPage('browse');
    const jobs = getJobs();
    const results = jobs.filter(j => j.title.includes(q) || j.desc.includes(q));
    renderList(document.getElementById('browseList'), results);
  });
});
