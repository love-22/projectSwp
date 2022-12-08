const {db} = require('../database');
const {findAllbyID, findAllCustomers} = require('../database');

const getAdminDashboard = (req, res) => {
    const query = db.prepare(findAllbyID);
    query.get(req.user.id, function (err, row) {
      console.log(row.role);
      if (row.role == 'Admin') {
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
  
  
        console.log("Role is admin");
      } else {
        console.log("Role is other");
        res.redirect('/userDashboard');
      }
    });
};

module.exports = {
    getAdminDashboard
}