const {db} = require('../database');
const {findAllbyID} = require('../database');

const getUserDashboard = (req, res) => {
    // If admin?
    const query = db.prepare(findAllbyID);
    query.get(req.user.id, function (err, row) {
      res.render('userDashboard.ejs', { name: row.name, 
                                        email: row.email,
                                        phone: row.phone,
                                        address: row.address});
    });
};

const userDeletesAccount = (req, res) => {
  try {
    let accountID = req.user.id;
    sql = `DELETE FROM users WHERE id = ?`;

    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        console.log("Error in logout");
      } else {
        console.log("Logout successful");
      }
    });

    db.run(sql, [accountID], (err) => {
      if (err) return console.error(err.message);
    })

    res.redirect('/login1');
  } catch {
    res.redirect('/userDashboard');
  }
};

module.exports = {
  getUserDashboard,
  userDeletesAccount
};