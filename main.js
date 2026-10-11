
import { learnData } from './learnData.js';
import { quizData } from './quizData.js';
import { StatsManager } from './statsManager.js';
import { AuthManager } from './authManager.js';
import { SettingsManager } from './settingsManager.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- Global Offline Handling ---
  const offlineBanner = document.getElementById('offlineBanner');
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      offlineBanner.style.display = 'none';
    } else {
      offlineBanner.style.display = 'block';
    }
  };
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // --- Authentication Flow ---
  const authContainer = document.getElementById('authContainer');
  const mainAppContainer = document.getElementById('mainAppContainer');
  
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegisterBtn = document.getElementById('showRegisterBtn');
  const showLoginBtn = document.getElementById('showLoginBtn');
  const loginError = document.getElementById('loginError');
  const regError = document.getElementById('regError');

  showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginError.innerText = '';
  });
  
  showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    regError.innerText = '';
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const btn = loginForm.querySelector('button');
    
    if (!email || !password) {
      loginError.innerText = 'Please enter both email and password.';
      return;
    }

    try {
      btn.disabled = true;
      btn.innerText = 'Logging in...';
      const user = await AuthManager.login(email, password);
      loginError.innerText = '';
      initApp(user);
    } catch (err) {
      loginError.innerText = err.message;
    } finally {
      btn.disabled = false;
      btn.innerText = 'Login';
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const btn = document.getElementById('regSubmitBtn');

    if (!name || !email || !password) {
      regError.innerText = 'All fields are required.';
      return;
    }

    if (password.length < 6) {
      regError.innerText = 'Password must be at least 6 characters.';
      return;
    }

    try {
      btn.disabled = true;
      btn.innerText = 'Signing up...';
      const user = await AuthManager.register(name, email, password);
      regError.innerText = '';
      initApp(user);
    } catch (err) {
      regError.innerText = err.message;
    } finally {
      btn.disabled = false;
      btn.innerText = 'Sign Up';
    }
  });



  // --- Main App Initialization ---
  let hwHistoryKey = 'HW_HISTORY';
  let quizHistoryKey = 'QUIZ_HISTORY';

  function initApp(user) {
    authContainer.classList.add('hidden');
    mainAppContainer.style.display = 'flex';

    StatsManager.init(user.id);
    SettingsManager.init(user.id);
    
    hwHistoryKey = `${user.id}_HW_HISTORY`;
    quizHistoryKey = `${user.id}_QUIZ_HISTORY`;

    const settings = SettingsManager.getSettings();
    SettingsManager.applySettings(settings);

    document.getElementById('welcomeTitle').innerText = `Good evening, ${user.name.split(' ')[0]} ✨`;
    const dashAvatar = document.getElementById('dashAvatar');
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&backgroundColor=b6e3f4`;
    if (dashAvatar) dashAvatar.src = avatarUrl;
    
    initSettingsUI(user, settings, avatarUrl);

    renderDashboardProgress();
    renderHistory();
    updateQuizHistoryWidget();
  }

  // --- Navigation ---
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.page-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add('active');
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    });
  });

  const fab = document.querySelector('.fab');
  if (fab) {
    fab.addEventListener('click', () => {
      fab.style.transform = 'scale(0.9)';
      setTimeout(() => fab.style.transform = 'scale(1)', 150);
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([50, 50, 50]);
    });
  }

  // --- Settings UI Initialization ---
  function initSettingsUI(user, settings, avatarUrl) {
    document.getElementById('settingsAvatar').src = avatarUrl;
    document.getElementById('settingsNameDisplay').innerText = user.name;
    document.getElementById('settingsEmailDisplay').innerText = user.email;
    
    document.getElementById('settingsName').value = user.name;
    document.getElementById('settingsEmail').value = user.email;
    document.getElementById('appearanceSelect').value = settings.appearance;
    document.getElementById('languageSelect').value = settings.language;
    document.getElementById('notificationsToggle').checked = settings.notifications;

    const updateProfileForm = document.getElementById('updateProfileForm');
    const updateProfileStatus = document.getElementById('updateProfileStatus');
    updateProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('settingsName').value.trim();
      const newEmail = document.getElementById('settingsEmail').value.trim();
      if(!newName || !newEmail) return;
      try {
        const updatedUser = await AuthManager.updateUser(newName, newEmail);
        updateProfileStatus.innerText = "Profile updated successfully.";
        updateProfileStatus.style.color = "#10b981";
        document.getElementById('welcomeTitle').innerText = `Good evening, ${updatedUser.name.split(' ')[0]} ✨`;
        document.getElementById('settingsNameDisplay').innerText = updatedUser.name;
        document.getElementById('settingsEmailDisplay').innerText = updatedUser.email;
        const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${updatedUser.email}&backgroundColor=b6e3f4`;
        document.getElementById('dashAvatar').src = newAvatarUrl;
        document.getElementById('settingsAvatar').src = newAvatarUrl;
      } catch (err) {
        updateProfileStatus.innerText = err.message;
        updateProfileStatus.style.color = "#ef4444";
      }
      setTimeout(() => updateProfileStatus.innerText = '', 3000);
    });

    const savePrefs = () => {
      const newSettings = {
        appearance: document.getElementById('appearanceSelect').value,
        language: document.getElementById('languageSelect').value,
        notifications: document.getElementById('notificationsToggle').checked
      };
      SettingsManager.saveSettings(newSettings);
    };
    document.getElementById('appearanceSelect').addEventListener('change', savePrefs);
    document.getElementById('languageSelect').addEventListener('change', savePrefs);
    document.getElementById('notificationsToggle').addEventListener('change', savePrefs);

    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to delete all saved scans and quizzes? This cannot be undone.")) {
        localStorage.removeItem(hwHistoryKey);
        localStorage.removeItem(quizHistoryKey);
        renderHistory();
        updateQuizHistoryWidget();
        alert("History cleared successfully.");
      }
    });

    const changePasswordForm = document.getElementById('changePasswordForm');
    const passwordStatus = document.getElementById('passwordStatus');
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const oldPass = document.getElementById('oldPassword').value;
      const newPass = document.getElementById('newPassword').value;
      try {
        await AuthManager.changePassword(oldPass, newPass);
        passwordStatus.innerText = "Password changed successfully.";
        passwordStatus.style.color = "#10b981";
        changePasswordForm.reset();
      } catch(err) {
        passwordStatus.innerText = err.message;
        passwordStatus.style.color = "#ef4444";
      }
      setTimeout(() => passwordStatus.innerText = '', 3000);
    });

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', async () => {
      await AuthManager.logout();
      window.location.reload();
    });
  }

  // --- Dashboard Progress Rendering ---
  function renderDashboardProgress() {
    if(!AuthManager.getCurrentUser()) return; 
    const stats = StatsManager.getStats();
    const activity = StatsManager.getRecentActivity();
    
    const dashboardStatsGrid = document.getElementById('dashboardStatsGrid');
    const visualProgressArea = document.getElementById('visualProgressArea');
    const recentActivityList = document.getElementById('recentActivityList');
    
    if (dashboardStatsGrid) {
      dashboardStatsGrid.innerHTML = `
        <div class="card summary-card glass">
          <div class="card-icon"><span class="material-symbols-rounded">check_circle</span></div>
          <div class="card-info">
            <h3>${stats.questionsSolved}</h3>
            <p>Questions Solved</p>
          </div>
        </div>
        <div class="card summary-card glass">
          <div class="card-icon accent"><span class="material-symbols-rounded">military_tech</span></div>
          <div class="card-info">
            <h3>${stats.quizzesCompleted}</h3>
            <p>Quizzes Completed</p>
          </div>
        </div>
      `;
    }

    if (visualProgressArea) {
      const accuracy = stats.totalQuizQuestions > 0 ? Math.round((stats.totalQuizCorrect / stats.totalQuizQuestions) * 100) : 0;
      let mostPracticedSubject = "None";
      let highestSubjectCount = 0;
      for (const [subj, count] of Object.entries(stats.subjectTally || {})) {
        if (count > highestSubjectCount) {
          highestSubjectCount = count;
          mostPracticedSubject = subj;
        }
      }

      if (stats.questionsSolved === 0 && stats.quizzesCompleted === 0 && stats.topicsPracticed.length === 0) {
        visualProgressArea.innerHTML = `
          <div style="text-align: center; color: var(--text-secondary);">
            <span class="material-symbols-rounded" style="font-size: 3rem; margin-bottom: 0.5rem; opacity: 0.5;">monitoring</span>
            <p>Start solving questions, reading topics, or taking quizzes to track your progress.</p>
          </div>
        `;
      } else {
        visualProgressArea.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span>Quiz Accuracy</span>
                <span style="font-weight: 600; color: var(--accent-primary);">${accuracy}%</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${accuracy}%"></div>
              </div>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
               <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; text-align: center;">
                 <div style="font-size: 1.5rem; font-weight: 700; color: #10b981;">${stats.topicsPracticed.length}</div>
                 <div style="font-size: 0.75rem; color: var(--text-secondary);">Topics Practiced</div>
               </div>
               <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; text-align: center;">
                 <div style="font-size: 1rem; font-weight: 600; color: #f59e0b; margin-bottom: 0.25rem;">${mostPracticedSubject}</div>
                 <div style="font-size: 0.75rem; color: var(--text-secondary);">Top Subject</div>
               </div>
            </div>
          </div>
        `;
      }
    }

    if (recentActivityList) {
      if (activity.length === 0) {
        recentActivityList.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 1rem;">No recent activity yet. Start exploring!</p>`;
      } else {
        recentActivityList.innerHTML = activity.slice(0, 5).map(act => {
          let icon = 'document_scanner';
          let iconClass = '';
          if (act.type === 'quiz') { icon = 'quiz'; iconClass = 'quiz'; }
          if (act.type === 'learn') { icon = 'menu_book'; iconClass = 'learn'; }
          
          return `
            <div class="activity-item">
              <div class="activity-icon ${iconClass}">
                <span class="material-symbols-rounded">${icon}</span>
              </div>
              <div class="activity-details">
                <div class="activity-title">${act.description}</div>
                <div class="activity-meta">${act.subject} • ${new Date(act.date).toLocaleDateString()}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // --- API Key management ---
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
  if (apiKeyInput && saveApiKeyBtn) {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) apiKeyInput.value = savedKey;
    saveApiKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        localStorage.setItem('GEMINI_API_KEY', key);
        alert('API Key saved securely in your browser!');
      }
    });
  }

  // --- Learn Section ---
  const learnList = document.getElementById('learnList');
  const learnLevelFilters = document.querySelectorAll('#learnLevelFilters .filter-chip');
  const learnModal = document.getElementById('learnModal');
  const learnModalTitle = document.getElementById('learnModalTitle');
  const learnModalContent = document.getElementById('learnModalContent');
  const closeLearnModalBtn = document.getElementById('closeLearnModalBtn');
  let currentLearnLevel = 'All';

  const allTopics = learnData.flatMap(subject => 
    subject.topics.map(topic => ({ ...topic, subjectName: subject.subject, icon: subject.icon, color: subject.color }))
  );

  function renderLearn() {
    if (!learnList) return;
    if (allTopics.length === 0) {
      learnList.innerHTML = `
        <div class="content-placeholder glass">
          <span class="material-symbols-rounded huge-icon">menu_book</span>
          <h3>Library is Empty</h3>
          <p>No study materials are available at the moment.</p>
        </div>
      `;
      return;
    }
    
    const filtered = currentLearnLevel === 'All' ? allTopics : allTopics.filter(t => t.level === currentLearnLevel);
    
    if (filtered.length === 0) {
      learnList.innerHTML = `<p style="text-align: center; color: var(--text-secondary); margin-top: 2rem;">No topics found for the selected level.</p>`;
      return;
    }
    
    learnList.innerHTML = filtered.map(topic => `
      <div class="learn-card glass" data-id="${topic.id}">
        <div class="learn-card-bg" style="background: ${topic.color}"></div>
        <span class="level-badge">${topic.level}</span>
        <div class="learn-card-content">
          <div class="learn-card-icon"><span class="material-symbols-rounded">${topic.icon}</span></div>
          <div class="learn-card-text">
            <div class="learn-card-title">${topic.title}</div>
            <div class="learn-card-subject">${topic.subjectName}</div>
          </div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.learn-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const topic = allTopics.find(t => t.id === id);
        if (topic) {
          learnModalTitle.innerText = topic.title;
          let parsedHtml = topic.content
            .replace(/#### (.*?)\n/g, '<h4>$1</h4>').replace(/### (.*?)\n/g, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
          learnModalContent.innerHTML = parsedHtml;
          learnModal.classList.remove('hidden');

          StatsManager.recordTopicPracticed(topic.id, topic.title, topic.subjectName);
          renderDashboardProgress();
        }
      });
    });
  }
  learnLevelFilters.forEach(chip => {
    chip.addEventListener('click', (e) => {
      learnLevelFilters.forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      currentLearnLevel = e.target.getAttribute('data-level');
      renderLearn();
    });
  });
  if (closeLearnModalBtn) closeLearnModalBtn.addEventListener('click', () => learnModal.classList.add('hidden'));
  renderLearn();

  // --- Quizzes Section ---
  const quizzesList = document.getElementById('quizzesList');
  const totalQuizzesTakenEl = document.getElementById('totalQuizzesTaken');
  const avgScoreValEl = document.getElementById('avgScoreVal');
  const recentScoreValEl = document.getElementById('recentScoreVal');
  const quizModal = document.getElementById('quizModal');
  const closeQuizModalBtn = document.getElementById('closeQuizModalBtn');
  const quizModalTitle = document.getElementById('quizModalTitle');
  const quizProgress = document.getElementById('quizProgress');
  const quizQuestionText = document.getElementById('quizQuestionText');
  const quizOptionsContainer = document.getElementById('quizOptions');
  const quizFeedback = document.getElementById('quizFeedback');
  const nextQuizBtn = document.getElementById('nextQuizBtn');

  let activeQuiz = null;
  let currentQuestionIndex = 0;
  let currentScore = 0;
  let optionSelected = false;

  function updateQuizHistoryWidget() {
    const history = JSON.parse(localStorage.getItem(quizHistoryKey) || '[]');
    if(totalQuizzesTakenEl) totalQuizzesTakenEl.innerText = `${history.length} taken`;
    if(avgScoreValEl && recentScoreValEl) {
      if (history.length > 0) {
        const totalScore = history.reduce((sum, h) => sum + h.percentage, 0);
        avgScoreValEl.innerText = `${Math.round(totalScore / history.length)}%`;
        recentScoreValEl.innerText = `${history[0].percentage}%`;
      } else {
        avgScoreValEl.innerText = `0%`;
        recentScoreValEl.innerText = `-`;
      }
    }
  }

  function renderQuizzes() {
    if (!quizzesList) return;
    if (quizData.length === 0) {
      quizzesList.innerHTML = `
        <div class="content-placeholder glass">
          <span class="material-symbols-rounded huge-icon">quiz</span>
          <h3>No Quizzes</h3>
          <p>Check back later for new quizzes to test your knowledge.</p>
        </div>
      `;
      return;
    }
    
    quizzesList.innerHTML = quizData.map(quiz => `
      <div class="learn-card glass quiz-card" data-id="${quiz.id}">
        <div class="learn-card-bg" style="background: ${quiz.color}"></div>
        <span class="level-badge">${quiz.level}</span>
        <div class="learn-card-content">
          <div class="learn-card-icon"><span class="material-symbols-rounded">${quiz.icon}</span></div>
          <div class="learn-card-text">
            <div class="learn-card-title">${quiz.title}</div>
            <div class="learn-card-subject">${quiz.subject} • ${quiz.questions.length} Questions</div>
          </div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.quiz-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        activeQuiz = quizData.find(q => q.id === id);
        if (activeQuiz) {
          currentQuestionIndex = 0;
          currentScore = 0;
          quizModalTitle.innerText = activeQuiz.title;
          loadQuizQuestion();
          quizModal.classList.remove('hidden');
        }
      });
    });
  }

  function loadQuizQuestion() {
    if (currentQuestionIndex >= activeQuiz.questions.length) {
      finishQuiz();
      return;
    }
    const q = activeQuiz.questions[currentQuestionIndex];
    quizProgress.innerText = `Question ${currentQuestionIndex + 1} of ${activeQuiz.questions.length}`;
    quizQuestionText.innerText = q.question;
    optionSelected = false;
    nextQuizBtn.disabled = true;
    quizFeedback.style.display = 'none';

    quizOptionsContainer.innerHTML = q.options.map((opt, i) => `
      <button class="quiz-option" data-index="${i}">${opt}</button>
    `).join('');

    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (optionSelected) return; 
        optionSelected = true;
        const selectedIndex = parseInt(e.target.getAttribute('data-index'));
        const isCorrect = selectedIndex === q.correctAnswer;
        
        e.target.classList.add('selected');
        
        if (isCorrect) {
          e.target.classList.add('correct');
          quizFeedback.innerText = "Correct!";
          quizFeedback.style.color = "#10b981";
          currentScore++;
        } else {
          e.target.classList.add('incorrect');
          quizFeedback.innerText = "Incorrect";
          quizFeedback.style.color = "#ef4444";
          document.querySelector(`.quiz-option[data-index="${q.correctAnswer}"]`).classList.add('correct');
        }
        
        quizFeedback.style.display = 'block';
        nextQuizBtn.disabled = false;
        if (currentQuestionIndex === activeQuiz.questions.length - 1) {
          nextQuizBtn.innerText = "Finish Quiz";
        } else {
          nextQuizBtn.innerText = "Next Question";
        }
      });
    });
  }

  function finishQuiz() {
    const percentage = Math.round((currentScore / activeQuiz.questions.length) * 100);
    quizProgress.innerText = "Quiz Complete!";
    quizQuestionText.innerText = `You scored ${currentScore} out of ${activeQuiz.questions.length} (${percentage}%)`;
    quizOptionsContainer.innerHTML = '';
    quizFeedback.style.display = 'none';
    nextQuizBtn.innerText = "Close";
    nextQuizBtn.disabled = false;
    
    let history = JSON.parse(localStorage.getItem(quizHistoryKey) || '[]');
    history.unshift({
      id: Date.now(), quizId: activeQuiz.id, title: activeQuiz.title,
      score: currentScore, total: activeQuiz.questions.length, percentage: percentage
    });
    localStorage.setItem(quizHistoryKey, JSON.stringify(history));
    
    StatsManager.recordQuizCompleted(currentScore, activeQuiz.questions.length, activeQuiz.subject, activeQuiz.title);
    renderDashboardProgress();
    updateQuizHistoryWidget();
  }

  if (nextQuizBtn) {
    nextQuizBtn.addEventListener('click', () => {
      if (nextQuizBtn.innerText === "Close") {
        quizModal.classList.add('hidden');
      } else {
        currentQuestionIndex++;
        loadQuizQuestion();
      }
    });
  }
  if (closeQuizModalBtn) closeQuizModalBtn.addEventListener('click', () => quizModal.classList.add('hidden'));

  renderQuizzes();

  // --- History Section ---
  const historyList = document.getElementById('historyList');
  const historyFilters = document.getElementById('historyFilters');
  let currentFilter = 'All';

  function renderHistory() {
    if (!historyList || !historyFilters) return;
    const history = JSON.parse(localStorage.getItem(hwHistoryKey) || '[]');
    if (history.length === 0) {
      historyList.innerHTML = `
         <div class="content-placeholder glass">
           <span class="material-symbols-rounded huge-icon">history</span>
           <h3>No history yet</h3>
           <p>Your past homework solutions and chats will appear here.</p>
         </div>
      `;
      historyFilters.innerHTML = '';
      return;
    }

    const subjects = ['All', ...new Set(history.map(item => item.subject))];
    historyFilters.innerHTML = subjects.map(sub => `
      <button class="filter-chip ${sub === currentFilter ? 'active' : ''}" data-filter="${sub}">${sub}</button>
    `).join('');

    document.querySelectorAll('#historyFilters .filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        currentFilter = e.target.getAttribute('data-filter');
        renderHistory();
      });
    });

    const filteredHistory = currentFilter === 'All' ? history : history.filter(item => item.subject === currentFilter);

    if (filteredHistory.length === 0) {
        historyList.innerHTML = `<p style="text-align: center; color: var(--text-secondary); margin-top: 2rem;">No items found for ${currentFilter}.</p>`;
    } else {
        historyList.innerHTML = filteredHistory.map(item => {
            let previewText = item.fullText.replace(/####.*?(\n|$)/g, '').replace(/[\*\#\`]/g, '').trim().substring(0, 100) + '...';
            return `
              <div class="history-card glass" data-id="${item.id}">
                <div class="history-card-header">
                  <span class="history-tag">${item.subject}</span>
                  <span class="history-date">${new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div class="history-preview">${previewText}</div>
              </div>
            `;
        }).join('');
    }
    
    document.querySelectorAll('.history-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id'));
        const item = history.find(h => h.id === id);
        if (item) {
           const imageModal = document.getElementById('imageModal');
           const imagePreview = document.getElementById('imagePreview');
           const analysisResult = document.getElementById('analysisResult');
           const confirmBtn = document.getElementById('confirmBtn');
           imagePreview.style.display = 'none';
           analysisResult.innerHTML = item.htmlContent;
           analysisResult.classList.remove('hidden');
           confirmBtn.style.display = 'none';
           imageModal.classList.remove('hidden');
        }
      });
    });
  }

  // --- File upload and AI logic ---
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');
  const imageModal = document.getElementById('imageModal');
  const imagePreview = document.getElementById('imagePreview');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  const analysisResult = document.getElementById('analysisResult');
  let currentFile = null;

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validation: Must be an image
        if (!file.type.startsWith('image/')) {
          alert("Error: Unsupported file format. Please upload a valid image file (JPEG, PNG, etc).");
          e.target.value = '';
          return;
        }

        currentFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          imagePreview.style.display = 'block';
          confirmBtn.style.display = 'block';
          imagePreview.src = event.target.result;
          imageModal.classList.remove('hidden');
          analysisResult.innerHTML = '';
          analysisResult.classList.add('hidden');
        };
        reader.readAsDataURL(file);
      }
      e.target.value = '';
    });
  }

  const closeModal = () => {
    imageModal.classList.add('hidden');
    setTimeout(() => { imagePreview.src = ''; currentFile = null; }, 300); 
  };
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  async function performAnalysis(base64Data, mimeType, optionalPromptExtension = "") {
      if (!navigator.onLine) {
        alert("You are currently offline. Please connect to the internet to use the AI scanner.");
        return;
      }

      confirmBtn.disabled = true;
      confirmBtn.innerHTML = 'Analyzing...';
      analysisResult.classList.remove('hidden');
      analysisResult.innerHTML = `<div class="analysis-loader"><div class="spinner"></div><p>Scanning problem and thinking...</p></div>`;

      try {
        const responseReq = await fetch('http://localhost:3000/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data, mimeType, optionalPromptExtension })
        });
        
        if (!responseReq.ok) {
           const errData = await responseReq.json().catch(() => ({}));
           throw new Error(errData.error || `Server responded with status ${responseReq.status}`);
        }
        
        const responseData = await responseReq.json();
        const response = { text: responseData.text };

        // Edge Case Handling: Check for Error Block
        if (response.text.includes("#### Error")) {
           if (response.text.includes("BLURRY_OR_NO_QUESTION")) {
              const msgMatch = response.text.match(/#### Message\s*\n([\s\S]*?)(?=\n####|$)/i);
              const message = msgMatch ? msgMatch[1].trim() : "We couldn't clearly detect a question. Please try taking another photo.";
              analysisResult.innerHTML = `
                <div style="text-align: center; padding: 2rem 1rem;">
                  <span class="material-symbols-rounded huge-icon" style="color: #f59e0b; margin-bottom: 1rem;">image_not_supported</span>
                  <h3 style="margin-bottom: 0.5rem;">Unclear Image</h3>
                  <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">${message}</p>
                  <button class="primary-btn retry-capture-btn" style="width: auto; padding: 0.75rem 2rem;">Retake Photo</button>
                </div>
              `;
              analysisResult.querySelector('.retry-capture-btn').addEventListener('click', () => fileInput.click());
              return;
           } 
           
           if (response.text.includes("MULTIPLE_QUESTIONS")) {
              const qMatch = response.text.match(/#### Questions\s*\n([\s\S]*?)(?=\n####|$)/i);
              const questionsText = qMatch ? qMatch[1].trim() : "";
              const lines = questionsText.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-/, '').trim());
              
              if (lines.length > 0) {
                 analysisResult.innerHTML = `
                    <div style="padding: 1rem 0;">
                      <h3 style="margin-bottom: 0.5rem; color: var(--accent-primary);">Multiple Questions Detected</h3>
                      <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">We found several questions in this image. Select the one you want help with:</p>
                      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${lines.map((l, i) => `<button class="secondary-btn multiple-q-select" data-index="${i}" style="text-align: left; line-height: 1.4;">${l}</button>`).join('')}
                      </div>
                    </div>
                 `;
                 
                 document.querySelectorAll('.multiple-q-select').forEach(btn => {
                   btn.addEventListener('click', (e) => {
                     const selectedQuestion = lines[parseInt(e.target.getAttribute('data-index'))];
                     const extension = `The user has chosen to ONLY solve this specific question from the image: "${selectedQuestion}". Ignore all other questions.`;
                     performAnalysis(base64Data, mimeType, extension);
                   });
                 });
                 return;
              }
           }
        }

        // Standard parsing and saving if successful
        let htmlContent = response.text
          .replace(/#### (.*?)\n/g, '<h4>$1</h4>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
          
        analysisResult.innerHTML = htmlContent;

        let subjectMatch = response.text.match(/#### Subject\s*\n(.*?)(?=\n|$)/i);
        let subject = subjectMatch ? subjectMatch[1].trim() : "General";
        
        let history = JSON.parse(localStorage.getItem(hwHistoryKey) || '[]');
        history.unshift({ id: Date.now(), date: new Date().toISOString(), subject: subject, fullText: response.text, htmlContent: htmlContent });
        localStorage.setItem(hwHistoryKey, JSON.stringify(history));
        
        StatsManager.recordQuestionSolved(subject);
        renderHistory();
        renderDashboardProgress();
        
      } catch (error) {
        console.error(error);
        analysisResult.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
             <span class="material-symbols-rounded huge-icon" style="color: #ef4444; margin-bottom: 1rem;">error</span>
             <h3 style="margin-bottom: 0.5rem;">Connection Failed</h3>
             <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">We couldn't reach the AI server. ${error.message}</p>
             <button class="primary-btn retry-api-btn" style="width: auto; padding: 0.75rem 2rem;">Retry</button>
          </div>
        `;
        analysisResult.querySelector('.retry-api-btn').addEventListener('click', () => {
           performAnalysis(base64Data, mimeType, optionalPromptExtension);
        });
      } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'Analyze';
      }
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      if (!currentFile) return;
      try {
        const base64Data = await getBase64(currentFile);
        await performAnalysis(base64Data, currentFile.type, "");
      } catch (err) {
        alert("Failed to process image file.");
      }
    });
  }
  // Session Check on Load (Moved here to avoid TDZ errors for constants defined below)
  const currentUser = AuthManager.getCurrentUser();
  if (currentUser) {
    initApp(currentUser);
  } else {
    authContainer.classList.remove('hidden');
    mainAppContainer.style.display = 'none';
  }
});
