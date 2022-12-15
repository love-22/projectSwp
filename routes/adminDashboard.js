const {db} = require('../database');
const {findAllbyID, findAllCustomers} = require('../database');

const getAdminDashboard = (req, res) => {
  const query2 = db.prepare(findAllCustomers);
  query2.all('Customer', function (err, rows) {
    let x = 0;
    let id = [];
    let name = [];
    let email = [];
    while (x != rows.length) {
      id.push(rows[x].id);
      name.push(rows[x].name);
      email.push(rows[x].email);
      x++;
    }
    res.render('adminDashboard.ejs', {
      length: rows.length,
      id: id,
      name: name,
      email: email
    });
  });
};

module.exports = {
    getAdminDashboard
}