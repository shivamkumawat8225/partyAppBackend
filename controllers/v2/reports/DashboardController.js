const Booth = require("../../../models/boothModel");
const Block = require("../../../models/blockModel");
const Vidhansabha = require("../../../models/vidhansabhaModel");
const Jila = require("../../../models/jilaModel");
const Loksabha = require("../../../models/loksabhaModel");
const State = require("../../../models/stateModel");
const Nikay = require("../../../models/nikayModel");
const Ward = require("../../../models/wardModel");
const Familysurvey = require("../../../models/surveyfamilyModel");
const Religion = require("../../../models/religionModel");

const creatError = require("../../../utils/appError");
const Surveyfamily = require("../../../models/surveyfamilyModel");
const Category = require("../../../models/categoryModel");
const Caste = require("../../../models/casteModel");
const Surveyvoter = require("../../../models/surveyvoterModel");
const Education = require("../../../models/educationModel");
const Sector = require("../../../models/sectorModel");
const Zone = require("../../../models/zoneModel");
const Profession = require("../../../models/professionModel");
const Party = require("../../../models/party");
const User = require("../../../models/userModel");
const User_role = require("../../../models/UserroleModel");
const { query } = require("express");
var userData = {};
var userLevel = '';
let outerLang
async function getCountByid(rid, level, levelid, tagobj) {
  // console.log("Userlevel", userLevel);
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ religionid: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ religionid: rid }],
    };

  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ religionid: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ religionid: rid }],
    };
  } else {
    query = {
      $and: [{ religionid: rid }],
    };
  }
  if (tagobj.catval) {
    query.categoryid = tagobj.catval;
  }
  if (tagobj.rval) {
    query.religionid = tagobj.rval;
  }
  if (tagobj.vehicalval) {
    query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
    // "vehicals": { $regex: `${rid}`, $options: "m" }
  }
  if (tagobj.cardval) {
    query.card_type = tagobj.cardval;
  }
  if (tagobj.ecoval) {
    query.economics_condition = tagobj.ecoval;
  }
  // //voter wise
  // if (tagobj.edval) {
  //   query.educationid = tagobj.edval;
  // }
  // if (tagobj.prval) {
  //   query.professionid = tagobj.prval;
  // }
  // if (tagobj.gval) {
  //   query.gender = tagobj.gval;
  // }
  // if (tagobj.partyval) {
  //   query.partyid = tagobj.partyval;
  // }
  // if (tagobj.ageval) {
  //   let params2 = 0;
  //   if (tagobj.ageval === 1) { params2 = 12 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }
  //   let newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
  //   query = { ...query, ...newobj };
  //   // query.card_type = tagobj.cardval;
  // }



  // if (tagobj.rval) {
  //   query.categoryid = tagobj.rval;
  // }
  // console.log("Query", JSON.stringify(query));
  const agegroup = await Surveyfamily.countDocuments(query);

  return agegroup;
}
async function getCategoryCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ categoryid: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ categoryid: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ categoryid: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ categoryid: rid }],
    };
  } else {
    query = {
      $and: [{ categoryid: rid }],
    };
  }
  if (tagobj.catval) {
    query.categoryid = tagobj.catval;
  }
  if (tagobj.rval) {
    query.religionid = tagobj.rval;
  }
  if (tagobj.vehicalval) {
    query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
    // "vehicals": { $regex: `${rid}`, $options: "m" }
  }
  if (tagobj.cardval) {
    query.card_type = tagobj.cardval;
  }
  if (tagobj.ecoval) {
    query.economics_condition = tagobj.ecoval;
  }
  //voter wise
  // if (tagobj.edval) {
  //   query.educationid = tagobj.edval;
  // }
  // if (tagobj.prval) {
  //   query.professionid = tagobj.prval;
  // }
  // if (tagobj.gval) {
  //   query.gender = tagobj.gval;
  // }
  // if (tagobj.partyval) {
  //   query.partyid = tagobj.partyval;
  // }
  // if (tagobj.ageval) {
  //   let params2 = 0;
  //   if (tagobj.ageval === 1) { params2 = 12 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }
  //   let newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
  //   query = { ...query, ...newobj };
  //   // query.card_type = tagobj.cardval;
  // }
  const agegroup = await Surveyfamily.countDocuments(query);

  return agegroup;
}
async function getCasteCountByid(level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid
    };
  } else if (level === "block") {
    query = {
      blockid: levelid
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid
    };
  } else if (level === "state") {
    query = {
      stateid: levelid
    };
  } else if (level === "country") {

  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
    };
  } else if (userLevel === "national") {


  } else {

  }
  if (tagobj.catval) {
    query.categoryid = tagobj.catval;
  }
  if (tagobj.rval) {
    query.religionid = tagobj.rval;
  }
  if (tagobj.vehicalval) {
    query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
    // "vehicals": { $regex: `${rid}`, $options: "m" }
  }
  if (tagobj.cardval) {
    query.card_type = tagobj.cardval;
  }
  if (tagobj.ecoval) {
    query.economics_condition = tagobj.ecoval;
  }
  //voter wise
  // if (tagobj.edval) {
  //   query.educationid = tagobj.edval;
  // }
  // if (tagobj.prval) {
  //   query.professionid = tagobj.prval;
  // }
  // if (tagobj.gval) {
  //   query.gender = tagobj.gval;
  // }
  // if (tagobj.partyval) {
  //   query.partyid = tagobj.partyval;
  // }
  // if (tagobj.ageval) {
  //   let params2 = 0;
  //   if (tagobj.ageval === 1) { params2 = 12 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }
  //   let newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
  //   query = { ...query, ...newobj };
  //   // query.card_type = tagobj.cardval;
  // }

  const allCaste = await Surveyfamily.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$casteid",
        count: {
          $sum: 1,
        },
      },
    },
    { $sort: { "count": -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "castes",
        localField: "_id",
        foreignField: "id",
        as: "result",
        pipeline: [
          {
            $project: {
              _id: 0,
              WebId: "$id",
              caste: `$caste_${outerLang}`,
              caste_en: 1,
            },
          },
        ],
      },
    },

    {
      $project: {
        _id: 0,
        id: "$_id",
        result: { $arrayElemAt: ["$result", 0] },
        count: 1
      },
    },

  ]);
  // const agegroup = await Surveyfamily.countDocuments(query);

  return allCaste;
}
async function getEducationCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ educationid: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ educationid: rid }],
    };

  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ educationid: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ educationid: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ educationid: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ educationid: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ educationid: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ educationid: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ educationid: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ educationid: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ educationid: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ educationid: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ educationid: rid }],
    };

  } else {
    query = {
      $and: [{ educationid: rid }],
    };
  }
  // if (tagobj.catval) {
  //   query.categoryid = tagobj.catval;
  // }
  // if (tagobj.rval) {
  //   query.religionid = tagobj.rval;
  // }
  // if (tagobj.vehicalval) {
  //   query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
  //   // "vehicals": { $regex: `${rid}`, $options: "m" }
  // }
  // if (tagobj.cardval) {
  //   query.card_type = tagobj.cardval;
  // }
  // if (tagobj.ecoval) {
  //   query.economics_condition = tagobj.ecoval;
  // }
  //voter wise
  if (tagobj.edval) {
    query.educationid = tagobj.edval;
  }
  if (tagobj.prval) {
    query.professionid = tagobj.prval;
  }
  if (tagobj.gval) {
    query.gender = tagobj.gval;
  }
  if (tagobj.partyval) {
    query.partyid = tagobj.partyval;
  }
  if (tagobj.ageval) {
    let params2, params1 = 0;
    if (tagobj.ageval === 1) { params2 = 12; params1 = 0 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }

    let newobj = {}
    if (tagobj.ageval === 1) {
      newobj = { $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }] };
    } else {
      newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
    }
    query.$and = [...query.$and, ...newobj.$and];
    // query.card_type = tagobj.cardval;
  }
  const agegroup = await Surveyvoter.countDocuments(query);
  return agegroup;
}
async function getProfessionCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ professionid: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ professionid: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ professionid: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ professionid: rid }],
    };

  } else {
    query = {
      $and: [{ professionid: rid }],
    };
  }
  // if (tagobj.catval) {
  //   query.categoryid = tagobj.catval;
  // }
  // if (tagobj.rval) {
  //   query.religionid = tagobj.rval;
  // }
  // if (tagobj.vehicalval) {
  //   query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
  //   // "vehicals": { $regex: `${rid}`, $options: "m" }
  // }
  // if (tagobj.cardval) {
  //   query.card_type = tagobj.cardval;
  // }
  // if (tagobj.ecoval) {
  //   query.economics_condition = tagobj.ecoval;
  // }
  //voter wise
  if (tagobj.edval) {
    query.educationid = tagobj.edval;
  }
  if (tagobj.prval) {
    query.professionid = tagobj.prval;
  }
  if (tagobj.gval) {
    query.gender = tagobj.gval;
  }
  if (tagobj.partyval) {
    query.partyid = tagobj.partyval;
  }
  if (tagobj.ageval) {
    let params2, params1 = 0;
    if (tagobj.ageval === 1) { params2 = 12; params1 = 0 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }

    let newobj = {}
    if (tagobj.ageval === 1) {
      newobj = { $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }] };
    } else {
      newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
    }
    query.$and = [...query.$and, ...newobj.$and];
  }
  const agegroup = await Surveyvoter.countDocuments(query);
  return agegroup;
}
async function getPartyCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ partyid: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ partyid: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ partyid: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ partyid: rid }],
    };
  } else {
    query = {
      $and: [{ partyid: rid }],
    };
  }
  // if (tagobj.catval) {
  //   query.categoryid = tagobj.catval;
  // }
  // if (tagobj.rval) {
  //   query.religionid = tagobj.rval;
  // }
  // if (tagobj.vehicalval) {
  //   query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
  //   // "vehicals": { $regex: `${rid}`, $options: "m" }
  // }
  // if (tagobj.cardval) {
  //   query.card_type = tagobj.cardval;
  // }
  // if (tagobj.ecoval) {
  //   query.economics_condition = tagobj.ecoval;
  // }
  //voter wise
  if (tagobj.edval) {
    query.educationid = tagobj.edval;
  }
  if (tagobj.prval) {
    query.professionid = tagobj.prval;
  }
  if (tagobj.gval) {
    query.gender = tagobj.gval;
  }
  if (tagobj.partyval) {
    query.partyid = tagobj.partyval;
  }
  if (tagobj.ageval) {
    let params2, params1 = 0;
    if (tagobj.ageval === 1) { params2 = 12; params1 = 0 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }

    let newobj = {}
    if (tagobj.ageval === 1) {
      newobj = { $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }] };
    } else {
      newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
    }
    query.$and = [...query.$and, ...newobj.$and];
  }
  const agegroup = await Surveyvoter.countDocuments(query);
  return agegroup;
}
async function getGenderCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ gender: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ gender: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ gender: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ gender: rid }],
    };
  } else {
    query = {
      $and: [{ gender: rid }],
    };
  }
  // if (tagobj.catval) {
  //   query.categoryid = tagobj.catval;
  // }
  // if (tagobj.rval) {
  //   query.religionid = tagobj.rval;
  // }
  // if (tagobj.vehicalval) {
  //   query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
  //   // "vehicals": { $regex: `${rid}`, $options: "m" }
  // }
  // if (tagobj.cardval) {
  //   query.card_type = tagobj.cardval;
  // }
  // if (tagobj.ecoval) {
  //   query.economics_condition = tagobj.ecoval;
  // }
  //voter wise
  if (tagobj.edval) {
    query.educationid = tagobj.edval;
  }
  if (tagobj.prval) {
    query.professionid = tagobj.prval;
  }
  if (tagobj.gval) {
    query.gender = tagobj.gval;
  }
  if (tagobj.partyval) {
    query.partyid = tagobj.partyval;
  }
  if (tagobj.ageval) {
    let params2, params1 = 0;
    if (tagobj.ageval === 1) { params2 = 12; params1 = 0 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }

    let newobj = {}
    if (tagobj.ageval === 1) {
      newobj = { $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }] };
    } else {
      newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
    }
    query.$and = [...query.$and, ...newobj.$and];
  }
  const agegroup = await Surveyvoter.countDocuments(query);
  return agegroup;
}
async function getDisableVoterCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ disable_voter: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ disable_voter: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ disable_voter: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ disable_voter: rid }],
    };
  } else {
    query = {
      $and: [{ disable_voter: rid }],
    };
  }
  // if (tagobj.catval) {
  //   query.categoryid = tagobj.catval;
  // }
  // if (tagobj.rval) {
  //   query.religionid = tagobj.rval;
  // }
  // if (tagobj.vehicalval) {
  //   query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
  //   // "vehicals": { $regex: `${rid}`, $options: "m" }
  // }
  // if (tagobj.cardval) {
  //   query.card_type = tagobj.cardval;
  // }
  // if (tagobj.ecoval) {
  //   query.economics_condition = tagobj.ecoval;
  // }
  //voter wise
  if (tagobj.edval) {
    query.educationid = tagobj.edval;
  }
  if (tagobj.prval) {
    query.professionid = tagobj.prval;
  }
  if (tagobj.gval) {
    query.gender = tagobj.gval;
  }
  if (tagobj.partyval) {
    query.partyid = tagobj.partyval;
  }
  if (tagobj.ageval) {
    let params2, params1 = 0;
    if (tagobj.ageval === 1) { params2 = 12; params1 = 0 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }

    let newobj = {}
    if (tagobj.ageval === 1) {
      newobj = { $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }] };
    } else {
      newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
    }
    query.$and = [...query.$and, ...newobj.$and];
  }
  const agegroup = await Surveyvoter.countDocuments(query);
  return agegroup;
}
async function getOpoPartyWorkersVoterCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ opposite_party_worker: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ opposite_party_worker: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ opposite_party_worker: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ opposite_party_worker: rid }],
    };
  } else {
    query = {
      $and: [{ opposite_party_worker: rid }],
    };
  }
  // if (tagobj.catval) {
  //   query.categoryid = tagobj.catval;
  // }
  // if (tagobj.rval) {
  //   query.religionid = tagobj.rval;
  // }
  // if (tagobj.vehicalval) {
  //   query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
  //   // "vehicals": { $regex: `${rid}`, $options: "m" }
  // }
  // if (tagobj.cardval) {
  //   query.card_type = tagobj.cardval;
  // }
  // if (tagobj.ecoval) {
  //   query.economics_condition = tagobj.ecoval;
  // }
  //voter wise
  if (tagobj.edval) {
    query.educationid = tagobj.edval;
  }
  if (tagobj.prval) {
    query.professionid = tagobj.prval;
  }
  if (tagobj.gval) {
    query.gender = tagobj.gval;
  }
  if (tagobj.partyval) {
    query.partyid = tagobj.partyval;
  }
  if (tagobj.ageval) {
    let params2, params1 = 0;
    if (tagobj.ageval === 1) { params2 = 12; params1 = 0 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }

    let newobj = {}
    if (tagobj.ageval === 1) {
      newobj = { $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }] };
    } else {
      newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
    }
    query.$and = [...query.$and, ...newobj.$and];
    // query.card_type = tagobj.cardval;
  }
  const agegroup = await Surveyvoter.countDocuments(query);
  return agegroup;
}
async function getBoothSpeakersVoterCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ booth_speaker: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ booth_speaker: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ booth_speaker: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ booth_speaker: rid }],
    };
  } else {
    query = {
      $and: [{ booth_speaker: rid }],
    };
  }
  // if (tagobj.catval) {
  //   query.categoryid = tagobj.catval;
  // }
  // if (tagobj.rval) {
  //   query.religionid = tagobj.rval;
  // }
  // if (tagobj.vehicalval) {
  //   query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
  //   // "vehicals": { $regex: `${rid}`, $options: "m" }
  // }
  // if (tagobj.cardval) {
  //   query.card_type = tagobj.cardval;
  // }
  // if (tagobj.ecoval) {
  //   query.economics_condition = tagobj.ecoval;
  // }
  //voter wise
  if (tagobj.edval) {
    query.educationid = tagobj.edval;
  }
  if (tagobj.prval) {
    query.professionid = tagobj.prval;
  }
  if (tagobj.gval) {
    query.gender = tagobj.gval;
  }
  if (tagobj.partyval) {
    query.partyid = tagobj.partyval;
  }
  if (tagobj.ageval) {
    let params2, params1 = 0;
    if (tagobj.ageval === 1) { params2 = 12; params1 = 0 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }

    let newobj = {}
    if (tagobj.ageval === 1) {
      newobj = { $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }] };
    } else {
      newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
    }
    query.$and = [...query.$and, ...newobj.$and];
  }
  const agegroup = await Surveyvoter.countDocuments(query);
  return agegroup;
}
async function getFamilyCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid,
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid,
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid,
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid,
    };
  } else if (level === "block") {
    query = {
      blockid: levelid,
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid,
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid,
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid,
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid,
    };
  } else if (level === "state") {
    query = {
      stateid: levelid,
    };
  } else if (level === "country") {
    query = {

    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },

    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },

    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },

    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },

    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },

    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },

    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },

    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },

    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },

    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
    };
  } else if (userLevel === "national") {

  } else {

  }
  if (tagobj.catval) {
    query.categoryid = tagobj.catval;
  }
  if (tagobj.rval) {
    query.religionid = tagobj.rval;
  }
  if (tagobj.vehicalval) {
    query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
    // "vehicals": { $regex: `${rid}`, $options: "m" }
  }
  if (tagobj.cardval) {
    query.card_type = tagobj.cardval;
  }
  if (tagobj.ecoval) {
    query.economics_condition = tagobj.ecoval;
  }
  //voter wise
  // if (tagobj.edval) {
  //   query.educationid = tagobj.edval;
  // }
  // if (tagobj.prval) {
  //   query.professionid = tagobj.prval;
  // }
  // if (tagobj.gval) {
  //   query.gender = tagobj.gval;
  // }
  // if (tagobj.partyval) {
  //   query.partyid = tagobj.partyval;
  // }
  // if (tagobj.ageval) {
  //   let params2 = 0;
  //   if (tagobj.ageval === 1) { params2 = 12 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }
  //   let newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
  //   query = { ...query, ...newobj };
  //   // query.card_type = tagobj.cardval;
  // }
  const agegroup = await Surveyfamily.countDocuments(query);
  return agegroup;
}
async function getVoterCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid,
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid,
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid,
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid,
    };
  } else if (level === "block") {
    query = {
      blockid: levelid,
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid,
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid,
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid,
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid,
    };
  } else if (level === "state") {
    query = {
      stateid: levelid,
    };
  } else if (level === "country") {
    query = {

    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },

    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },

    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },

    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },

    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },

    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },

    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },

    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },

    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },

    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
    };
  } else if (userLevel === "national") {

  } else {

  }
  // if (tagobj.catval) {
  //   query.categoryid = tagobj.catval;
  // }
  // if (tagobj.rval) {
  //   query.religionid = tagobj.rval;
  // }
  // if (tagobj.vehicalval) {
  //   query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
  //   // "vehicals": { $regex: `${rid}`, $options: "m" }
  // }
  // if (tagobj.cardval) {
  //   query.card_type = tagobj.cardval;
  // }
  // if (tagobj.ecoval) {
  //   query.economics_condition = tagobj.ecoval;
  // }
  //voter wise
  if (tagobj.edval) {
    query.educationid = tagobj.edval;
  }
  if (tagobj.prval) {
    query.professionid = tagobj.prval;
  }
  if (tagobj.gval) {
    query.gender = tagobj.gval;
  }
  if (tagobj.partyval) {
    query.partyid = tagobj.partyval;
  }
  if (tagobj.ageval) {
    let params2, params1 = 0;
    if (tagobj.ageval === 1) { params2 = 12; params1 = 0 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }

    let newobj = {}
    if (tagobj.ageval === 1) {
      newobj = { $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }] };
    } else {
      newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
    }
    query.$and = [...query.$and, ...newobj.$and];
    // query.card_type = tagobj.cardval;
  }
  const agegroup = await Surveyvoter.countDocuments(query);
  return agegroup;
}
async function getTotalUsersCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid,
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid,
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid,
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid,
    };
  } else if (level === "block") {
    query = {
      blockid: levelid,
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid,
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid,
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid,
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid,
    };
  } else if (level === "state") {
    query = {
      stateid: levelid,
    };
  } else if (level === "country") {
    query = {

    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },

    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },

    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },

    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },

    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },

    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },

    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },

    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },

    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },

    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },

    };
  } else if (userLevel === "national") {
    query = {

    };
  } else {

  }
  const agegroup = await User.countDocuments(query);
  return agegroup;
}

