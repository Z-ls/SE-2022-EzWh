class User {
  constructor(id, name, surname, username, password, type) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.password = password;
    this.type = type;
  }
}

const possibleTypes = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];

module.exports = { User, possibleTypes };