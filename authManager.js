// Modular Authentication Manager for simulated client-side auth.
// Can be replaced with real API calls later.

export const AuthManager = {
  // Simple hash function for simulated security (DO NOT use in real production)
  _hash(string) {
    let hash = 0;
    if (string.length === 0) return hash.toString();
    for (let i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  },

  _getUsersDB() {
    return JSON.parse(localStorage.getItem('USERS_DB') || '{}');
  },

  _saveUsersDB(db) {
    localStorage.setItem('USERS_DB', JSON.stringify(db));
  },

  register(name, email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = this._getUsersDB();
        const emailLower = email.toLowerCase();
        
        if (db[emailLower]) {
          return reject(new Error('User with this email already exists.'));
        }

        const userId = 'user_' + Date.now();
        const hashedPassword = this._hash(password);

        db[emailLower] = {
          id: userId,
          name: name,
          email: emailLower,
          passwordHash: hashedPassword,
          createdAt: new Date().toISOString()
        };

        this._saveUsersDB(db);
        
        // Auto-login after registration
        const sessionUser = { id: userId, name: name, email: emailLower };
        localStorage.setItem('CURRENT_SESSION', JSON.stringify(sessionUser));
        
        resolve(sessionUser);
      }, 500); // Simulate network delay
    });
  },

  login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = this._getUsersDB();
        const emailLower = email.toLowerCase();
        const userRecord = db[emailLower];

        if (!userRecord) {
          return reject(new Error('Invalid email or password.'));
        }

        const hashedPassword = this._hash(password);
        if (userRecord.passwordHash !== hashedPassword) {
          return reject(new Error('Invalid email or password.'));
        }

        const sessionUser = { id: userRecord.id, name: userRecord.name, email: userRecord.email };
        localStorage.setItem('CURRENT_SESSION', JSON.stringify(sessionUser));
        
        resolve(sessionUser);
      }, 500); // Simulate network delay
    });
  },

  logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('CURRENT_SESSION');
        resolve();
      }, 200);
    });
  },

  updateUser(name, email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = this._getUsersDB();
        const currentSession = this.getCurrentUser();
        if (!currentSession) return reject(new Error("Not logged in."));
        
        let foundKey = null;
        for (const [key, user] of Object.entries(db)) {
          if (user.id === currentSession.id) {
            foundKey = key;
            break;
          }
        }
        if (!foundKey) return reject(new Error("User not found."));

        // If email changed, check uniqueness
        const newEmailLower = email.toLowerCase();
        if (newEmailLower !== foundKey && db[newEmailLower]) {
          return reject(new Error("Email already in use by another account."));
        }

        const userRecord = db[foundKey];
        userRecord.name = name;
        userRecord.email = newEmailLower;
        
        // If email changed, we need to update the key in the db object
        if (newEmailLower !== foundKey) {
          db[newEmailLower] = userRecord;
          delete db[foundKey];
        }

        this._saveUsersDB(db);

        const sessionUser = { id: userRecord.id, name: userRecord.name, email: userRecord.email };
        localStorage.setItem('CURRENT_SESSION', JSON.stringify(sessionUser));
        
        resolve(sessionUser);
      }, 500);
    });
  },

  changePassword(oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const db = this._getUsersDB();
        const currentSession = this.getCurrentUser();
        if (!currentSession) return reject(new Error("Not logged in."));

        const userRecord = db[currentSession.email.toLowerCase()];
        if (!userRecord) return reject(new Error("User not found."));

        if (userRecord.passwordHash !== this._hash(oldPassword)) {
          return reject(new Error("Incorrect old password."));
        }

        userRecord.passwordHash = this._hash(newPassword);
        this._saveUsersDB(db);
        resolve();
      }, 500);
    });
  },

  getCurrentUser() {
    const session = localStorage.getItem('CURRENT_SESSION');
    return session ? JSON.parse(session) : null;
  }
};
