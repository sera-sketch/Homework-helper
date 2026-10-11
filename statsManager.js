export const StatsManager = {
  _userId: 'guest', // Default prefix

  init(userId) {
    this._userId = userId;
  },

  _getKey(baseKey) {
    return `${this._userId}_${baseKey}`;
  },

  getStats() {
    const defaultStats = {
      questionsSolved: 0,
      quizzesCompleted: 0,
      totalQuizQuestions: 0,
      totalQuizCorrect: 0,
      topicsPracticed: [], 
      subjectTally: {}
    };
    return JSON.parse(localStorage.getItem(this._getKey('USER_STATS'))) || defaultStats;
  },

  saveStats(stats) {
    localStorage.setItem(this._getKey('USER_STATS'), JSON.stringify(stats));
  },

  getRecentActivity() {
    return JSON.parse(localStorage.getItem(this._getKey('RECENT_ACTIVITY'))) || [];
  },

  logActivity(type, description, subject = "General") {
    const activity = this.getRecentActivity();
    activity.unshift({
      id: Date.now(),
      type: type, 
      description: description,
      subject: subject,
      date: new Date().toISOString()
    });
    if (activity.length > 10) activity.pop();
    localStorage.setItem(this._getKey('RECENT_ACTIVITY'), JSON.stringify(activity));
  },

  incrementSubject(stats, subject) {
    if (!stats.subjectTally[subject]) {
      stats.subjectTally[subject] = 0;
    }
    stats.subjectTally[subject]++;
  },

  recordQuestionSolved(subject) {
    const stats = this.getStats();
    stats.questionsSolved++;
    this.incrementSubject(stats, subject);
    this.saveStats(stats);
    this.logActivity('scan', 'Scanned & solved a question', subject);
  },

  recordQuizCompleted(score, total, subject, title) {
    const stats = this.getStats();
    stats.quizzesCompleted++;
    stats.totalQuizQuestions += total;
    stats.totalQuizCorrect += score;
    this.incrementSubject(stats, subject);
    this.saveStats(stats);
    this.logActivity('quiz', `Completed quiz: ${title} (${score}/${total})`, subject);
  },

  recordTopicPracticed(topicId, title, subject) {
    const stats = this.getStats();
    if (!stats.topicsPracticed.includes(topicId)) {
      stats.topicsPracticed.push(topicId);
    }
    this.incrementSubject(stats, subject);
    this.saveStats(stats);
    this.logActivity('learn', `Studied topic: ${title}`, subject);
  }
};
