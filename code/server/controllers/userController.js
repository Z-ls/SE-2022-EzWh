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

  addUser = async (req, res) => {
    try {
      const user =
      {
        name: req.body.name,
        username: req.body.username,
        surname: req.body.surname,
        password: req.body.password,
        type: req.body.type
      }
      const result = await this.userRepo.add(user);
      return res.status(result.code).end();
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  /**
   * 
   * @param {{params:{username:string},body:{oldType:string,newType:string}}} req 
   * @param {*} res 
   * @returns 
   */
  changeRights = async (req, res) => {
    try {
      const result = await this.userRepo.modifyRights(req.params.username, req.body.oldType, req.body.newType);
      return res.status(result.code).end();
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }

  /**
   * 
   * @param {{params:{username:string,type:string}}} req 
   * @param {*} res 
   * @returns 
   */
  delete = async (req, res) => {
    try {
      const result = await this.userRepo.remove(req.params.username, req.params.type);
      return res.status(result.code).end();
    }
    catch (e) {
      return res.status(e.code).end();
    }
  }
}

module.exports = userController;
