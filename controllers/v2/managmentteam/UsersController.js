var mongoose = require("mongoose");
const Booth = require("../../../models/boothModel");
const Block = require("../../../models/blockModel");
const Vidhansabha = require("../../../models/vidhansabhaModel");
const Jila = require("../../../models/jilaModel");
const Loksabha = require("../../../models/loksabhaModel");
const State = require("../../../models/stateModel");
const Nikay = require("../../../models/nikayModel");
const Ward = require("../../../models/wardModel");
const Zone = require("../../../models/zoneModel");
const Sector = require("../../../models/sectorModel");
const Familysurvey = require("../../../models/surveyfamilyModel");
const Generalnews = require("../../../models/generalnewsModel");
const Suggestion = require("../../../models/suggestionModel");

const creatError = require("../../../utils/appError");
const Surveyfamily = require("../../../models/surveyfamilyModel");
const Surveyvoter = require("../../../models/surveyvoterModel");
const Education = require("../../../models/educationModel");
const Profession = require("../../../models/professionModel");
const Party = require("../../../models/party");
const Gender = require("../../../models/genderModel");
const User_role = require("../../../models/UserroleModel");
const User = require("../../../models/userModel");
const Surveyproblem = require("../../../models/surveyproblemsModel");
const Surveyboothvoter = require("../../../models/surveyboothvoterModel");
const VehiclesOwner = require("../../../models/vehicleownerModel");
const Vehicles = require("../../../models/vehiclesModel");