async function getRasanCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ card_type: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ card_type: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ card_type: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ card_type: rid }],
    };
  } else {
    query = {
      $and: [{ card_type: rid }],
    };
  }
  if (tagobj.catval) {
    query.categoryid = tagobj.catval;
  }
  if (tagobj.rval) {
    query.religionid = tagobj.rval;
  }
  if (tagobj.vehicalval) {
    query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
    // "vehicals": { $regex: `${rid}`, $options: "m" }
  }
  if (tagobj.cardval) {
    query.card_type = tagobj.cardval;
  }
  if (tagobj.ecoval) {
    query.economics_condition = tagobj.ecoval;
  }
  //voter wise
  // if (tagobj.edval) {
  //   query.educationid = tagobj.edval;
  // }
  // if (tagobj.prval) {
  //   query.professionid = tagobj.prval;
  // }
  // if (tagobj.gval) {
  //   query.gender = tagobj.gval;
  // }
  // if (tagobj.partyval) {
  //   query.partyid = tagobj.partyval;
  // }
  // if (tagobj.ageval) {
  //   let params2 = 0;
  //   if (tagobj.ageval === 1) { params2 = 12 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }
  //   let newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
  //   query = { ...query, ...newobj };
  //   // query.card_type = tagobj.cardval;
  // }
  const agegroup = await Surveyfamily.countDocuments(query);
  return agegroup;
}

