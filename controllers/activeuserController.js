const User = require("../models/userModel");
const creatError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User_role = require("../models/UserroleModel");
var userData = {};
var userLevel = '';
const activeusers = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      zoneid,
      sectorid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      boothid,
      jilaid,
      stateid,
      countryid,
      limit,
      skip,
      app_type,
      username,
    } = req.body;
    if (username) {
      if (username !== undefined || username !== null || username !== '') {
        console.log(username, "username");
        const users = await User.findOne({ mobile: username });
        if (users.length === 0) {
          return next(new creatError(401, "User not found"));
        }
        const rolesaccess = await User_role.findOne(
          { id: users.role },
        );
        userLevel = rolesaccess.level;
        const statuss = true;
        userData = users;
        userData.addaccess = rolesaccess;
        boothid = parseInt(boothid);
        blockid = parseInt(blockid);
        zoneid = parseInt(zoneid);
        sectorid = parseInt(sectorid);
        nikayid = parseInt(nikayid);
        wardid = parseInt(wardid);
        vidhansabhaid = parseInt(vidhansabhaid);
        loksabhaid = parseInt(loksabhaid);
        jilaid = parseInt(jilaid);
        stateid = parseInt(stateid);
        var data = [];
        const counts = 1;
        var matchData = {}
        if (wardid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { wardid: wardid },
              { isActive: statuss },
            ],
          };
        } else if (nikayid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { nikayid: nikayid },
              { isActive: statuss },
            ],
          };
        } else if (jilaid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { jilaid: jilaid },
              { isActive: statuss },
            ],
          };
        } else if (boothid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { boothid: boothid },
              { isActive: statuss },
            ],
          };
        } else if (sectorid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { sectorid: sectorid },
              { isActive: statuss },
            ],
          };
        } else if (zoneid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { zoneid: zoneid },
              { isActive: statuss },
            ],
          };
        } else if (blockid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { blockid: blockid },
              { isActive: statuss },
            ],
          };
        } else if (vidhansabhaid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { vidhansabhaid: vidhansabhaid },
              { isActive: statuss },
            ],
          };
        } else if (loksabhaid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { loksabhaid: loksabhaid },
              { isActive: statuss },
            ],
          };
        } else if (stateid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { stateid: stateid },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "ward") {
          matchData = {
            $and: [
              { wardid: { $in: users[0].wardid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "nigam") {
          matchData = {
            $and: [
              { nikayid: { $in: users[0].nikayid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "jila") {
          matchData = {
            $and: [
              { jilaid: { $in: users[0].jilaid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "booth") {
          matchData = {
            $and: [
              { boothid: { $in: users[0].boothid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "sector") {
          matchData = {
            $and: [
              { sectorid: { $in: users[0].sectorid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "zone") {
          matchData = {
            $and: [
              { zoneid: { $in: users[0].zoneid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "block") {
          matchData = {
            $and: [
              { blockid: { $in: users[0].blockid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "vidhansabha") {
          matchData = {
            $and: [
              { vidhansabhaid: { $in: users[0].vidhansabhaid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "loksabha") {
          matchData = {
            $and: [
              { loksabhaid: { $in: users[0].loksabhaid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "state") {
          matchData = {
            $and: [
              { stateid: { $in: users[0].stateid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "national") {
          matchData = {
            $and: [
              { isActive: statuss },
            ],
          };
        }

        const user = await User.find(matchData);
        if (!user) {
          return next(new creatError("User Note exists", 400));
        }
        res.status(201).json({
          status: "success",
          message: "user Find successfull",
          user: user,
        });

      }
    }
  } catch (error) {
    next(error);
  }
};
const activeuserscount = async (req, res, next) => {
  try {
    const user = await User.countDocuments({ isActive: true });
    if (!user) {
      return next(new creatError("User Note exists", 400));
    }
    res.status(201).json({
      status: "success",
      message: "user Find successfull",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
const activeuserslocation1 = async (req, res, next) => {
  try {
    const user = await User.find({ isActive: true }, { _id: 0, latitude: 1, longitude: 1, name: 1 });
    if (!user) {
      return next(new creatError("User Note exists", 400));
    }
    res.status(201).json({
      status: "success",
      message: "user Find successfull",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

const activeuserslocation = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      zoneid,
      sectorid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      boothid,
      jilaid,
      stateid,
      countryid,
      limit,
      skip,
      app_type,
      username,
    } = req.body;
    if (username) {
      if (username !== undefined || username !== null || username !== '') {
        console.log(username, "username");
        const users = await User.findOne({ mobile: username });
        if (users.length === 0) {
          return next(new creatError(401, "User not found"));
        }
        const rolesaccess = await User_role.findOne(
          { id: users.role },
        );
        userLevel = rolesaccess.level;
        const statuss = true;
        userData = users;
        userData.addaccess = rolesaccess;
        boothid = parseInt(boothid);
        blockid = parseInt(blockid);
        zoneid = parseInt(zoneid);
        sectorid = parseInt(sectorid);
        nikayid = parseInt(nikayid);
        wardid = parseInt(wardid);
        vidhansabhaid = parseInt(vidhansabhaid);
        loksabhaid = parseInt(loksabhaid);
        jilaid = parseInt(jilaid);
        stateid = parseInt(stateid);
        var data = [];
        const counts = 1;
        var matchData = {}
        if (wardid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { wardid: wardid },
              { isActive: statuss },
            ],
          };
        } else if (nikayid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { nikayid: nikayid },
              { isActive: statuss },
            ],
          };
        } else if (jilaid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { jilaid: jilaid },
              { isActive: statuss },
            ],
          };
        } else if (boothid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { boothid: boothid },
              { isActive: statuss },
            ],
          };
        } else if (sectorid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { sectorid: sectorid },
              { isActive: statuss },
            ],
          };
        } else if (zoneid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { zoneid: zoneid },
              { isActive: statuss },
            ],
          };
        } else if (blockid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { blockid: blockid },
              { isActive: statuss },
            ],
          };
        } else if (vidhansabhaid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { vidhansabhaid: vidhansabhaid },
              { isActive: statuss },
            ],
          };
        } else if (loksabhaid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { loksabhaid: loksabhaid },
              { isActive: statuss },
            ],
          };
        } else if (stateid >= 1) {
          matchData = {
            $and: [
              // { wardid: { $in: users[0].wardid } },
              { stateid: stateid },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "ward") {
          matchData = {
            $and: [
              { wardid: { $in: users[0].wardid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "nigam") {
          matchData = {
            $and: [
              { nikayid: { $in: users[0].nikayid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "jila") {
          matchData = {
            $and: [
              { jilaid: { $in: users[0].jilaid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "booth") {
          matchData = {
            $and: [
              { boothid: { $in: users[0].boothid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "sector") {
          matchData = {
            $and: [
              { sectorid: { $in: users[0].sectorid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "zone") {
          matchData = {
            $and: [
              { zoneid: { $in: users[0].zoneid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "block") {
          matchData = {
            $and: [
              { blockid: { $in: users[0].blockid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "vidhansabha") {
          matchData = {
            $and: [
              { vidhansabhaid: { $in: users[0].vidhansabhaid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "loksabha") {
          matchData = {
            $and: [
              { loksabhaid: { $in: users[0].loksabhaid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "state") {
          matchData = {
            $and: [
              { stateid: { $in: users[0].stateid } },
              { isActive: statuss },
            ],
          };
        } else if (userLevel === "national") {
          matchData = {
            $and: [
              { isActive: statuss },
            ],
          };
        }

        const user = await User.find(matchData, { _id: 0, latitude: 1, longitude: 1, name: 1 });
        if (!user) {
          return next(new creatError("User Note exists", 400));
        }
        res.status(201).json({
          status: "success",
          message: "user Find successfull",
          user: user,
        });

      }
    }
  } catch (error) {
    next(error);
  }
};
// filepath: /c:/Users/Admin/Desktop/new task/surveyapp/server/controllers/authController.js


module.exports = { activeusers, activeuserscount, activeuserslocation };