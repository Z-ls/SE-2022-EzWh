const sqlite = require('sqlite3');
const { User, possibleTypes } = require('../model/user');

class userRepository {
  constructor() {
    this.db = new sqlite.Database('../ezwh.db', (err) => {
      if (err) {
        throw err;
      }
    });
    this.db.run("PRAGMA foreign_keys = ON"); // necessary to make sql lite to comply with the foreign key constraints
  }

  /**
   * 
   * @returns {Promise}
   */
  allSuppliers() {
    return new Promise((resolve, reject) => {
      const query = "SELECT id,name,surname,username as email FROM  user WHERE type=\"supplier\"";
      this.db.all(query,
        (err, rows) => {
          if (err)
            reject({ code: 500 });
          else
            resolve({ code: 200, data: rows });
        })
    })
  }

  /**
   * All users exluding managers
   * @returns {Promise}
   */
  allUsers() {
    return new Promise((resolve, reject) => {
      const query = "SELECT id,name,surname,username as email, type FROM  user WHERE type!=\"manager\"";
      this.db.all(query,
        (err, rows) => {
          if (err)
            reject({ code: 500 });
          else
            resolve({ code: 200, data: rows });
        })
    })
  }

  get(username) {
    return new Promise((resolve, reject) => {
      const query = "SELECT name, surname,password, type, username FROM user WHERE username=?";
      this.db.get(query, username,
        (err, row) => {
          if (err) {
            reject({ code: 503 });
          }
          else {
            if (row.length === 0)
              reject({ code: 404 });
            else
              resolve({ code: 200, data: row });
          }
        })
    });
  }

  /**
   * Check if already exists a user with the same username and type
   * @param {string} username 
   * @param {string} type 
   * @return {Promise} it is rejected in case of generic error (code 503) or in case of conflict (code 409)
   */
  async isUsernameExisting(username, type) {
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) as n FROM user WHERE username=? and type=?";
      this.db.get(query, [username, type],
        (err, row) => {
          if (err)
            return reject({ code: 503 });
          else {
            if (row.n !== 1)
              return resolve(true);
            else
              return reject({ code: 409 });
          }
        }
      );
    })
  }

  /**
   * 
   * @param {User} user 
   */
  add(user) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.isUsernameExisting(user.username, user.type);
      }
      catch (e) {
        return reject({ code: e.code });
      }
      const query = "INSERT INTO user (username, name, surname, password, type) values (?,?,?,?,?)";
      this.db.run(query, [user.username, user.name, user.surname, user.password, user.type],
        (err) => {
          if (err)
            reject({ code: 503 });
          else
            resolve({ code: 201 });
        });
    })



  }

  /**
   * 
   * @param {string} username 
   * @param {string} oldType 
   * @param {string} newType 
   * @returns {Promise}
   */
  modifyRights(username, oldType, newType) {
    return new Promise((resolve, reject) => {
      // VALIDATION
      if (typeof username !== 'string' || typeof oldType !== 'string' || typeof newType !== 'string' || !possibleTypes.includes(newType) || !possibleTypes.includes(oldType) || ['manager', 'administrator'].includes(newType)) {
        reject({ code: 422 });
      }

      const query = "UPDATE user SET type=? WHERE username=? and type=?";
      this.db.run(query, [newType, username, oldType],
        function (err) {
          if (err)
            reject({ code: 503 });
          else
            if (this.changes === 0)
              reject({ code: 404 });
            else
              resolve({ code: 200 });
        })
    })
  }

  /**
   * It deletes the user.
   * @param {number} username 
   * @returns {Promise}
   */
  remove(username, type) {
    return new Promise(async (resolve, reject) => {
      // VALIDATION
      if (typeof username !== 'string' || typeof type !== 'string' || !possibleTypes.includes(type))
        return reject({ code: 422 });

      const query = "DELETE FROM user WHERE username=? and type=? AND type!='manager' AND type!='administrator'";
      this.db.run(
        query,
        [username, type], function (err) {
          if (err)
            reject({ code: 503 });
          else {
            resolve({ code: 204 });
          }
        }
      );
    });
  }

  deleteUserdata() {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM user; DELETE FROM sqlite_sequence WHERE name = "user";';
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }
}

module.exports = userRepository;