exports.usersbypost = async (req, res, next) => {
  try {
    var user = [];
    var counts = 0;
    var matchData = {};
    var {
      lang,
      stateid,
      loksabha,
      jila,
      vidhansabha,
      block,
      booth,
      zone,
      sector,
      nikay,
      ward,
      roleid,
      app_type,
      datatype,
      limit,
      skip,
      username,
    } = req.body;
    nikay = parseInt(nikay);
    ward = parseInt(ward);
    block = parseInt(block);
    vidhansabha = parseInt(vidhansabha);
    loksabha = parseInt(loksabha);
    jila = parseInt(jila);
    stateid = parseInt(stateid);
    booth = parseInt(booth);
    zone = parseInt(zone);
    sector = parseInt(sector);
    roleid = parseInt(roleid);
    var lang1 = lang;
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const users = await User.findOne({ mobile: username });
    if (!users) {
      return next(new creatError("User can't exists", 400));
    }
    const accessstate = users.stateid;
    const accessjila = users.jilaid;
    const accessloksabha = users.loksabhaid;
    const accessvidhansabha = users.vidhansabhaid;
    const accessblock = users.blockid;
    const accessbooth = users.boothid;
    const accesszone = users.zoneid;
    const accesssector = users.sectorid;
    const accesspost = users.role;
    const accessnikay = users.nikayid;
    const accessward = users.wardid;

    const array = accessstate;
    // console.log(array);
    if (booth > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            boothid: booth,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (sector > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            sectorid: sector,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (zone > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            zoneid: zone,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (block > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            blockid: block,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (vidhansabha > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            vidhansabhaid: vidhansabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (ward > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            wardid: ward,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (nikay > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            nikayid: nikay,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (jila > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            jilaid: jila,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (loksabha > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            loksabhaid: loksabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (stateid > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            stateid: stateid,
          },
          {
            status: "0",
          },
        ],
      };
    }
    // national id
    // block ids
    //search
    if (req.body.search) {
      let newobj = {
        $or: [
          { mobile: req.body.search },
          { name: { $regex: req.body.search, $options: "i" } },
        ],
      };
      // Case-insensitive search
      matchData.$and.push(newobj);
    }
    // console.log(matchData);
    const usercount = await User.countDocuments(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "stateid",
          foreignField: "id",
          as: "stateData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                state_en: 1,
                state: `$state_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "loksabhas",
          localField: "loksabhaid",
          foreignField: "id",
          as: "loksabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                loksabha_en: 1,
                loksabha: `$loksabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jilas",
          localField: "jilaid",
          foreignField: "id",
          as: "jilaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                jila_en: 1,
                jila: `$jila_${lang1}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "vidhansabhas",
          localField: "vidhansabhaid",
          foreignField: "id",
          as: "vidhansabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                vidhansabha_en: 1,
                vidhansabha: `$vidhansabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "blocks",
          localField: "blockid",
          foreignField: "id",
          as: "blockData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                block_en: 1,
                block: `$block_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "zoneid",
          foreignField: "id",
          as: "zoneData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                zone_en: 1,
                zone: `$zone_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "sectors",
          localField: "sectorid",
          foreignField: "id",
          as: "sectorData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                sector_en: 1,
                sector: `$sector_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "booths",
          localField: "boothid",
          foreignField: "id",
          as: "boothData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                booth_en: 1,
                booth: `$booth_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "nikays",
          localField: "nikayid",
          foreignField: "id",
          as: "nikayData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                nikay_en: 1,
                nikay: `$nikay_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "wards",
          localField: "wardid",
          foreignField: "id",
          as: "wardData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                ward_en: 1,
                ward: `$ward_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "professions",
          localField: "profession",
          foreignField: "id",
          as: "professionData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                profession_en: 1,
                profession: `$profession_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "castes",
          localField: "caste",
          foreignField: "id",
          as: "casteData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                caste_en: 1,
                caste: `$caste_${lang}`,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name_en: 1,
          name: 1,
          father_name_en: 1,
          father_name: 1,
          address: 1,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          sr_start: 1,
          sr_end: 1,
          whatsapp: 1,
          caste: 1,
          profession: 1,
          patrol_team: 1,
          table_prabhari: 1,
          polling_agent: 1,
          speaker: 1,
          whatsapp_prabhari: 1,

          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          professionData: 1,
          casteData: 1,
          stateData: 1,
          loksabhaData: 1,
          jilaData: 1,
          vidhansabhaData: 1,
          blockData: 1,
          zoneData: 1,
          sectorData: 1,
          boothData: 1,
          nikayData: 1,
          wardData: 1,
          image: 1,
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      user: user,
      counts: usercount,
    });
  } catch (error) {
    next(error);
  }
};
exports.multyroleusers = async (req, res, next) => {
  try {
    var user = [];
    var counts = 0;
    var matchData = {};
    var {
      lang,
      stateid,
      loksabha,
      jila,
      vidhansabha,
      block,
      booth,
      zone,
      sector,
      nikay,
      ward,
      app_type,
      datatype,
      reqtype,
      limit,
      skip,
      username,
    } = req.body;
    nikay = parseInt(nikay);
    ward = parseInt(ward);
    block = parseInt(block);
    vidhansabha = parseInt(vidhansabha);
    loksabha = parseInt(loksabha);
    jila = parseInt(jila);
    stateid = parseInt(stateid);
    booth = parseInt(booth);
    zone = parseInt(zone);
    sector = parseInt(sector);
    let roleid = [37, 38, 39, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 99]; // 37 - booth it cell, 38 - booth core teem, 39 - sahayak prabhari
    var lang1 = lang;
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const users = await User.findOne({ mobile: username });
    if (!users) {
      return next(new creatError("User can't exists", 400));
    }
    const accessstate = users.stateid;
    const accessjila = users.jilaid;
    const accessloksabha = users.loksabhaid;
    const accessvidhansabha = users.vidhansabhaid;
    const accessblock = users.blockid;
    const accessbooth = users.boothid;
    const accesszone = users.zoneid;
    const accesssector = users.sectorid;
    const accesspost = users.role;
    const accessnikay = users.nikayid;
    const accessward = users.wardid;

    const array = accessstate;
    // console.log(array);
    if (booth > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            boothid: booth,
          },

          {
            status: "0",
          },
        ],
      };
    } else if (sector > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            sectorid: sector,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (zone > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            zoneid: zone,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (block > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            blockid: block,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (vidhansabha > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            vidhansabhaid: vidhansabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (ward > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            wardid: ward,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (nikay > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            nikayid: nikay,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (jila > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            jilaid: jila,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (loksabha > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            loksabhaid: loksabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (stateid > 0) {
      matchData = {
        $and: [
          {
            role: { $in: roleid },
          },
          {
            stateid: stateid,
          },
          {
            status: "0",
          },
        ],
      };
    }
    // national id
    // block ids
    //search reqtype="whatsapp_prabhari", "patrol_team", "table_prabhari", "polling_agent", "speaker"
    // whatsapp prabhari role = ws, patrolteam role = pt, table prabhari role = tp, polling agent role = pa, speaker role = bs

    if (reqtype == "ws") {
      let newpush = {
        whatsapp_prabhari: 1,
      };
      matchData.$and.push(newpush);
    } else if (reqtype == "pt") {
      let newpush = {
        patrol_team: 1,
      };
      matchData.$and.push(newpush);
    } else if (reqtype == "tp") {
      let newpush = {
        table_prabhari: 1,
      };
      matchData.$and.push(newpush);
    } else if (reqtype == "pa") {
      let newpush = {
        polling_agent: 1,
      };
      matchData.$and.push(newpush);
    } else if (reqtype == "bs") {
      let newpush = {
        speaker: 1,
      };
      matchData.$and.push(newpush);
    } else {
      res.status(400).json({
        success: false,
        status: "error",
        message: "Invalid request type",
      });
    }
    if (req.body.search) {
      let newobj = {
        $or: [
          { mobile: req.body.search },
          { name: { $regex: req.body.search, $options: "i" } },
        ],
      };
      // Case-insensitive search
      matchData.$and.push(newobj);
    }
    // console.log(matchData);
    const usercount = await User.countDocuments(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "stateid",
          foreignField: "id",
          as: "stateData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                state_en: 1,
                state: `$state_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "loksabhas",
          localField: "loksabhaid",
          foreignField: "id",
          as: "loksabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                loksabha_en: 1,
                loksabha: `$loksabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jilas",
          localField: "jilaid",
          foreignField: "id",
          as: "jilaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                jila_en: 1,
                jila: `$jila_${lang1}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "vidhansabhas",
          localField: "vidhansabhaid",
          foreignField: "id",
          as: "vidhansabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                vidhansabha_en: 1,
                vidhansabha: `$vidhansabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "blocks",
          localField: "blockid",
          foreignField: "id",
          as: "blockData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                block_en: 1,
                block: `$block_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "zoneid",
          foreignField: "id",
          as: "zoneData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                zone_en: 1,
                zone: `$zone_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "sectors",
          localField: "sectorid",
          foreignField: "id",
          as: "sectorData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                sector_en: 1,
                sector: `$sector_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "booths",
          localField: "boothid",
          foreignField: "id",
          as: "boothData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                booth_en: 1,
                booth: `$booth_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "nikays",
          localField: "nikayid",
          foreignField: "id",
          as: "nikayData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                nikay_en: 1,
                nikay: `$nikay_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "wards",
          localField: "wardid",
          foreignField: "id",
          as: "wardData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                ward_en: 1,
                ward: `$ward_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "professions",
          localField: "profession",
          foreignField: "id",
          as: "professionData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                profession_en: 1,
                profession: `$profession_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "castes",
          localField: "caste",
          foreignField: "id",
          as: "casteData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                caste_en: 1,
                caste: `$caste_${lang}`,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name_en: 1,
          name: 1,
          father_name_en: 1,
          father_name: 1,
          address: 1,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          sr_start: 1,
          sr_end: 1,
          whatsapp: 1,
          caste: 1,
          profession: 1,
          patrol_team: 1,
          table_prabhari: 1,
          polling_agent: 1,
          speaker: 1,
          whatsapp_prabhari: 1,

          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          professionData: 1,
          casteData: 1,
          stateData: 1,
          loksabhaData: 1,
          jilaData: 1,
          vidhansabhaData: 1,
          blockData: 1,
          zoneData: 1,
          sectorData: 1,
          boothData: 1,
          nikayData: 1,
          wardData: 1,
          image: 1,
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      user: user,
      counts: usercount,
    });
  } catch (error) {
    next(error);
  }
};
exports.usersbylevel = async (req, res, next) => {
  try {
    var user = [];
    var counts = 0;
    var matchData = {};
    var {
      lang,
      stateid,
      loksabha,
      jila,
      vidhansabha,
      block,
      booth,
      zone,
      sector,
      nikay,
      ward,
      app_type,
      datatype,
      reqtype,
      limit,
      skip,
      username,
    } = req.body;
    nikay = parseInt(nikay);
    ward = parseInt(ward);
    block = parseInt(block);
    vidhansabha = parseInt(vidhansabha);
    loksabha = parseInt(loksabha);
    jila = parseInt(jila);
    stateid = parseInt(stateid);
    booth = parseInt(booth);
    zone = parseInt(zone);
    sector = parseInt(sector);
    var lang1 = lang;
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const users = await User.findOne({ mobile: username });
    if (!users) {
      return next(new creatError("User can't exists", 400));
    }
    const accessstate = users.stateid;
    const accessjila = users.jilaid;
    const accessloksabha = users.loksabhaid;
    const accessvidhansabha = users.vidhansabhaid;
    const accessblock = users.blockid;
    const accessbooth = users.boothid;
    const accesszone = users.zoneid;
    const accesssector = users.sectorid;
    const accesspost = users.role;
    const accessnikay = users.nikayid;
    const accessward = users.wardid;

    const array = accessstate;
    // console.log(array);
    if (booth > 0) {
      matchData = {
        $and: [
          {
            boothid: booth,
          },

          {
            status: "0",
          },
        ],
      };
    } else if (sector > 0) {
      matchData = {
        $and: [
          {
            sectorid: sector,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (zone > 0) {
      matchData = {
        $and: [
          {
            zoneid: zone,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (block > 0) {
      matchData = {
        $and: [
          {
            blockid: block,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (vidhansabha > 0) {
      matchData = {
        $and: [
          {
            vidhansabhaid: vidhansabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (ward > 0) {
      matchData = {
        $and: [
          {
            wardid: ward,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (nikay > 0) {
      matchData = {
        $and: [
          {
            nikayid: nikay,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (jila > 0) {
      matchData = {
        $and: [
          {
            jilaid: jila,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (loksabha > 0) {
      matchData = {
        $and: [
          {
            loksabhaid: loksabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (stateid > 0) {
      matchData = {
        $and: [
          {
            stateid: stateid,
          },
          {
            status: "0",
          },
        ],
      };
    }
    // national id
    // block ids

    if (req.body.search) {
      let newobj = {
        $or: [
          { mobile: req.body.search },
          { name: { $regex: req.body.search, $options: "i" } },
        ],
      };
      // Case-insensitive search
      matchData.$and.push(newobj);
    }
    // console.log(matchData);
    const usercount = await User.countDocuments(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "stateid",
          foreignField: "id",
          as: "stateData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                state_en: 1,
                state: `$state_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "loksabhas",
          localField: "loksabhaid",
          foreignField: "id",
          as: "loksabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                loksabha_en: 1,
                loksabha: `$loksabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jilas",
          localField: "jilaid",
          foreignField: "id",
          as: "jilaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                jila_en: 1,
                jila: `$jila_${lang1}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "vidhansabhas",
          localField: "vidhansabhaid",
          foreignField: "id",
          as: "vidhansabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                vidhansabha_en: 1,
                vidhansabha: `$vidhansabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "blocks",
          localField: "blockid",
          foreignField: "id",
          as: "blockData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                block_en: 1,
                block: `$block_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "zoneid",
          foreignField: "id",
          as: "zoneData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                zone_en: 1,
                zone: `$zone_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "sectors",
          localField: "sectorid",
          foreignField: "id",
          as: "sectorData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                sector_en: 1,
                sector: `$sector_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "booths",
          localField: "boothid",
          foreignField: "id",
          as: "boothData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                booth_en: 1,
                booth: `$booth_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "nikays",
          localField: "nikayid",
          foreignField: "id",
          as: "nikayData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                nikay_en: 1,
                nikay: `$nikay_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "wards",
          localField: "wardid",
          foreignField: "id",
          as: "wardData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                ward_en: 1,
                ward: `$ward_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "professions",
          localField: "profession",
          foreignField: "id",
          as: "professionData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                profession_en: 1,
                profession: `$profession_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "castes",
          localField: "caste",
          foreignField: "id",
          as: "casteData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                caste_en: 1,
                caste: `$caste_${lang}`,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name_en: 1,
          name: 1,
          father_name_en: 1,
          father_name: 1,
          address: 1,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          sr_start: 1,
          sr_end: 1,
          whatsapp: 1,
          caste: 1,
          profession: 1,
          patrol_team: 1,
          table_prabhari: 1,
          polling_agent: 1,
          speaker: 1,
          whatsapp_prabhari: 1,

          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          professionData: 1,
          casteData: 1,
          stateData: 1,
          loksabhaData: 1,
          jilaData: 1,
          vidhansabhaData: 1,
          blockData: 1,
          zoneData: 1,
          sectorData: 1,
          boothData: 1,
          nikayData: 1,
          wardData: 1,
          image: 1,
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      user: user,
      counts: usercount,
    });
  } catch (error) {
    next(error);
  }
};
exports.boothlistwithfamilycounts = async (req, res, next) => {
  try {
    const { lang, limit, skip, vidhansabhaid } = req.body;

    const booths = await Booth.aggregate([
      {
        $match: {
          vidhansabha_id: parseInt(vidhansabhaid),
        },
      },
      { $sort: { id: 1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          id: 1,
          booth_en: 1,
          booth: `$booth_${lang}`,
          level: 1,
          booth_kramank: 1,
        },
      },
    ]);
    const finalData = await Promise.all(
      booths.map(async (booth) => {
        const familyTotalCount = await User.aggregate([
          {
            $match: {
              boothid: booth.id,
              assign_family: {
                $nin: [null, "", 0],
                $exists: true,
              },
            },
          },
          {
            $group: {
              _id: null,
              assign_family: { $sum: "$assign_family" },
            },
          },
          {
            $project: {
              _id: 0,
              assign_family: 1,
            },
          },
        ]);
        const prabhariList = await User.aggregate([
          {
            $match: {
              boothid: booth.id,
              role: { $in: [88] }, // 37 - booth it cell, 38 - booth core team, 39 - sahayak prabhari
            },
          },
          {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
          {
            $project: {
              _id: 1,
              name_en: 1,
              name: 1,
              default_name: `$name`,
              father_name_en: 1,
              father_name: 1,
              role: 1,
              mobile: 1,
              image: 1,
            },
          },
        ]);
        const familyCount = await Familysurvey.countDocuments({
          boothid: booth.id,
        });
        return {
          ...booth,
          family_count: familyCount,
          prabhariList: prabhariList,
          assign_family:
            familyTotalCount &&
            familyTotalCount.length > 0 &&
            familyTotalCount[0]?.assign_family
              ? familyTotalCount[0].assign_family
              : 0,
        };
      })
    );

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: finalData,
    });
  } catch (error) {
    next(error);
  }
};
