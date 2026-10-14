const mongoose = require("mongoose");
const UserRole = require("../../../models/UserroleModel");
const Booth = require("../../../models/boothModel");
const Block = require("../../../models/blockModel");
const Zone = require("../../../models/zoneModel");
const Sector = require("../../../models/sectorModel");
const Vidhansabha = require("../../../models/vidhansabhaModel");
const Jila = require("../../../models/jilaModel");
const Loksabha = require("../../../models/loksabhaModel");
const State = require("../../../models/stateModel");
const User = require("../../../models/userModel");
const Generalnews = require("../../../models/generalnewsModel");

const creatError = require("../../../utils/appError");
const { sendNotifacation } = require("../../../firebaseConfig");

// console.log(checkkk.appCheck());
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });
const getUsersRoleIdByType1 = async (roletype) => {
  const topic = "all";
  // console.log("get role tupe", roletype);

  const userss = await UserRole.aggregate([
    {
      $match: {
        level: roletype,
      },
    },
    {
      $group: {
        _id: null,
        id: {
          $push: "$id",
        },
      },
    },
  ]);
  // console.log(userss);
  return userss[0].id;
};

const getUsersTokenRoleIdByType = async (
  roletype,
  ids,
  notification,
  notificationdata,
) => {
  const roleid = await getUsersRoleIdByType1(roletype);
  // console.log(" get roleid ", roleid);

  var matchdata = {};
  if (roletype === "national") {
    matchdata = {
      role: {
        $in: roleid,
      },
    };
  } else if (roletype === "state") {
    matchdata = {
      role: {
        $in: roleid,
      },

      stateid: {
        $in: ids,
      },
    };
  } else if (roletype === "jila") {
    // console.log("jila get role Done");
    matchdata = {
      role: {
        $in: roleid,
      },
      jilaid: {
        $in: ids,
      },
    };

    // console.log(matchdata)
  } else if (roletype === "nigam") {
    matchdata = {
      role: {
        $in: roleid,
      },
      nikayid: {
        $in: ids,
      },
    };
    // console.log("matchdata", matchdata)
  } else if (roletype === "loksabha") {
    matchdata = {
      role: {
        $in: roleid,
      },
      loksabhaid: {
        $in: ids,
      },
    };
  } else if (roletype === "vidhansabha") {
    matchdata = {
      role: {
        $in: roleid,
      },
      vidhansabhaid: {
        $in: ids,
      },
    };
  } else if (roletype === "block") {
    matchdata = {
      role: {
        $in: roleid,
      },
      blockid: {
        $in: ids,
      },
    };
  } else if (roletype === "zone") {
    matchdata = {
      role: {
        $in: roleid,
      },
      zoneid: {
        $in: ids,
      },
    };
  } else if (roletype === "sector") {
    matchdata = {
      role: {
        $in: roleid,
      },
      sectorid: {
        $in: ids,
      },
    };
  }
  const limit = 1;
  const tokenCounts = await User.countDocuments(matchdata);

  // console.log("tokenCounts", tokenCounts);

  var userss = [];
  // for (let index = 0; index <= 2; index + limit) {
  //   // const element = array[index];

  //   console.log("hi", index)
  //   userss = await User.aggregate([
  //     {
  //       $match: matchdata,
  //     },
  //     { $skip: parseInt(index) },
  //     { $limit: limit },

  //     {
  //       $group: {
  //         _id: null,
  //         token: {
  //           $push: "$gcmtoken",
  //         },
  //       },
  //     },

  //   ]);
  //   console.log(userss[0].id);
  // }
  if (tokenCounts > 0) {
    userss = await User.aggregate([
      {
        $match: matchdata,
      },
      // { $skip: parseInt(index) },
      // { $limit: 10 },

      {
        $group: {
          _id: null,
          token: {
            $push: "$gcmtoken",
          },
        },
      },
    ]);
    // console.log("users", userss[0].token);
    sendNotifacation(userss[0].token, notification, notificationdata);
    return userss[0].id;
  } else {
    return 0;
  }
};

const gettaskUsersTokenRoleIdByType = async (
  matchadat,

  notification,
  notificationdata,
) => {
  // const roleid = await getUsersRoleIdByType1(roletype);
  // console.log(" get roleid ", roleid);

  var matchdata = {};

  const limit = 1;
  const tokenCounts = await User.countDocuments(matchadat);

  // console.log("tokenCounts", tokenCounts);

  var userss = [];
  // for (let index = 0; index <= 2; index + limit) {
  //   // const element = array[index];

  //   console.log("hi", index)
  //   userss = await User.aggregate([
  //     {
  //       $match: matchdata,
  //     },
  //     { $skip: parseInt(index) },
  //     { $limit: limit },

  //     {
  //       $group: {
  //         _id: null,
  //         token: {
  //           $push: "$gcmtoken",
  //         },
  //       },
  //     },

  //   ]);
  //   console.log(userss[0].id);
  // }
  if (tokenCounts > 0) {
    userss = await User.aggregate([
      {
        $match: matchadat,
      },
      // { $skip: parseInt(index) },
      // { $limit: 10 },

      {
        $group: {
          _id: null,
          token: {
            $push: "$gcmtoken",
          },
        },
      },
    ]);
    // console.log("users", userss[0].token);
    sendNotifacation(userss[0].token, notification, notificationdata);
    return userss[0].id;
  } else {
    return 0;
  }
};

// const roles = getUsersRoleIdByType("national");
// const messaging = admin;
const getboothsdetailsbyvidhansabhaid = async (vid) => {
  const data = await Booth.findOne({ vidhansabha_id: vid });
  return data;
};
const getboothsdetailsbyboothid = async (vid) => {
  const data = await Booth.findOne({ id: vid });
  return data;
};
const getsectorsdetailsbysectorid = async (vid) => {
  const data = await Sector.findOne({ id: vid });
  return data;
};
const getzonesdetailsbyzoneid = async (vid) => {
  const data = await Zone.findOne({ id: vid });
  return data;
};
const getblocksdetailsbyblockid = async (vid) => {
  const data = await Block.findOne({ id: vid });
  return data;
};
const getvidhansabhasdetailsbyvidhansabhaid = async (vid) => {
  const data = await Vidhansabha.findOne({ id: vid });
  return data;
};
module.exports = {
  getUsersTokenRoleIdByType,
  gettaskUsersTokenRoleIdByType,
  getboothsdetailsbyboothid,
  getboothsdetailsbyboothid,
  getsectorsdetailsbysectorid,
  getzonesdetailsbyzoneid,
  getblocksdetailsbyblockid,
  getvidhansabhasdetailsbyvidhansabhaid,
};
