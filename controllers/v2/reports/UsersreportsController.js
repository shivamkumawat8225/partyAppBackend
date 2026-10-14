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
const { all } = require("../../../routes/exportdataRoute");
const User_role = require("../../../models/UserroleModel");
const User = require("../../../models/userModel");
const Surveyproblem = require("../../../models/surveyproblemsModel");
const Surveyboothvoter = require("../../../models/surveyboothvoterModel");

exports.contswise = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      boothid,
      sectorid,
      zoneid,
      blockid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      jilaid,
      stateid,
      countryid,
      limit,
      skip,
      app_type,
    } = req.body;
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
    blockid = parseInt(blockid);
    zoneid = parseInt(zoneid);
    sectorid = parseInt(sectorid);
    boothid = parseInt(boothid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    //

    if (wardid >= 1) {
      const allPostData = await User_role.aggregate([
        {
          $match: {
            level: { $in: ["ward"] },
          },
        },
        { $sort: { ordr: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            name: `$role_${lang}`,
            name_en: `$role_en`,
            level: 1,
          },
        },
      ]);
      const finalResult = await Promise.all(
        allPostData.map(async (mdata) => {
          const usercount = await User.countDocuments({
            role: mdata.id,
            wardid: wardid,
          });

          return {
            id: mdata.id,
            name_en: mdata.name_en,
            name: mdata.name,
            counts: usercount,
          };
        })
      );

      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: finalResult,
      });
    } else if (boothid >= 1) {
      const allPostData = await User_role.aggregate([
        {
          $match: {
            level: {
              $in: ["booth"],
            },
          },
        },
        { $sort: { ordr: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            name: `$role_${lang}`,
            name_en: `$role_en`,
            level: 1,
          },
        },
      ]);
      const finalResult = await Promise.all(
        allPostData.map(async (mdata) => {
          const usercount = await User.countDocuments({
            role: mdata.id,
            boothid: boothid,
          });

          return {
            id: mdata.id,
            name_en: mdata.name_en,
            name: mdata.name,
            counts: usercount,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: finalResult,
      });
    } else if (sectorid >= 1) {
      const allPostData = await User_role.aggregate([
        {
          $match: {
            level: {
              $in: ["booth", "sector"],
            },
          },
        },
        { $sort: { ordr: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            name: `$role_${lang}`,
            name_en: `$role_en`,
            level: 1,
          },
        },
      ]);
      const finalResult = await Promise.all(
        allPostData.map(async (mdata) => {
          const usercount = await User.countDocuments({
            role: mdata.id,
            sectorid: sectorid,
          });

          return {
            id: mdata.id,
            name_en: mdata.name_en,
            name: mdata.name,
            counts: usercount,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: finalResult,
      });
    } else if (zoneid >= 1) {
      const allPostData = await User_role.aggregate([
        {
          $match: {
            level: {
              $in: ["booth", "sector", "zone"],
            },
          },
        },
        { $sort: { ordr: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            name: `$role_${lang}`,
            name_en: `$role_en`,
            level: 1,
          },
        },
      ]);
      const finalResult = await Promise.all(
        allPostData.map(async (mdata) => {
          const usercount = await User.countDocuments({
            role: mdata.id,
            zoneid: zoneid,
          });

          return {
            id: mdata.id,
            name_en: mdata.name_en,
            name: mdata.name,
            counts: usercount,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: finalResult,
      });
    } else if (blockid >= 1) {
      const allPostData = await User_role.aggregate([
        {
          $match: {
            level: {
              $in: ["booth", "sector", "zone", "block"],
            },
          },
        },
        { $sort: { ordr: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            name: `$role_${lang}`,
            name_en: `$role_en`,
            level: 1,
          },
        },
      ]);
      const finalResult = await Promise.all(
        allPostData.map(async (mdata) => {
          const usercount = await User.countDocuments({
            role: mdata.id,
            blockid: blockid,
          });

          return {
            id: mdata.id,
            name_en: mdata.name_en,
            name: mdata.name,
            counts: usercount,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: finalResult,
      });
    } else if (vidhansabhaid >= 1) {
      const allPostData = await User_role.aggregate([
        {
          $match: {
            level: {
              $in: ["booth", "sector", "zone", "block", "vidhansabha"],
            },
          },
        },
        { $sort: { ordr: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            name: `$role_${lang}`,
            name_en: `$role_en`,
            level: 1,
          },
        },
      ]);
      const finalResult = await Promise.all(
        allPostData.map(async (mdata) => {
          const usercount = await User.countDocuments({
            role: mdata.id,
            vidhansabhaid: vidhansabhaid,
          });

          return {
            id: mdata.id,
            name_en: mdata.name_en,
            name: mdata.name,
            counts: usercount,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: finalResult,
      });
    } else if (loksabhaid >= 1) {
      const allPostData = await User_role.aggregate([
        {
          $match: {
            level: {
              $in: [
                "booth",
                "sector",
                "zone",
                "block",
                "vidhansabha",
                "loksabha",
              ],
            },
          },
        },
        { $sort: { ordr: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            name: `$role_${lang}`,
            name_en: `$role_en`,
            level: 1,
          },
        },
      ]);
      const finalResult = await Promise.all(
        allPostData.map(async (mdata) => {
          const usercount = await User.countDocuments({
            role: mdata.id,
            loksabhaid: loksabhaid,
          });

          return {
            id: mdata.id,
            name_en: mdata.name_en,
            name: mdata.name,
            counts: usercount,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: finalResult,
      });
    } else if (nikayid >= 1) {
      const allPostData = await User_role.aggregate([
        {
          $match: {
            level: { $in: ["ward", "nigam"] },
          },
        },
        { $sort: { ordr: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            name: `$role_${lang}`,
            name_en: `$role_en`,
            level: 1,
          },
        },
      ]);
      const finalResult = await Promise.all(
        allPostData.map(async (mdata) => {
          const usercount = await User.countDocuments({
            role: mdata.id,
            nikayid: nikayid,
          });

          return {
            id: mdata.id,
            name_en: mdata.name_en,
            name: mdata.name,
            counts: usercount,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: finalResult,
      });
    } else if (jilaid >= 1) {
      if (app_type === "nigam") {
        const allPostData = await User_role.aggregate([
          {
            $match: {
              level: { $in: ["ward", "nigam", "jila"] },
            },
          },
          { $sort: { ordr: 1 } },
          {
            $project: {
              _id: 0,
              id: 1,
              name: `$role_${lang}`,
              name_en: `$role_en`,
              level: 1,
            },
          },
        ]);
        const finalResult = await Promise.all(
          allPostData.map(async (mdata) => {
            const usercount = await User.countDocuments({
              role: mdata.id,
              jilaid: jilaid,
            });

            return {
              id: mdata.id,
              name_en: mdata.name_en,
              name: mdata.name,
              counts: usercount,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          data: finalResult,
        });
      } else {
        const allPostData = await User_role.aggregate([
          {
            $match: {
              level: {
                $in: [
                  "booth",
                  "sector",
                  "zone",
                  "block",
                  "vidhansabha",
                  "jila",
                ],
              },
            },
          },
          { $sort: { ordr: 1 } },
          {
            $project: {
              _id: 0,
              id: 1,
              name: `$role_${lang}`,
              name_en: `$role_en`,
              level: 1,
            },
          },
        ]);
        const finalResult = await Promise.all(
          allPostData.map(async (mdata) => {
            const usercount = await User.countDocuments({
              role: mdata.id,
              jilaid: jilaid,
            });

            return {
              id: mdata.id,
              name_en: mdata.name_en,
              name: mdata.name,
              counts: usercount,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          data: finalResult,
        });
      }
    } else if (stateid >= 1) {
      if (app_type === "nigam") {
        const allPostData = await User_role.aggregate([
          {
            $match: {
              level: { $in: ["ward", "nigam", "jila", "state"] },
            },
          },
          { $sort: { ordr: 1 } },
          {
            $project: {
              _id: 0,
              id: 1,
              name: `$role_${lang}`,
              name_en: `$role_en`,
              level: 1,
            },
          },
        ]);
        const finalResult = await Promise.all(
          allPostData.map(async (mdata) => {
            const usercount = await User.countDocuments({
              role: mdata.id,
              stateid: stateid,
            });

            return {
              id: mdata.id,
              name_en: mdata.name_en,
              name: mdata.name,
              counts: usercount,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          data: finalResult,
        });
      } else {
        const allPostData = await User_role.aggregate([
          {
            $match: {
              level: {
                $in: [
                  "booth",
                  "sector",
                  "zone",
                  "block",
                  "vidhansabha",
                  "loksabha",
                  "state",
                ],
              },
            },
          },
          { $sort: { ordr: 1 } },
          {
            $project: {
              _id: 0,
              id: 1,
              name: `$role_${lang}`,
              name_en: `$role_en`,
              level: 1,
            },
          },
        ]);
        const finalResult = await Promise.all(
          allPostData.map(async (mdata) => {
            const usercount = await User.countDocuments({
              role: mdata.id,
              stateid: stateid,
            });

            return {
              id: mdata.id,
              name_en: mdata.name_en,
              name: mdata.name,
              counts: usercount,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          data: finalResult,
        });
      }
    } else if (countryid >= 1) {
      if (app_type === "nigam") {
        const allPostData = await User_role.aggregate([
          {
            $match: {
              level: { $in: ["ward", "nigam", "jila", "state", "national"] },
            },
          },
          { $sort: { ordr: 1 } },
          {
            $project: {
              _id: 0,
              id: 1,
              name: `$role_${lang}`,
              name_en: `$role_en`,
              level: 1,
            },
          },
        ]);
        const finalResult = await Promise.all(
          allPostData.map(async (mdata) => {
            const usercount = await User.countDocuments({
              role: mdata.id,
            });

            return {
              id: mdata.id,
              name_en: mdata.name_en,
              name: mdata.name,
              counts: usercount,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          data: finalResult,
        });
      } else {
        const allPostData = await User_role.aggregate([
          {
            $match: {
              level: {
                $in: [
                  "booth",
                  "sector",
                  "zone",
                  "block",
                  "vidhansabha",
                  "loksabha",
                  "state",
                  "national",
                ],
              },
            },
          },
          { $sort: { ordr: 1 } },
          {
            $project: {
              _id: 0,
              id: 1,
              name: `$role_${lang}`,
              name_en: `$role_en`,
              level: 1,
            },
          },
        ]);
        const finalResult = await Promise.all(
          allPostData.map(async (mdata) => {
            const usercount = await User.countDocuments({
              role: mdata.id,
            });

            return {
              id: mdata.id,
              name_en: mdata.name_en,
              name: mdata.name,
              counts: usercount,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          data: finalResult,
        });
      }
    } else {
      const allPostData = await User_role.aggregate([
        {
          $match: {
            level: {
              $in: [
                "booth",
                "sector",
                "zone",
                "block",
                "vidhansabha",
                "ward",
                "nigam",
                "jila",
                "loksabha",
                "state",
                "national",
              ],
            },
          },
        },
        { $sort: { ordr: 1 } },
        { $sort: { id: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            name: `$role_${lang}`,
            name_en: `$role_en`,
            level: 1,
          },
        },
      ]);
      const finalResult = await Promise.all(
        allPostData.map(async (mdata) => {
          const usercount = await User.countDocuments({
            role: mdata.id,
          });

          return {
            id: mdata.id,
            name_en: mdata.name_en,
            name: mdata.name,
            level: mdata.level,
            counts: usercount,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: finalResult,
      });
    }

    //
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};

exports.detailswise = async (req, res, next) => {
  try {
    var {
      lang,
      boothid,
      sectorid,
      zoneid,
      blockid,
      roleid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      jilaid,
      stateid,
      countryid,
      limit,
      skip,
      app_type,
    } = req.body;
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
    roleid = parseInt(roleid);
    blockid = parseInt(blockid);
    zoneid = parseInt(zoneid);
    sectorid = parseInt(sectorid);
    boothid = parseInt(boothid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    var matchData = {};
    //
    if (!roleid) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Please Select any role ",
      });
      return;
    }
    if (wardid >= 1) {
      matchData = {
        role: roleid,
        wardid: wardid,
      };
    } else if (boothid >= 1) {
      matchData = {
        role: roleid,
        boothid: boothid,
      };
    } else if (sectorid >= 1) {
      matchData = {
        role: roleid,
        sectorid: sectorid,
      };
    } else if (zoneid >= 1) {
      matchData = {
        role: roleid,
        zoneid: zoneid,
      };
    } else if (blockid >= 1) {
      matchData = {
        role: roleid,
        blockid: blockid,
      };
    } else if (vidhansabhaid >= 1) {
      matchData = {
        role: roleid,
        vidhansabhaid: vidhansabhaid,
      };
    } else if (loksabhaid >= 1) {
      matchData = {
        role: roleid,
        loksabhaid: loksabhaid,
      };
    } else if (nikayid >= 1) {
      matchData = {
        role: roleid,
        nikayid: nikayid,
      };
    } else if (jilaid >= 1) {
      matchData = {
        role: roleid,
        jilaid: jilaid,
      };
    } else if (stateid >= 1) {
      matchData = {
        role: roleid,
        stateid: stateid,
      };
    } else if (countryid >= 1) {
      matchData = {
        role: roleid,
      };
    } else {
      matchData = {
        role: roleid,
      };
    }
    const allUserData = await User.aggregate([
      {
        $match: matchData,
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
                vidhansabha: `$vidhansabha_${lang1}`,
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
      { $sort: { _id: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          id: 1,
          name_en: 1,
          name: `$name_${lang}`,
          father_name_en: 1,
          father_name: `$father_name_${lang}`,
          mobile: 1,
          gender: 1,
          image: 1,
          entrydatetime: {
            $dateToString: { format: "%d-%m-%Y", date: "$entrydatetime" },
          },
          stateData: 1,
          loksabhaData: 1,
          vidhansabhaData: 1,
          blockData: 1,
          zoneData: 1,
          sectorData: 1,
          boothData: 1,

          jilaData: 1,
          nikayData: 1,
          wardData: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: allUserData,
    });
    //
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};

exports.boothrating = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      karyakartaid,
      zoneid,
      sectorid,
      boothid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      jilaid,
      stateid,
      countryid,
      limit,
      skip,
      app_type,
    } = req.body;
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
    blockid = parseInt(blockid);
    zoneid = parseInt(zoneid);
    sectorid = parseInt(sectorid);
    boothid = parseInt(boothid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    //

    if (karyakartaid !== "") {
      // console.log("hi karyakarta");
      const allData = await Familysurvey.aggregate([
        {
          $match: {
            userId: karyakartaid,
          },
        },
        {
          $lookup: {
            from: "surveyvoters",
            localField: "familyid",
            foreignField: "familyid",

            as: "familyhead",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$head", 1] }],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  name_en: 1,
                  sr_start: 1,
                  sr_end: 1,
                  name: `$name_${lang}`,
                  father_name_en: `$rel_name`,
                  father_name: `$rel_name_${lang}`,
                  mobile: "$mobile",
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            appoved: `$nikay_approve`,
            userId: 1,
            familyhead: 1,
            familyid: 1,
            house_no: 1,
            entrydatetime: {
              $dateToString: { format: "%d-%m-%Y", date: "$entrydatetime" },
            },
          },
        },
        { $sort: { _id: -1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        familydata: allData,
        data: [],
      });
    } else if (wardid >= 1) {
      const allData = await User.aggregate([
        {
          $match: {
            wardid: wardid,
          },
        },
        {
          $lookup: {
            from: "user_roles",
            localField: "role",
            foreignField: "id",
            as: "userrole",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  role: `$role_${lang}`,
                  role_en: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            name_en: 1,
            name: `$name_${lang}`,
            father_name_en: 1,
            father_name: `$father_name_${lang}`,
            mobile: 1,
            assign_family: 1,
            userrole: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      const finalResult = await Promise.all(
        allData.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            userId: levelss.id.toString(),
            nikay_approve: 1,
          });
          const generalnewscount = await Generalnews.countDocuments({
            userId: levelss.id.toString(),
          });
          const suggestioncount = await Suggestion.countDocuments({
            userId: levelss.id.toString(),
          });
          var complecount = (familyCount / levelss.assign_family) * 100;

          return {
            id: levelss.id,
            name: levelss.name,
            completefamilypercent: complecount.toFixed(2),
            father_name: levelss.father_name,
            assign_family: levelss.assign_family,
            mobile: levelss.mobile,
            userrole: levelss.userrole,
            compltefamilycount: familyCount,
            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        familydata: finalResult,
        data: [],
      });
    } else if (boothid >= 1) {
      const allData = await User.aggregate([
        {
          $match: {
            boothid: boothid,
          },
        },
        {
          $lookup: {
            from: "user_roles",
            localField: "role",
            foreignField: "id",
            as: "userrole",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  role: `$role_${lang}`,
                  role_en: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id",
            name_en: 1,
            name: `$name_${lang}`,
            father_name_en: 1,
            father_name: `$father_name_${lang}`,
            mobile: 1,
            sr_start: 1,
            sr_end: 1,
            assign_family: 1,
            userrole: 1,
          },
        },
        { $sort: { _id: -1 } },
      ]);
      const finalResult = await Promise.all(
        allData.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            userId: levelss.id.toString(),
            nikay_approve: 1,
          });
          const generalnewscount = await Generalnews.countDocuments({
            userId: levelss.id.toString(),
          });
          const suggestioncount = await Suggestion.countDocuments({
            userId: levelss.id.toString(),
          });
          const problemcount = await Surveyproblem.countDocuments({
            userId: levelss.id.toString(),
          });

          const surveycount = await Surveyboothvoter.aggregate([
            {
              $group: {
                _id: "$surveyid", // Group by surveyid
              },
            },
            {
              $count: "uniqueSurveyCount", // Count the number of unique surveyids
            },
          ]);
          var complecount = (familyCount / levelss.assign_family) * 100;
          //new code here
          const allsahayak = await User.aggregate([
            {
              $match: {
                boothid: boothid,
                userId: levelss.id.toString(),
              },
            },
            {
              $lookup: {
                from: "user_roles",
                localField: "role",
                foreignField: "id",
                as: "userrole",
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      WebId: "$id",
                      role: `$role_${lang}`,
                      role_en: 1,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 0,
                id: "$_id",
                name_en: 1,
                name: `$name_${lang}`,
                father_name_en: 1,
                father_name: `$father_name_${lang}`,
                mobile: 1,
                assign_family: 1,
                sr_start: 1,
                sr_end: 1,
                userrole: 1,
              },
            },
            { $sort: { _id: -1 } },
          ]);
          const karyakartafinalResult = await Promise.all(
            allsahayak.map(async (levelsss) => {
              const kfamilyCount = await Surveyfamily.countDocuments({
                userId: levelsss.id.toString(),
                nikay_approve: 1,
              });
              const kgeneralnewscount = await Generalnews.countDocuments({
                userId: levelsss.id.toString(),
              });
              const ksuggestioncount = await Suggestion.countDocuments({
                userId: levelsss.id.toString(),
              });
              const kproblemcount = await Surveyproblem.countDocuments({
                userId: levelsss.id.toString(),
              });

              const ksurveycount = await Surveyboothvoter.aggregate([
                {
                  $group: {
                    _id: "$surveyid", // Group by surveyid
                  },
                },
                {
                  $count: "uniqueSurveyCount", // Count the number of unique surveyids
                },
              ]);
              var complecount = (familyCount / levelsss.assign_family) * 100;

              return {
                id: levelsss.id,
                name: levelsss.name,
                completefamilypercent: complecount.toFixed(2),
                father_name: levelsss.father_name,
                assign_family: levelsss.assign_family,
                mobile: levelsss.mobile,
                sr_start: levelsss.sr_start,
                sr_end: levelsss.sr_end,
                userrole: levelsss.userrole,
                compltefamilycount: kfamilyCount,
                generalnewscount: kgeneralnewscount,
                suggestioncount: ksuggestioncount,
                problemcount: kproblemcount,
                surveycount: ksurveycount[0]?.ksurveycount || 0, // Return 0 if no surveyids found
              };
            })
          );
          //new code here
          return {
            id: levelss.id,
            name: levelss.name,
            completefamilypercent: complecount.toFixed(2),
            father_name: levelss.father_name,
            assign_family: levelss.assign_family,
            mobile: levelss.mobile,
            sr_start: levelss.sr_start,
            sr_end: levelss.sr_end,
            userrole: levelss.userrole,
            compltefamilycount: familyCount,
            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
            problemcount: problemcount,
            karyakartafinalResult: karyakartafinalResult,

            surveycount: surveycount[0]?.surveycount || 0, // Return 0 if no surveyids found
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        familydata: finalResult,
        data: [],
      });
    } else if (sectorid >= 1) {
      const count = await Booth.countDocuments({ sector_id: sectorid });

      const levels = await Booth.aggregate([
        { $match: { sector_id: sectorid } },

        {
          $group: {
            _id: {
              id: "$id",
              booth_en: "$booth_en",
              booth: `$booth_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            nikay_approve: 1,
          });

          const allData = await User.aggregate([
            {
              $match: {
                boothid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$assign_family" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
                id: "$_id",
              },
            },
            { $sort: { $id: 1 } },
          ]);
          var assign_familycount = 0;
          if (allData.length >= 1) {
            assign_familycount = allData[0].sum;
          }
          var complecount = (familyCount / assign_familycount) * 100;
          if (familyCount !== 0 && assign_familycount !== 0) {
            complecount = complecount.toFixed(2);
          }
          const generalnewscount = await Generalnews.countDocuments({
            boothid: levelss._id.id,
          });
          const suggestioncount = await Suggestion.countDocuments({
            boothid: levelss._id.id,
          });

          return {
            assign_family: assign_familycount,
            completefamilypercent: complecount,
            compltefamilycount: familyCount,
            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (zoneid >= 1) {
      const count = await Sector.countDocuments({ zone_id: zoneid });

      const levels = await Sector.aggregate([
        { $match: { zone_id: zoneid } },

        {
          $group: {
            _id: {
              id: "$id",
              sector_en: "$sector_en",
              sector: `$sector_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            nikay_approve: 1,
          });

          const allData = await User.aggregate([
            {
              $match: {
                sectorid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$assign_family" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
                id: "$_id",
              },
            },
            { $sort: { $id: 1 } },
          ]);
          var assign_familycount = 0;
          if (allData.length >= 1) {
            assign_familycount = allData[0].sum;
          }
          var complecount = (familyCount / assign_familycount) * 100;
          if (familyCount !== 0 && assign_familycount !== 0) {
            complecount = complecount.toFixed(2);
          }
          const generalnewscount = await Generalnews.countDocuments({
            sectorid: levelss._id.id,
          });
          const suggestioncount = await Suggestion.countDocuments({
            sectorid: levelss._id.id,
          });

          return {
            assign_family: assign_familycount,
            completefamilypercent: complecount,
            compltefamilycount: familyCount,
            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (blockid >= 1) {
      const count = await Zone.countDocuments({ block_id: blockid });

      const levels = await Zone.aggregate([
        { $match: { block_id: blockid } },

        {
          $group: {
            _id: {
              id: "$id",
              zone_en: "$zone_en",
              zone: `$zone_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            nikay_approve: 1,
          });

          const allData = await User.aggregate([
            {
              $match: {
                zoneid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$assign_family" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
                id: "$_id",
              },
            },
            { $sort: { $id: 1 } },
          ]);
          var assign_familycount = 0;
          if (allData.length >= 1) {
            assign_familycount = allData[0].sum;
          }
          var complecount = (familyCount / assign_familycount) * 100;
          if (familyCount !== 0 && assign_familycount !== 0) {
            complecount = complecount.toFixed(2);
          }
          const generalnewscount = await Generalnews.countDocuments({
            zoneid: levelss._id.id,
          });
          const suggestioncount = await Suggestion.countDocuments({
            zoneid: levelss._id.id,
          });

          return {
            assign_family: assign_familycount,
            completefamilypercent: complecount,
            compltefamilycount: familyCount,
            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (vidhansabhaid >= 1) {
      const count = await Block.countDocuments({
        vidhansabha_id: vidhansabhaid,
      });
      const levels = await Block.aggregate([
        { $match: { vidhansabha_id: vidhansabhaid } },

        {
          $group: {
            _id: {
              id: "$id",
              block_en: "$block_en",
              block: `$block_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            nikay_approve: 1,
          });

          const allData = await User.aggregate([
            {
              $match: {
                blockid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$assign_family" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
                id: "$_id",
              },
            },
            { $sort: { $id: 1 } },
          ]);
          var assign_familycount = 0;
          if (allData.length >= 1) {
            assign_familycount = allData[0].sum;
          }
          var complecount = (familyCount / assign_familycount) * 100;
          if (familyCount !== 0 && assign_familycount !== 0) {
            complecount = complecount.toFixed(2);
          }
          const generalnewscount = await Generalnews.countDocuments({
            blockid: levelss._id.id,
          });
          const suggestioncount = await Suggestion.countDocuments({
            blockid: levelss._id.id,
          });

          return {
            assign_family: assign_familycount,
            completefamilypercent: complecount,
            compltefamilycount: familyCount,
            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (loksabhaid >= 1) {
      const count = await Vidhansabha.countDocuments({
        loksabha_id: loksabhaid,
      });

      const levels = await Vidhansabha.aggregate([
        { $match: { loksabha_id: loksabhaid } },

        {
          $group: {
            _id: {
              id: "$id",
              vidhansabha_en: "$vidhansabha_en",
              vidhansabha: `$vidhansabha_${lang1}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            nikay_approve: 1,
          });

          const allData = await User.aggregate([
            {
              $match: {
                vidhansabhaid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$assign_family" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
                id: "$_id",
              },
            },
            { $sort: { $id: 1 } },
          ]);
          var assign_familycount = 0;
          if (allData.length >= 1) {
            assign_familycount = allData[0].sum;
          }
          var complecount = (familyCount / assign_familycount) * 100;
          if (familyCount !== 0 && assign_familycount !== 0) {
            complecount = complecount.toFixed(2);
          }
          const generalnewscount = await Generalnews.countDocuments({
            vidhansabhaid: levelss._id.id,
          });
          const suggestioncount = await Suggestion.countDocuments({
            vidhansabhaid: levelss._id.id,
          });

          return {
            assign_family: assign_familycount,
            completefamilypercent: complecount,
            compltefamilycount: familyCount,
            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (nikayid >= 1) {
      const count = await Ward.countDocuments({ nikay_id: nikayid });
      const levels = await Ward.aggregate([
        { $match: { nikay_id: nikayid } },

        {
          $group: {
            _id: {
              id: "$id",
              ward_en: "$ward_en",
              ward: `$ward_${lang}`,
              ward_type: "$ward_type",
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            nikay_approve: 1,
          });

          const allData = await User.aggregate([
            {
              $match: {
                wardid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$assign_family" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
                id: "$_id",
              },
            },
            { $sort: { $id: 1 } },
          ]);
          var assign_familycount = 0;
          if (allData.length >= 1) {
            assign_familycount = allData[0].sum;
          }
          var complecount = (familyCount / assign_familycount) * 100;
          if (familyCount !== 0 && assign_familycount !== 0) {
            complecount = complecount.toFixed(2);
          }
          const generalnewscount = await Generalnews.countDocuments({
            wardid: levelss._id.id,
          });
          const suggestioncount = await Suggestion.countDocuments({
            wardid: levelss._id.id,
          });

          return {
            assign_family: assign_familycount,
            completefamilypercent: complecount,
            compltefamilycount: familyCount,

            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (jilaid >= 1) {
      if (app_type === "nigam") {
        const count = await Nikay.countDocuments({ jila_id: jilaid });
        const levels = await Nikay.aggregate([
          { $match: { jila_id: jilaid } },
          {
            $group: {
              _id: {
                id: "$id",
                name_en: "$nikay_en",
                name: `$nikay_${lang}`,
                nikay_type: "$nikay_type",
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              nikay_approve: 1,
            });

            const allData = await User.aggregate([
              {
                $match: {
                  nikayid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$assign_family" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                  id: "$_id",
                },
              },
              { $sort: { $id: 1 } },
            ]);
            var assign_familycount = 0;
            if (allData.length >= 1) {
              assign_familycount = allData[0].sum;
            }
            var complecount = (familyCount / assign_familycount) * 100;
            if (familyCount !== 0 && assign_familycount !== 0) {
              complecount = complecount.toFixed(2);
            }
            const generalnewscount = await Generalnews.find({
              nikayid: levelss._id.id,
            });
            const suggestioncount = await Suggestion.find({
              nikayid: levelss._id.id,
            });

            return {
              assign_family: assign_familycount,
              completefamilypercent: complecount,
              compltefamilycount: familyCount,

              generalnewscount: generalnewscount,
              suggestioncount: suggestioncount,
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: count,
          data: finalResult,
          familydata: [],
        });
      } else {
        var lang1 = lang;
        if (lang === "hi") {
          lang1 = "hindi";
        }
        const count = await Vidhansabha.countDocuments({ jila_id: jilaid });
        const levels = await Vidhansabha.aggregate([
          { $match: { jila_id: jilaid } },
          {
            $group: {
              _id: {
                id: "$id",
                name_en: "$vidhansabha_en",
                name: `$vidhansabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);

        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              nikay_approve: 1,
            });

            const allData = await User.aggregate([
              {
                $match: {
                  vidhansabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$assign_family" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                  id: "$_id",
                },
              },
              { $sort: { $id: 1 } },
            ]);
            var assign_familycount = 0;
            if (allData.length >= 1) {
              assign_familycount = allData[0].sum;
            }
            var complecount = (familyCount / assign_familycount) * 100;
            if (familyCount !== 0 && assign_familycount !== 0) {
              complecount = complecount.toFixed(2);
            }
            const generalnewscount = await Generalnews.countDocuments({
              vidhansabhaid: levelss._id.id,
            });
            const suggestioncount = await Suggestion.countDocuments({
              vidhansabhaid: levelss._id.id,
            });

            return {
              assign_family: assign_familycount,
              completefamilypercent: complecount,
              compltefamilycount: familyCount,

              generalnewscount: generalnewscount,
              suggestioncount: suggestioncount,
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
            };
          })
        );
        // console.log(JSON.stringify(finalResult));
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: count,
          data: finalResult,
          familydata: [],
        });
      }
    } else if (stateid >= 1) {
      if (app_type == "nigam") {
        var lang1 = lang;
        if (lang === "hi") {
          lang1 = "hindi";
        }
        const count = await Jila.countDocuments({ stateid: stateid });

        const levels = await Jila.aggregate([
          { $match: { stateid: stateid } },

          {
            $group: {
              _id: {
                id: "$id",
                name_en: "$jila_en",
                name: `$jila_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);

        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              nikay_approve: 1,
            });

            const allData = await User.aggregate([
              {
                $match: {
                  jilaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$assign_family" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                  id: "$_id",
                },
              },
              { $sort: { $id: 1 } },
            ]);
            var assign_familycount = 0;
            if (allData.length >= 1) {
              assign_familycount = allData[0].sum;
            }
            var complecount = (familyCount / assign_familycount) * 100;
            if (familyCount !== 0 && assign_familycount !== 0) {
              complecount = complecount.toFixed(2);
            }
            const generalnewscount = await Generalnews.find({
              jilaid: levelss._id.id,
            });
            const suggestioncount = await Suggestion.find({
              jilaid: levelss._id.id,
            });

            return {
              assign_family: assign_familycount,
              completefamilypercent: complecount,
              compltefamilycount: familyCount,
              generalnewscount: generalnewscount,
              suggestioncount: suggestioncount,
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
            };
          })
        );

        // console.log(JSON.stringify(finalResult));
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: count,
          data: finalResult,
          familydata: [],
        });
      } else if (app_type == "vidhansabha") {
        var lang1 = lang;
        const count = await Loksabha.countDocuments({ stateid: stateid });
        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },
          {
            $group: {
              _id: {
                id: "$id",
                name_en: "$loksabha_en",
                name: `$loksabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);

        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              nikay_approve: 1,
            });

            const allData = await User.aggregate([
              {
                $match: {
                  loksabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$assign_family" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                  id: "$_id",
                },
              },
              { $sort: { $id: 1 } },
            ]);
            var assign_familycount = 0;
            if (allData.length >= 1) {
              assign_familycount = allData[0].sum;
            }
            var complecount = (familyCount / assign_familycount) * 100;
            if (familyCount !== 0 && assign_familycount !== 0) {
              complecount = complecount.toFixed(2);
            }
            const generalnewscount = await Generalnews.countDocuments({
              loksabhaid: levelss._id.id,
            });
            const suggestioncount = await Suggestion.countDocuments({
              loksabhaid: levelss._id.id,
            });

            return {
              assign_family: assign_familycount,
              completefamilypercent: complecount,
              compltefamilycount: familyCount,
              generalnewscount: generalnewscount,
              suggestioncount: suggestioncount,
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
            };
          })
        );
        // console.log(JSON.stringify(finalResult));
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: count,
          data: finalResult,
          familydata: [],
        });
      }
    } else if (countryid >= 1) {
      const count = await State.countDocuments();
      const levels = await State.aggregate([
        {
          $group: {
            _id: {
              id: "$id",
              name_en: "$state_en",
              name: `$state_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            nikay_approve: 1,
          });

          const allData = await User.aggregate([
            {
              $match: {
                stateid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$assign_family" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
                id: "$_id",
              },
            },
            { $sort: { $id: 1 } },
          ]);
          var assign_familycount = 0;
          if (allData.length >= 1) {
            assign_familycount = allData[0].sum;
          }
          var complecount = (familyCount / assign_familycount) * 100;
          if (familyCount !== 0 && assign_familycount !== 0) {
            complecount = complecount.toFixed(2);
          }
          const generalnewscount = await Generalnews.countDocuments({
            stateid: levelss._id.id,
          });
          const suggestioncount = await Suggestion.countDocuments({
            stateid: levelss._id.id,
          });

          return {
            assign_family: assign_familycount,
            completefamilypercent: complecount,
            compltefamilycount: familyCount,
            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else {
      const counts = 1;
      var data = [];
      data[0] = {
        id: 1,
        name_en: "India",
        name: "भारत",
      };

      const finalResult = await Promise.all(
        data.map(async (levelss) => {
          const familyCount = await Surveyfamily.countDocuments({
            nikay_approve: 1,
          });

          const allData = await User.aggregate([
            {
              $group: {
                _id: null,
                sum: { $sum: "$assign_family" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
                id: "$_id",
              },
            },
            { $sort: { $id: 1 } },
          ]);
          var assign_familycount = 0;
          if (allData.length >= 1) {
            assign_familycount = allData[0].sum;
          }
          var complecount = (familyCount / assign_familycount) * 100;
          if (familyCount !== 0 && assign_familycount !== 0) {
            complecount = complecount.toFixed(2);
          }
          const generalnewscount = await Generalnews.countDocuments({});
          const suggestioncount = await Suggestion.countDocuments({});

          return {
            assign_family: assign_familycount,
            completefamilypercent: complecount,
            compltefamilycount: familyCount,
            generalnewscount: generalnewscount,
            suggestioncount: suggestioncount,
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
          };
        })
      );

      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: finalResult,
        familydata: [],
      });
    }

    //
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
