const { User, possibleTypes } = require('../model/user');
const DBHandler = require('../persistence/DBHandler');
const userRepository = require('../persistence/userRepository');

const dbHandler = new DBHandler();
const userRepo = new userRepository();
//const possibleTypes = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];
describe("modify rights", () => {
  const u1 = new User(1, "Riccardo", "Salvatelli", "riccccccccc", "passwordd", "customer");
  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
    await userRepo.add(u1);
  });

  // non-existing id
  // valid
  testModifyRight("riccccccccc", "customer", "clerk", { code: 200 });
  testModifyRight("wrongUsername", "customer", "clerk", { code: 404 });
});

describe("add user", () => {
  beforeEach(async () => {
    await dbHandler.deleteAllTablesData();
  });

  const u1 = new User(1, "Riccardo", "Salvatelli", "riccccccccc", "passwordd", "customer");
  testAddUser(u1, { code: 201 });

  const u2 = new User(1, "Riccardo", "Salvatelli", "riccccccccc", "passwordd", "customer");
  testAddUser(u1, { code: 409 }, true); // addTwice = true
});

function testModifyRight(username, oldType, newType, expected) {
  test('modify rights', async () => {
    try {
      const result = await userRepo.modifyRights(username, oldType, newType);
      expect(result).toEqual(expected);
    } catch (e) { expect(e).toEqual(expected); }
  });
}

function testAddUser(u, expected, addTwice = undefined) {
  test('add user', async () => {
    try {
      if (addTwice) {
        await userRepo.add(u);
      }
      const res = await userRepo.add(u);
      expect(res).toEqual(expected);
    } catch (e) {
      expect(e).toEqual(expected);
      return;
    }
  });
}