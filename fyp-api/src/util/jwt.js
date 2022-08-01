const jsonwebtoken = require('jsonwebtoken');

class jwt {
  static signApiToken() {
    return jsonwebtoken.sign(
      {
        type: "api_token"
      },
      process.env.SECRET
    );
  }

  static signUser(user, rt) {
    return jsonwebtoken.sign(
      {
        rt_id: rt.insertId,
        id: user.user_id,
        email: user.email,
        is_user: user.is_user,
        role_id: user.role_id,
        type: "user"
      },
      process.env.SECRET,
      {
        expiresIn: 7200
      }
    );
  }

  static signAdmin(admin, rt) {
    return jsonwebtoken.sign(
      {
        rt_id: rt.insertId,
        id: admin.admin_id,
        email: admin.email,
        is_superadmin: admin.is_superadmin,
        role_id: admin.role_id,
        type: "admin"
      },
      process.env.SECRET,
      {
        expiresIn: 7200
      }
    );
  }
}

module.exports = jwt;
