const User = require("../model/user");
const userRepository = require("../persistence/userRepository");

class userController {
  constructor() {
    this.userRepo = new userRepository();
  }

  getAllSupplier = async (_req, res) => {
    try {
      const result = await this.userRepo.allSuppliers();
      return res.status(result.code).send(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  getAllUser = async (_req, res) => {
    try {
      const result = await this.userRepo.allUsers();
      return res.status(result.code).send(result.data);
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  addUser = async (user) => {
    try {
      const result = await this.userRepo.add(user);
      return result;
    }
    catch (e) {
      return e;
    }
  }

  /**
   * 
   * @param {string} username 
   * @param {string} oldType 
   * @param {string} newType 
   * @returns 
   */
  changeRights = async (username, oldType, newType) => {
    try {
      return await this.userRepo.modifyRights(username, oldType, newType);
    }
    catch (e) {
      return e;
    }
  }

  /**
   * 
   * @param {string} username 
   * @param {string} type 
   * @returns 
   */
  delete = async (username, type) => {
    try {
      return await this.userRepo.remove(username, type);
    }
    catch (e) {
      return e;
    }
  }

  return200 = async (_req, res) => {
    return res.status(200).end();
  }
}

module.exports = userController;
