class TestResultRepository {

    sqlite = require('sqlite3');

    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, err => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS TEST_RESULT";
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        });
    }

    newTestResultTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS TEST_RESULT(" +
                "TEST_RESULT_ID INTEGER PRIMARY KEY AUTOINCREMENT," +
                "TEST_DESCRIPTOR_ID INTEGER," +
                "DATE DATE," +
                "RESULT INTEGER);";
            this.db.run(sql, (err) => {
               if (err) {
                   reject(err);
                   return;
               }
               resolve();
            });
        });
    }

    getTestResults() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM TEST_RESULT;"
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const trs = rows.map(tr => (
                    {
                        id: tr.TEST_RESULT_ID,
                        idTestDescriptor: tr.TEST_DESCRIPTOR_ID,
                        Date: tr.DATE,
                        Result: tr.RESULT
                    }
                ));
                resolve(trs);
            });
        });
    }

}

module.exports = TestResultRepository;