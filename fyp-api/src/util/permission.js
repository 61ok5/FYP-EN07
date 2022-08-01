const Admin = require('../model/Admin');
const Role = require('../model/Role');
const Token = require('../model/Token');

const Permissions = {};

Permissions.isEndUser = function(reqUser) {
  try {
    return (!reqUser || !reqUser.id || !reqUser.type === 'user') ? false : true;
    
  } catch (error) {
    console.log(error);
    return false;
  }
}

Permissions.isAdmin = function(reqUser) {
  try {
    return (!reqUser || !reqUser.id || !reqUser.type === 'admin') ? false : true;
    
  } catch (error) {
    console.log(error);
    return false;
  }
}

Permissions.isApiToken = function(reqUser) {
  try {
    return (!reqUser || !reqUser.type === 'api_token') ? false : true;
    
  } catch (error) {
    console.log(error);
    return false;
  }
}

Permissions.checkByReqUser = async function(reqUser , paraPermission) {
  try {
    console.log('checking ' + paraPermission + ' permission of ' + reqUser.email);
    if (!reqUser.id ) return false;

    if (reqUser.is_superadmin) {
      console.log('user is super admin, skip permission check');
      return true;
    }

    const admin = await Admin.findById(reqUser.id);
    if (!admin) {
      console.log('user does not exist');
      return false;
    }

    const userPermission = await Role.selectPermissionByRoleId(admin.role_id);
    if (userPermission.length === 0) {
      console.log('user does not have any permission');
      return false
    }

    const checkingPermissionDetails = await Role.selectPermissionByPermissionName(paraPermission);
    if (!checkingPermissionDetails) {
      console.log('no such permission');
      return false;
    }

    const userPermissionNameList = userPermission.reduce((accumulator, item) => {
      accumulator.push(item.name);
      return accumulator;
    }, []);
            
    if (userPermissionNameList.includes(paraPermission)) {
      console.log('permission included');
      return true;
    }
    
    console.log('permission not included');
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

Permissions.checkTargetRoleAccessibleByReqUser = async function(reqUser , target_role_id) {
  try {
    if (!reqUser.id || !target_role_id) return false;

    if (reqUser.is_superadmin) {
      console.log('user is super admin, skip permission check');
      return true;
    }

    const reqUserRole = await Role.findById(reqUser.role_id);
    const reqUserRoleLevel = reqUserRole.level;

    const targetRole = await Role.findById(target_role_id);
    const targetRoleLevel = targetRole.level;

    if (reqUserRoleLevel <= targetRoleLevel) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

Permissions.checkTargetAdminEditableByReqUser = async function(reqUser , target_admin_id) {
  try {
    if (!reqUser.id || !target_admin_id) return false;

    if (reqUser.is_superadmin) {
      console.log('user is super admin, skip permission check');
      return true;
    }

    const reqUserRole = await Role.findById(reqUser.role_id);
    const reqUserRoleLevel = reqUserRole[0].level;

    const admin = await Admin.findById(target_admin_id);
    const adminRole = await Role.findById(admin.role_id);
    const adminRoleLevel = adminRole[0].level;

    if (reqUserRoleLevel <= adminRoleLevel) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = Permissions;