async function getEconomicConditionCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ economics_condition: rid }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ economics_condition: rid }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ economics_condition: rid }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ economics_condition: rid }],
    };
  } else {
    query = {
      $and: [{ economics_condition: rid }],
    };
  }
  if (tagobj.catval) {
    query.categoryid = tagobj.catval;
  }
  if (tagobj.rval) {
    query.religionid = tagobj.rval;
  }
  if (tagobj.vehicalval) {
    query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
    // "vehicals": { $regex: `${rid}`, $options: "m" }
  }
  if (tagobj.cardval) {
    query.card_type = tagobj.cardval;
  }
  if (tagobj.ecoval) {
    query.economics_condition = tagobj.ecoval;
  }
  //voter wise
  // if (tagobj.edval) {
  //   query.educationid = tagobj.edval;
  // }
  // if (tagobj.prval) {
  //   query.professionid = tagobj.prval;
  // }
  // if (tagobj.gval) {
  //   query.gender = tagobj.gval;
  // }
  // if (tagobj.partyval) {
  //   query.partyid = tagobj.partyval;
  // }
  // if (tagobj.ageval) {
  //   let params2 = 0;
  //   if (tagobj.ageval === 1) { params2 = 12 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }
  //   let newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
  //   query = { ...query, ...newobj };
  //   // query.card_type = tagobj.cardval;
  // }
  const agegroup = await Surveyfamily.countDocuments(query);
  return agegroup;
}
async function getVehicalCountByid(rid, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };

  } else if (level === "booth") {
    query = {
      boothid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (level === "block") {
    query = {
      blockid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (level === "state") {
    query = {
      stateid: levelid, $and: [{ gender: rid }],
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (level === "country") {
    query = {
      // vehicals: { $regex: /.rid./, $options: "m" },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else if (userLevel === "national") {
    query = {
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };
  } else {
    query = {
      "vehicals": { $regex: `${rid}`, $options: "m" }
    };

  }
  if (tagobj.catval) {
    query.categoryid = tagobj.catval;
  }
  if (tagobj.rval) {
    query.religionid = tagobj.rval;
  }
  if (tagobj.vehicalval) {
    let newobj = {
      $and: [{
        "vehicals": { $regex: `${tagobj.vehicalval}`, $options: "m" },
      }]
    };
    query = { ...query, ...newobj };
    // query.vehicals = { $regex: `${tagobj.vehicalval}`, $options: "m" };
    // "vehicals": { $regex: `${rid}`, $options: "m" }
  }
  if (tagobj.cardval) {
    query.card_type = tagobj.cardval;
  }
  if (tagobj.ecoval) {
    query.economics_condition = tagobj.ecoval;
  }
  //voter wise
  // if (tagobj.edval) {
  //   query.educationid = tagobj.edval;
  // }
  // if (tagobj.prval) {
  //   query.professionid = tagobj.prval;
  // }
  // if (tagobj.gval) {
  //   query.gender = tagobj.gval;
  // }
  // if (tagobj.partyval) {
  //   query.partyid = tagobj.partyval;
  // }
  // if (tagobj.ageval) {
  //   let params2 = 0;
  //   if (tagobj.ageval === 1) { params2 = 12 } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }
  //   let newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
  //   query = { ...query, ...newobj };
  //   // query.card_type = tagobj.cardval;
  // }

  const agegroup = await Surveyfamily.countDocuments(query);
  return agegroup;
}
async function getageCountByid(params1, params2, level, levelid, tagobj) {
  var query = {};
  if (level === "ward") {
    query = {
      wardid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "booth") {
    query = {
      boothid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "sector") {
    query = {
      sectorid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "zone") {
    query = {
      zoneid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "block") {
    query = {
      blockid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "nikay") {
    query = {
      nikayid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "vidhansabha") {
    query = {
      vidhansabhaid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "jila") {
    query = {
      jilaid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "loksabha") {
    query = {
      loksabhaid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "state") {
    query = {
      stateid: levelid,
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (level === "country") {
    query = {
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "booth") {
    query = {
      boothid: {
        $in: userData.boothid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "sector") {
    query = {
      sectorid: {
        $in: userData.sectorid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "zone") {
    query = {
      zoneid: {
        $in: userData.zoneid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "block") {
    query = {
      blockid: {
        $in: userData.blockid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "vidhansabha") {
    query = {
      vidhansabhaid: {
        $in: userData.vidhansabhaid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "loksabha") {
    query = {
      loksabhaid: {
        $in: userData.loksabhaid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };

  } else if (userLevel === "ward") {
    query = {
      wardid: {
        $in: userData.wardid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "nigam") {
    query = {
      nikayid: {
        $in: userData.nikayid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "jila") {
    query = {
      jilaid: {
        $in: userData.jilaid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "state") {
    query = {
      stateid: {
        $in: userData.stateid
      },
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else if (userLevel === "national") {
    query = {
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  } else {
    query = {
      $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
    };
  }

  if (tagobj.edval) {
    query.educationid = tagobj.edval;
  }
  if (tagobj.prval) {
    query.professionid = tagobj.prval;
  }
  if (tagobj.gval) {
    query.gender = tagobj.gval;
  }
  if (tagobj.partyval) {
    query.partyid = tagobj.partyval;
  }
  if (tagobj.ageval) {
    // console.log(tagobj.ageval, "ageval");
    let params2 = 0;
    let params1 = 0;
    if (tagobj.ageval === 1) { params2 = 12; params1 = 0; } else if (tagobj.ageval === 13) { params2 = 17 } else if (tagobj.ageval === 18) { params2 = 20 } else if (tagobj.ageval === 21) { params2 = 30 } else if (tagobj.ageval === 31) { params2 = 40 } else if (tagobj.ageval === 41) { params2 = 50 } else if (tagobj.ageval === 51) { params2 = 60 } else if (tagobj.ageval === 61) { params2 = 70 } else if (tagobj.ageval === 71) { params2 = 150 }
    let newobj = {}
    if (tagobj.ageval === 1) {
      newobj = { $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }] };
    } else {
      newobj = { $and: [{ age: { $gte: tagobj.ageval } }, { age: { $lte: params2 } }] };
    }

    query.$and = [...query.$and, ...newobj.$and];
  }
  // console.log("age query", JSON.stringify(query));
  const agegroup = await Surveyvoter.countDocuments(query);
  return agegroup;
}
exports.countswise = async (req, res, next) => {
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
      ageval,
      catval,
      rval,
      cval,
      edval,
      partyval,
      prval,
      gval,
      cardval,
      ecoval,
      vehicalval,
    } = req.body;
    var tagobj = {
      ageval: ageval,
      catval: catval,
      rval: rval,
      cval: cval,
      edval: edval,
      partyval: partyval,
      prval: prval,
      gval: gval,
      cardval: cardval,
      ecoval: ecoval,
      vehicalval: vehicalval,
    }
    outerLang = lang;
    // console.log(req.body);
    if (username) {
      if (username !== undefined || username !== null || username !== '') {
        console.log(username, "username");
        const users = await User.findOne({ mobile: username });

        if (users.length === 0) {
          return next(new creatError(401, "User not found"));
        }
        const rolesaccess = await User_role.findOne(
          { id: users.role },
          {
            _id: 0,
            id: 1,
            role_en: 1,
            role: `$role_${lang}`,
            level: 1,
            role_type: 1,
            app_type: 1,
            add: 1,
            delete: 1,
            edit: 1,
            view: 1,
          }
        );
        userLevel = rolesaccess.level;

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
        var totalusercounts = 1;
        var totalfamilycounts = 1;
        var totaldisablevotercounts = 1;
        var totaloppositeworkercounts = 1;
        var totalvotercounts = 1;
        var totalspeakercounts = 1;
        var arrReligionname = [];
        var arrReligioncount = [];
        var arrCategoryname = [];
        var arrCategorycount = [];
        var arrCastename = [];
        var arrCastecount = [];
        var arrEducationname = [];
        var arrEducationcount = [];
        var arrProfessionname = [];
        var arrProfessioncount = [];
        var arrPartyname = [];
        var arrPartycount = [];
        var arrGendername = ["Male", "Female"];
        var arrGendercount = [];
        var arrRasanname = ["Apl", "BPL", "Atd"];
        var arrRasancount = [];
        var arrEconomicname = ["कमजोर", "मध्यम", "मजबूत"];
        var arrEconomiccount = [];
        var arrVehicalname = ["2wheel", "4wheel", "cycle"];
        var arrVehicalcount = [];
        var arrAgename = ["1-12", "13-17", "18-20", "21-30", "31-40", "41-50", "51-60", "61-70", "70+"];
        var arrAgecount = [];

        if (wardid >= 1) {
          // console.log(JSON.stringify(levels));
          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "ward", wardid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "ward", wardid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("ward", wardid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "ward", wardid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "ward", wardid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "ward", wardid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          totalusercounts = await getTotalUsersCountByid(1, "ward", wardid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "ward", wardid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "ward", wardid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "ward", wardid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "ward", wardid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "ward", wardid, tagobj);
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "ward", wardid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "ward", wardid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "ward", wardid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "ward", wardid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "ward", wardid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "ward", wardid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "ward", wardid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "ward", wardid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "ward", wardid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "ward", wardid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "ward", wardid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "ward", wardid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "ward", wardid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "ward", wardid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "ward", wardid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "ward", wardid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "ward", wardid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "ward", wardid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "ward", wardid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "ward", wardid, tagobj);
        } else if (boothid >= 1) {
          totalusercounts = await getTotalUsersCountByid(1, "booth", boothid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "booth", boothid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "booth", boothid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "booth", boothid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "booth", boothid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "booth", boothid, tagobj);

          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "booth", boothid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "booth", boothid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("booth", boothid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "booth", boothid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "booth", boothid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "booth", boothid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "booth", boothid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "booth", boothid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "booth", boothid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "booth", boothid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "booth", boothid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "booth", boothid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "booth", boothid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "booth", boothid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "booth", boothid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "booth", boothid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "booth", boothid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "booth", boothid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "booth", boothid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "booth", boothid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "booth", boothid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "booth", boothid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "booth", boothid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "booth", boothid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "booth", boothid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "booth", boothid, tagobj);
        } else if (sectorid >= 1) {
          totalusercounts = await getTotalUsersCountByid(1, "sector", sectorid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "sector", sectorid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "sector", sectorid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "sector", sectorid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "sector", sectorid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "sector", sectorid, tagobj);

          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "sector", sectorid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "sector", sectorid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("sector", sectorid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "sector", sectorid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "sector", sectorid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "sector", sectorid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "sector", sectorid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "sector", sectorid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "sector", sectorid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "sector", sectorid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "sector", sectorid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "sector", sectorid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "sector", sectorid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "sector", sectorid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "sector", sectorid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "sector", sectorid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "sector", sectorid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "sector", sectorid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "sector", sectorid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "sector", sectorid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "sector", sectorid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "sector", sectorid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "sector", sectorid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "sector", sectorid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "sector", sectorid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "sector", sectorid, tagobj);
        } else if (zoneid >= 1) {
          totalusercounts = await getTotalUsersCountByid(1, "zone", zoneid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "zone", zoneid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "zone", zoneid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "zone", zoneid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "zone", zoneid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "zone", zoneid, tagobj);

          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "zone", zoneid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "zone", zoneid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("zone", zoneid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "zone", zoneid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "zone", zoneid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "zone", zoneid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "zone", zoneid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "zone", zoneid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "zone", zoneid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "zone", zoneid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "zone", zoneid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "zone", zoneid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "zone", zoneid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "zone", zoneid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "zone", zoneid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "zone", zoneid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "zone", zoneid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "zone", zoneid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "zone", zoneid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "zone", zoneid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "zone", zoneid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "zone", zoneid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "zone", zoneid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "zone", zoneid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "zone", zoneid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "zone", zoneid, tagobj);
        } else if (blockid >= 1) {
          totalusercounts = await getTotalUsersCountByid(1, "block", blockid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "block", blockid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "block", blockid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "block", blockid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "block", blockid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "block", blockid, tagobj);

          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "block", blockid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "block", blockid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("block", blockid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "block", blockid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "block", blockid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "block", blockid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "block", blockid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "block", blockid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "block", blockid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "block", blockid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "block", blockid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "block", blockid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "block", blockid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "block", blockid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "block", blockid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "block", blockid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "block", blockid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "block", blockid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "block", blockid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "block", blockid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "block", blockid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "block", blockid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "block", blockid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "block", blockid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "block", blockid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "block", blockid, tagobj);
        } else if (vidhansabhaid >= 1) {
          totalusercounts = await getTotalUsersCountByid(1, "vidhansabha", vidhansabhaid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "vidhansabha", vidhansabhaid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "vidhansabha", vidhansabhaid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "vidhansabha", vidhansabhaid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "vidhansabha", vidhansabhaid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "vidhansabha", vidhansabhaid, tagobj);

          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "vidhansabha", vidhansabhaid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "vidhansabha", vidhansabhaid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("vidhansabha", vidhansabhaid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "vidhansabha", vidhansabhaid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "vidhansabha", vidhansabhaid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "vidhansabha", vidhansabhaid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "vidhansabha", vidhansabhaid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "vidhansabha", vidhansabhaid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "vidhansabha", vidhansabhaid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "vidhansabha", vidhansabhaid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "vidhansabha", vidhansabhaid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "vidhansabha", vidhansabhaid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "vidhansabha", vidhansabhaid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "vidhansabha", vidhansabhaid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "vidhansabha", vidhansabhaid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "vidhansabha", vidhansabhaid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "vidhansabha", vidhansabhaid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "vidhansabha", vidhansabhaid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "vidhansabha", vidhansabhaid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "vidhansabha", vidhansabhaid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "vidhansabha", vidhansabhaid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "vidhansabha", vidhansabhaid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "vidhansabha", vidhansabhaid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "vidhansabha", vidhansabhaid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "vidhansabha", vidhansabhaid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "vidhansabha", vidhansabhaid, tagobj);
        } else if (loksabhaid >= 1) {
          totalusercounts = await getTotalUsersCountByid(1, "loksabha", loksabhaid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "loksabha", loksabhaid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "loksabha", loksabhaid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "loksabha", loksabhaid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "loksabha", loksabhaid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "loksabha", loksabhaid, tagobj);

          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "loksabha", loksabhaid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "loksabha", loksabhaid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("loksabha", loksabhaid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "loksabha", loksabhaid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "loksabha", loksabhaid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "loksabha", loksabhaid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "loksabha", loksabhaid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "loksabha", loksabhaid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "loksabha", loksabhaid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "loksabha", loksabhaid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "loksabha", loksabhaid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "loksabha", loksabhaid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "loksabha", loksabhaid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "loksabha", loksabhaid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "loksabha", loksabhaid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "loksabha", loksabhaid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "loksabha", loksabhaid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "loksabha", loksabhaid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "loksabha", loksabhaid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "loksabha", loksabhaid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "loksabha", loksabhaid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "loksabha", loksabhaid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "loksabha", loksabhaid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "loksabha", loksabhaid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "loksabha", loksabhaid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "loksabha", loksabhaid, tagobj);
        } else if (nikayid >= 1) {
          totalusercounts = await getTotalUsersCountByid(1, "nikay", nikayid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "nikay", nikayid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "nikay", nikayid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "nikay", nikayid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "nikay", nikayid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "nikay", nikayid, tagobj);

          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "nikay", nikayid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "nikay", nikayid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("nikay", nikayid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "nikay", nikayid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "nikay", nikayid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "nikay", nikayid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "nikay", nikayid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "nikay", nikayid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "nikay", nikayid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "nikay", nikayid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "nikay", nikayid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "nikay", nikayid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "nikay", nikayid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "nikay", nikayid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "nikay", nikayid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "nikay", nikayid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "nikay", nikayid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "nikay", nikayid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "nikay", nikayid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "nikay", nikayid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "nikay", nikayid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "nikay", nikayid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "nikay", nikayid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "nikay", nikayid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "nikay", nikayid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "nikay", nikayid, tagobj);
        } else if (jilaid >= 1) {
          totalusercounts = await getTotalUsersCountByid(1, "jila", jilaid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "jila", jilaid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "jila", jilaid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "jila", jilaid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "jila", jilaid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "jila", jilaid, tagobj);

          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "jila", jilaid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "jila", jilaid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("jila", jilaid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "jila", jilaid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "jila", jilaid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "jila", jilaid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "jila", jilaid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "jila", jilaid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "jila", jilaid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "jila", jilaid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "jila", jilaid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "jila", jilaid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "jila", jilaid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "jila", jilaid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "jila", jilaid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "jila", jilaid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "jila", jilaid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "jila", jilaid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "jila", jilaid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "jila", jilaid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "jila", jilaid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "jila", jilaid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "jila", jilaid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "jila", jilaid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "jila", jilaid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "jila", jilaid, tagobj);
        } else if (stateid >= 1) {
          totalusercounts = await getTotalUsersCountByid(1, "state", stateid, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "state", stateid, tagobj);
          totalvotercounts = await getVoterCountByid(1, "state", stateid, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "state", stateid, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "state", stateid, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "state", stateid, tagobj);

          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "state", stateid, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "state", stateid, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          ); // caste
          const allCaste = await getCasteCountByid("state", stateid, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "state", stateid, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          );
          // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "state", stateid, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );      // Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "state", stateid, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "state", stateid, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "state", stateid, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "state", stateid, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "state", stateid, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "state", stateid, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "state", stateid, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "state", stateid, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "state", stateid, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "state", stateid, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "state", stateid, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "state", stateid, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "state", stateid, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "state", stateid, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "state", stateid, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "state", stateid, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "state", stateid, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "state", stateid, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "state", stateid, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "state", stateid, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "state", stateid, tagobj);
        } else if (countryid >= 1) {
          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "country", 1, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "country", 1, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          );// caste
          const allCaste = await getCasteCountByid("country", 1, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "country", 1, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          ); // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "country", 1, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );// Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "country", 1, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          totalusercounts = await getTotalUsersCountByid(1, "country", 1, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "country", 1, tagobj);
          totalvotercounts = await getVoterCountByid(1, "country", 1, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "country", 1, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "country", 1, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "country", 1, tagobj);
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "country", 1, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "country", 1, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "country", 1, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "country", 1, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "country", 1, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "country", 1, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "country", 1, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "country", 1, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "country", 1, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "country", 1, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "country", 1, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "country", 1, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "country", 1, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "country", 1, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "country", 1, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "country", 1, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "country", 1, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "country", 1, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "country", 1, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "country", 1, tagobj);

        } else {
          const allReligions = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                religionname: `$religion_${lang}`,
                religion_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalreligion = await Promise.all(
            allReligions.map(async (values, index) => {
              const r1 = await getCountByid(index + 1, "", 0, tagobj);
              arrReligioncount[index] = r1;
              return 0;
            })
          );// category
          const allCategory = await Religion.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                categoryname: `$category_${lang}`,
                category_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalcategory = await Promise.all(
            allCategory.map(async (values, index) => {
              const r1 = await getCategoryCountByid(index + 1, "", 0, tagobj);
              arrCategorycount[index] = r1;
              return 0;
            })
          );// caste
          const allCaste = await getCasteCountByid("", 0, tagobj);
          const finalCaste = await Promise.all(
            allCaste.map(async (values, index) => {
              // console.log(values)
              arrCastename[index] = values.result.caste;
              arrCastecount[index] = values.count;
              return 0;
            })
          );// Education
          const allEducation = await Education.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finaleducation = await Promise.all(
            allEducation.map(async (values, index) => {
              const r1 = await getEducationCountByid(index + 1, "", 0, tagobj);
              arrEducationcount[index] = r1;
              return 0;
            })
          ); // Profession
          const allProfession = await Profession.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalProfession = await Promise.all(
            allProfession.map(async (values, index) => {
              const r1 = await getProfessionCountByid(index + 1, "", 0, tagobj);
              arrProfessioncount[index] = r1;
              return 0;
            })
          );// Party
          const allParty = await Party.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                educationname: `$education_${lang}`,
                education_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);
          const finalParty = await Promise.all(
            allParty.map(async (values, index) => {
              const r1 = await getPartyCountByid(index + 1, "", 0, tagobj);
              arrPartycount[index] = r1;
              return 0;
            })
          );
          totalusercounts = await getTotalUsersCountByid(1, "", 0, tagobj);
          totalfamilycounts = await getFamilyCountByid(1, "", 0, tagobj);
          totalvotercounts = await getVoterCountByid(1, "", 0, tagobj);
          totaldisablevotercounts = await getDisableVoterCountByid(1, "", 0, tagobj);
          totaloppositeworkercounts = await getOpoPartyWorkersVoterCountByid(1, "", 0, tagobj);
          totalspeakercounts = await getBoothSpeakersVoterCountByid(1, "", 0, tagobj);
          //gender count
          arrGendercount[0] = await getGenderCountByid(1, "", 0, tagobj);
          arrGendercount[1] = await getGenderCountByid(2, "", 0, tagobj);
          //rasan_card count
          arrRasancount[0] = await getRasanCountByid(1, "", 0, tagobj);
          arrRasancount[1] = await getRasanCountByid(2, "", 0, tagobj);
          arrRasancount[2] = await getRasanCountByid(3, "", 0, tagobj);
          //economic_condition count
          arrEconomiccount[0] = await getEconomicConditionCountByid(1, "", 0, tagobj);
          arrEconomiccount[1] = await getEconomicConditionCountByid(2, "", 0, tagobj);
          arrEconomiccount[2] = await getEconomicConditionCountByid(3, "", 0, tagobj);
          //avl count
          arrVehicalcount[0] = await getVehicalCountByid(1, "", 0, tagobj);
          arrVehicalcount[1] = await getVehicalCountByid(2, "", 0, tagobj);
          arrVehicalcount[2] = await getVehicalCountByid(3, "", 0, tagobj);
          //age wise
          arrAgecount[0] = await getageCountByid(0, 12, "", 0, tagobj);
          arrAgecount[1] = await getageCountByid(13, 17, "", 0, tagobj);
          arrAgecount[2] = await getageCountByid(18, 20, "", 0, tagobj);
          arrAgecount[3] = await getageCountByid(21, 30, "", 0, tagobj);
          arrAgecount[4] = await getageCountByid(31, 40, "", 0, tagobj);
          arrAgecount[5] = await getageCountByid(41, 50, "", 0, tagobj);
          arrAgecount[6] = await getageCountByid(51, 60, "", 0, tagobj);
          arrAgecount[7] = await getageCountByid(61, 70, "", 0, tagobj);
          arrAgecount[8] = await getageCountByid(71, 80, "", 0, tagobj);
        }
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          counts: 1,
          totalusercounts: totalusercounts,
          totalfamilycounts: totalfamilycounts,
          totalvotercounts: totalvotercounts,
          totaldisablevotercounts: totaldisablevotercounts,
          totaloppositeworkercounts: totaloppositeworkercounts,
          totalspeakercounts: totalspeakercounts,
          religion: {
            count: arrReligioncount,
            lable: arrReligionname,
          },
          category: {
            count: arrCategorycount,
            lable: arrCategoryname,
          },
          age: {
            count: arrAgecount,
            lable: arrAgename,
          },
          education: {
            count: arrEducationcount,
            lable: arrEducationname,
          },
          profession: {
            count: arrProfessioncount,
            lable: arrProfessionname,
          },
          party: {
            count: arrPartycount,
            lable: arrPartyname,
          },
          gender: {
            count: arrGendercount,
            lable: arrGendername,
          },
          vehical: {
            count: arrVehicalcount,
            lable: arrVehicalname,
          },
          rasan: {
            count: arrRasancount,
            lable: arrRasanname,
          },
          economic: {
            count: arrEconomiccount,
            lable: arrEconomicname,
          },

          caste: {
            count: arrCastecount,
            lable: arrCastename,
          },
        });
        //
      }
    }
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
