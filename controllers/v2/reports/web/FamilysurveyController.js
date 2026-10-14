const Booth = require("../../../../models/boothModel");
const Block = require("../../../../models/blockModel");
const Vidhansabha = require("../../../../models/vidhansabhaModel");
const Jila = require("../../../../models/jilaModel");
const Loksabha = require("../../../../models/loksabhaModel");
const State = require("../../../../models/stateModel");
const Nikay = require("../../../../models/nikayModel");
const Ward = require("../../../../models/wardModel");
const Familysurvey = require("../../../../models/surveyfamilyModel");
const Religion = require("../../../../models/religionModel");

const creatError = require("../../../../utils/appError");
const Surveyfamily = require("../../../../models/surveyfamilyModel");
const Category = require("../../../../models/categoryModel");
const Caste = require("../../../../models/casteModel");
const Surveyvoter = require("../../../../models/surveyvoterModel");
const Education = require("../../../../models/educationModel");
const Sector = require("../../../../models/sectorModel");
const Zone = require("../../../../models/zoneModel");
const User = require("../../../../models/userModel");
async function mobilenumber_details(username, lang) {
  const users = await User.aggregate([
    {
      $match: { mobile: username },
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
              role_type: 1,
              level: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        father_name: 1,
        mobile: 1,
        role: 1,
        stateid: 1,
        loksabhaid: 1,
        vidhansabhaid: 1,
        blockid: 1,
        boothid: 1,
        jilaid: 1,
        wardid: 1,
        nikayid: 1,
        postData: 1,
      },
    },
    { $sort: { _id: -1 } },
    { $skip: 0 },
    { $limit: 1 },
  ]);
  return users;
}
exports.religionwise = async (req, res, next) => {
  try {
    var {
      username,
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
    } = req.body;
    console.log(req.body)
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
    //
    const users = await mobilenumber_details(username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;
    // console.log("level", level)
    if (wardid >= 1) {
      // console.log(JSON.stringify(levels));
      const allReligions = await Religion.aggregate([
        {
          $lookup: {
            from: "surveyfamilies",
            let: {
              aId: "$id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$religionid", "$$aId"] },
                      { $eq: ["$wardid", wardid] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  WebId: "$familyid",
                  house_no: 1,
                  familyid: 1,
                },
              },
            ],
            as: "familydata",
          },
        },
        {
          $project: {
            _id: 0,
            religion_en: 1,
            id: 1,
            religionname: `$religion_${lang}`,
            familydata: 1,
          },
        },
        { $sort: { id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allReligions,
      });
    } else if (boothid >= 1) {
      // console.log(JSON.stringify(levels));
      const allReligions = await Religion.aggregate([
        {
          $lookup: {
            from: "surveyfamilies",
            let: {
              aId: "$id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$religionid", "$$aId"] },
                      { $eq: ["$boothid", boothid] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  WebId: "$familyid",
                  house_no: 1,
                  familyid: 1,
                },
              },
            ],
            as: "familydata",
          },
        },
        {
          $project: {
            _id: 0,
            religion_en: 1,
            id: 1,
            religionname: `$religion_${lang}`,
            familydata: 1,
          },
        },
        { $sort: { id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allReligions,
      });
    } else if (sectorid >= 1) {
      const count = await Booth.countDocuments({ sector_id: sectorid });

      const levels = await Booth.aggregate([
        { $match: { sector_id: sectorid } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "boothid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              booth_en: "$booth_en",
              booth: `$booth_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.booth_en,
          name: levelss._id.booth,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
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
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "sectorid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              sector_en: "$sector_en",
              sector: `$sector_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.sector_en,
          name: levelss._id.sector,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
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
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "zoneid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              zone_en: "$zone_en",
              zone: `$zone_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.zone_en,
          name: levelss._id.zone,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (vidhansabhaid >= 1) {
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

      const levels = await Block.aggregate([
        { $match: { vidhansabha_id: vidhansabhaid } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "blockid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              block_en: "$block_en",
              block: `$block_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.block_en,
          name: levelss._id.block,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (loksabhaid >= 1) {
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

      const levels = await Vidhansabha.aggregate([
        { $match: { loksabha_id: loksabhaid } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "vidhansabhaid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              vidhansabha_en: "$vidhansabha_en",
              vidhansabha: `$vidhansabha_${lang1}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,

          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.vidhansabha_en,
          name: levelss._id.vidhansabha,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
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
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "wardid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              ward_en: "$ward_en",
              ward: `$ward_${lang}`,
              ward_type: "$ward_type",
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.ward_en,
          name: levelss._id.ward,
          ward_type: levelss._id.ward_type,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
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
            $lookup: {
              from: "surveyfamilies",
              localField: "id",
              foreignField: "nikayid",
              as: "families",
            },
          },

          {
            $unwind: {
              path: "$families",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: {
                id: "$id",
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
                nikay_type: "$nikay_type",
              },
              families: { $push: "$families" },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
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
        const finalResult = levels.map((levelss) => {
          let totalcount = levelss.families.length;
          const religions = allReligions.map((religion) => {
            const familyCount = levelss.families.filter(
              (family) => family.religionid === religion.id
            ).length;

            return {
              id: religion.id,
              religion: religion.religionname,
              religion_en: religion.religion_en,
              familyCount: familyCount,
            };
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.nikay_en,
            name: levelss._id.nikay,
            nikay_type: levelss._id.nikay_type,
            totalcount: totalcount,
            religions,
          };
        });

        // console.log(JSON.stringify(finalResult));
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
            $lookup: {
              from: "surveyfamilies",
              localField: "id",
              foreignField: "vidhansabhaid",
              as: "families",
            },
          },

          {
            $unwind: {
              path: "$families",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: {
                id: "$id",
                vidhansabha_en: "$vidhansabha_en",
                vidhansabha: `$vidhansabha_${lang1}`,
              },
              families: { $push: "$families" },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
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
        const finalResult = levels.map((levelss) => {
          let totalcount = levelss.families.length;
          const religions = allReligions.map((religion) => {
            const familyCount = levelss.families.filter(
              (family) => family.religionid === religion.id
            ).length;

            return {
              id: religion.id,
              religion: religion.religionname,
              religion_en: religion.religion_en,
              familyCount: familyCount,
            };
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            totalcount: totalcount,
            religions,
          };
        });

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
            $lookup: {
              from: "surveyfamilies",
              localField: "id",
              foreignField: "jilaid",
              as: "families",
            },
          },

          {
            $unwind: {
              path: "$families",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: {
                id: "$id",
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
              families: { $push: "$families" },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
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
        const finalResult = levels.map((levelss) => {
          let totalcount = levelss.families.length;
          const religions = allReligions.map((religion) => {
            const familyCount = levelss.families.filter(
              (family) => family.religionid === religion.id
            ).length;

            return {
              id: religion.id,
              religion: religion.religionname,
              religion_en: religion.religion_en,
              familyCount: familyCount,
            };
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.jila_en,
            name: levelss._id.jila,
            totalcount: totalcount,
            religions,
          };
        });

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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },
          {
            $lookup: {
              from: "surveyfamilies",
              localField: "id",
              foreignField: "loksabhaid",
              as: "families",
            },
          },

          {
            $unwind: {
              path: "$families",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
              families: { $push: "$families" },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
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
        const finalResult = levels.map((levelss) => {
          let totalcount = levelss.families.length;
          const religions = allReligions.map((religion) => {
            const familyCount = levelss.families.filter(
              (family) => family.religionid === religion.id
            ).length;

            return {
              id: religion.id,
              religion: religion.religionname,
              religion_en: religion.religion_en,
              familyCount: familyCount,
            };
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.loksabha_en,
            name: levelss._id.loksabha,
            totalcount: totalcount,
            religions,
          };
        });

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
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "stateid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.state_en,
          name: levelss._id.state,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "booth") {
      const count = await Booth.countDocuments({ id: { $in: users[0].boothid } });
      const levels = await Booth.aggregate([
        { $match: { id: { $in: users[0].boothid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "boothid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              booth_en: "$booth_en",
              booth: `$booth_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.booth_en,
          name: levelss._id.booth,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "sector") {
      const count = await Sector.countDocuments({ id: { $in: users[0].sectorid } });
      const levels = await Sector.aggregate([
        { $match: { id: { $in: users[0].sectorid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "sectorid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              sector_en: "$sector_en",
              sector: `$sector_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.sector_en,
          name: levelss._id.sector,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "zone") {
      const count = await Zone.countDocuments({ id: { $in: users[0].zoneid } });
      const levels = await Zone.aggregate([
        { $match: { id: { $in: users[0].zoneid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "zoneid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              zone_en: "$zone_en",
              zone: `$zone_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.zone_en,
          name: levelss._id.zone,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "block") {
      const count = await Block.countDocuments({ id: { $in: users[0].blockid } });

      const levels = await Block.aggregate([
        { $match: { id: { $in: users[0].blockid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "blockid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              block_en: "$block_en",
              block: `$block_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.block_en,
          name: levelss._id.block,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "vidhansabha") {
      const count = await Vidhansabha.countDocuments({ id: { $in: users[0].vidhansabhaid } });
      const levels = await Vidhansabha.aggregate([
        { $match: { id: { $in: users[0].vidhansabhaid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "vidhansabhaid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              vidhansabha_en: "$vidhansabha_en",
              vidhansabha: `$vidhansabha_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.vidhansabha_en,
          name: levelss._id.vidhansabha,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "loksabha") {
      const count = await Loksabha.countDocuments({ id: { $in: users[0].loksabhaid } });
      const levels = await Loksabha.aggregate([
        { $match: { id: { $in: users[0].loksabhaid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "loksabhaid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              loksabha_en: "$loksabha_en",
              loksabha: `$loksabha_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.loksabha_en,
          name: levelss._id.loksabha,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "ward") {
      const count = await Ward.countDocuments({ id: { $in: users[0].wardid } });
      const levels = await Ward.aggregate([
        { $match: { id: { $in: users[0].wardid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "wardid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              ward_en: "$ward_en",
              ward: `$ward_${lang}`,
              ward_type: "$ward_type",
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.ward_en,
          name: levelss._id.ward,
          ward_type: levelss._id.ward_type,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "nigam") {
      const count = await Nikay.countDocuments({ id: { $in: users[0].nikayid } });

      const levels = await Nikay.aggregate([
        { $match: { id: { $in: users[0].nikayid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "nikayid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              nikay_en: "$nikay_en",
              nikay: `$nikay_${lang}`,
              nikay_type: "$nikay_type",
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.nikay_en,
          name: levelss._id.nikay,
          nikay_type: levelss._id.nikay_type,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });

    } else if (level === "jila") {
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Jila.countDocuments({ id: { $in: users[0].jilaid } });

      const levels = await Jila.aggregate([
        { $match: { id: { $in: users[0].jilaid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "jilaid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              jila_en: "$jila_en",
              jila: `$jila_${lang1}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.jila_en,
          name: levelss._id.jila,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });


    } else if (level === "state") {
      var lang1 = lang;

      const count = await State.countDocuments({ id: { $in: users[0].stateid } });

      const levels = await State.aggregate([
        { $match: { id: { $in: users[0].stateid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "stateid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              state_en: "$state_en",
              state: `$state_${lang1}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.state_en,
          name: levelss._id.state,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });

    }
    else if (level === "national") {
      const count = await State.countDocuments();
      const levels = await State.aggregate([
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "stateid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const religions = allReligions.map((religion) => {
          const familyCount = levelss.families.filter(
            (family) => family.religionid === religion.id
          ).length;

          return {
            id: religion.id,
            religion: religion.religionname,
            religion_en: religion.religion_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.state_en,
          name: levelss._id.state,
          totalcount: totalcount,
          religions,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    }
    else {
      const counts = 1;
      var data = [];
      data[0] = {
        id: 1,
        name_en: "India",
        name: "भारत",
      };
      let result = await Religion.aggregate([
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "religionid",
            as: "families",
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            religion: `$religion_${lang}`,
            religion_en: 1,
            familyCount: { $size: "$families" },
          },
        },
      ]);
      // console.log(result);
      // data1.push(...data1, {
      //   id: element.id,
      //   state_en: element.state_en,
      //   state: element.state,
      //   religions: result,
      // });
      data.forEach((element, index) => {
        data[index].religions = result;
      });
      console.log(JSON.stringify(data));

      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: data,
        familydata: [],
      });
    }

    //
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
exports.categorywise = async (req, res, next) => {
  try {
    var {
      username,
      lang,
      levletype,
      blockid,
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
    //
    const users = await mobilenumber_details(username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;
    if (wardid >= 1) {
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
        {
          $lookup: {
            from: "surveyfamilies",
            let: {
              aId: "$id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$categoryid", "$$aId"] },
                      { $eq: ["$wardid", wardid] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  WebId: "$familyid",
                  house_no: 1,
                  familyid: 1,
                },
              },
            ],
            as: "familydata",
          },
        },
        {
          $project: {
            _id: 0,
            category_en: 1,
            id: 1,
            categoryname: `$category_${lang}`,
            familydata: 1,
          },
        },
        { $sort: { id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCategory,
      });
    }
    if (boothid >= 1) {
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
        {
          $lookup: {
            from: "surveyfamilies",
            let: {
              aId: "$id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$categoryid", "$$aId"] },
                      { $eq: ["$boothid", boothid] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  WebId: "$familyid",
                  house_no: 1,
                  familyid: 1,
                },
              },
            ],
            as: "familydata",
          },
        },
        {
          $project: {
            _id: 0,
            category_en: 1,
            id: 1,
            categoryname: `$category_${lang}`,
            familydata: 1,
          },
        },
        { $sort: { id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCategory,
      });
    } else if (sectorid >= 1) {
      const count = await Booth.countDocuments({ sector_id: sectorid });

      const levels = await Booth.aggregate([
        { $match: { sector_id: sectorid } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "boothid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              booth_en: "$booth_en",
              booth: `$booth_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.booth_en,
          name: levelss._id.booth,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
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
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "sectorid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              sector_en: "$sector_en",
              sector: `$sector_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.sector_en,
          name: levelss._id.sector,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
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
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "zoneid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              zone_en: "$zone_en",
              zone: `$zone_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.zone_en,
          name: levelss._id.zone,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (vidhansabhaid >= 1) {
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

      const levels = await Block.aggregate([
        { $match: { vidhansabha_id: vidhansabhaid } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "blockid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              block_en: "$block_en",
              block: `$block_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.block_en,
          name: levelss._id.block,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (loksabhaid >= 1) {
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

      const levels = await Vidhansabha.aggregate([
        { $match: { loksabha_id: loksabhaid } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "vidhansabhaid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              vidhansabha_en: "$vidhansabha_en",
              vidhansabha: `$vidhansabha_${lang1}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.vidhansabha_en,
          name: levelss._id.vidhansabha,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
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
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "wardid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              ward_en: "$ward_en",
              ward: `$ward_${lang}`,
              ward_type: "$ward_type",
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.ward_en,
          name: levelss._id.ward,
          ward_type: levelss._id.ward_type,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
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
            $lookup: {
              from: "surveyfamilies",
              localField: "id",
              foreignField: "nikayid",
              as: "families",
            },
          },

          {
            $unwind: {
              path: "$families",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: {
                id: "$id",
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
                nikay_type: "$nikay_type",
              },
              families: { $push: "$families" },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        // console.log(JSON.stringify(levels));
        const allCategory = await Category.aggregate([
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
        // console.log(`category.category_${lang}`);
        // const nnlang = `category.category_${lang}`;

        // console.log(JSON.stringify(allCategory));
        const finalResult = levels.map((levelss) => {
          let totalcount = levelss.families.length;

          const categorys = allCategory.map((category) => {
            const familyCount = levelss.families.filter(
              (family) => family.categoryid === category.id
            ).length;

            return {
              id: category.id,
              category: category.categoryname,
              category_en: category.category_en,
              familyCount: familyCount,
            };
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.nikay_en,
            name: levelss._id.nikay,
            nikay_type: levelss._id.nikay_type,
            totalcount: totalcount,
            categorys,
          };
        });

        // console.log(JSON.stringify(finalResult));
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
            $lookup: {
              from: "surveyfamilies",
              localField: "id",
              foreignField: "vidhansabhaid",
              as: "families",
            },
          },

          {
            $unwind: {
              path: "$families",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: {
                id: "$id",
                vidhansabha_en: "$vidhansabha_en",
                vidhansabha: `$vidhansabha_${lang1}`,
              },
              families: { $push: "$families" },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        // console.log(JSON.stringify(levels));
        const allCategory = await Category.aggregate([
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
        console.log(`category.category_${lang}`);
        // const nnlang = `category.category_${lang}`;

        // console.log(JSON.stringify(allCategory));
        const finalResult = levels.map((levelss) => {
          let totalcount = levelss.families.length;

          const categorys = allCategory.map((category) => {
            const familyCount = levelss.families.filter(
              (family) => family.categoryid === category.id
            ).length;

            return {
              id: category.id,
              category: category.categoryname,
              category_en: category.category_en,
              familyCount: familyCount,
            };
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            totalcount: totalcount,
            categorys,
          };
        });

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
            $lookup: {
              from: "surveyfamilies",
              localField: "id",
              foreignField: "jilaid",
              as: "families",
            },
          },

          {
            $unwind: {
              path: "$families",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: {
                id: "$id",
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
              families: { $push: "$families" },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        // console.log(JSON.stringify(levels));
        const allCategory = await Category.aggregate([
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
        console.log(`category.category_${lang}`);
        // const nnlang = `category.category_${lang}`;

        // console.log(JSON.stringify(allCategory));
        const finalResult = levels.map((levelss) => {
          let totalcount = levelss.families.length;


          const categorys = allCategory.map((category) => {
            const familyCount = levelss.families.filter(
              (family) => family.categoryid === category.id
            ).length;

            return {
              id: category.id,
              category: category.categoryname,
              category_en: category.category_en,
              familyCount: familyCount,
            };
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.jila_en,
            name: levelss._id.jila,
            totalcount: totalcount,
            categorys,
          };
        });

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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },
          {
            $lookup: {
              from: "surveyfamilies",
              localField: "id",
              foreignField: "loksabhaid",
              as: "families",
            },
          },

          {
            $unwind: {
              path: "$families",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
              families: { $push: "$families" },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        // console.log(JSON.stringify(levels));
        const allCategory = await Category.aggregate([

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
        console.log(`category.category_${lang}`);
        // const nnlang = `category.category_${lang}`;

        // console.log(JSON.stringify(allCategory));
        const finalResult = levels.map((levelss) => {
          let totalcount = levelss.families.length;

          const categorys = allCategory.map((category) => {
            const familyCount = levelss.families.filter(
              (family) => family.categoryid === category.id
            ).length;

            return {
              id: category.id,
              category: category.categoryname,
              category_en: category.category_en,
              familyCount: familyCount,
            };
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.loksabha_en,
            name: levelss._id.loksabha,
            categorys,
          };
        });

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
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "stateid",
            as: "families",
          },
        },
        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              id: "$id",
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([

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
      console.log(`category.category_${lang}`);
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.state_en,
          name: levelss._id.state,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "booth") {
      const count = await Booth.countDocuments({ id: { $in: users[0].boothid } });

      const levels = await Booth.aggregate([
        { $match: { id: { $in: users[0].boothid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "boothid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              booth_en: "$booth_en",
              booth: `$booth_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.booth_en,
          name: levelss._id.booth,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "sector") {
      const count = await Sector.countDocuments({ id: { $in: users[0].sectorid } });

      const levels = await Sector.aggregate([
        { $match: { id: { $in: users[0].sectorid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "sectorid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              sector_en: "$sector_en",
              sector: `$sector_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.sector_en,
          name: levelss._id.sector,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "zone") {
      const count = await Zone.countDocuments({ id: { $in: users[0].zoneid } });

      const levels = await Zone.aggregate([
        { $match: { id: { $in: users[0].zoneid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "zoneid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              zone_en: "$zone_en",
              zone: `$zone_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.zone_en,
          name: levelss._id.zone,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "block") {
      const count = await Block.countDocuments({ id: { $in: users[0].blockid } });

      const levels = await Block.aggregate([
        { $match: { id: { $in: users[0].blockid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "blockid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              block_en: "$block_en",
              block: `$block_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.block_en,
          name: levelss._id.block,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "vidhansabha") {
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ id: { $in: users[0].vidhansabhaid } });

      const levels = await Vidhansabha.aggregate([
        { $match: { id: { $in: users[0].vidhansabhaid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "vidhansabhaid",
            as: "families",
          },
        },
        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              id: "$id",
              vidhansabha_en: "$vidhansabha_en",
              vidhansabha: `$vidhansabha_${lang1}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.vidhansabha_en,
          name: levelss._id.vidhansabha,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "ward") {
      const count = await Ward.countDocuments({ id: { $in: users[0].wardid } });
      const levels = await Ward.aggregate([
        { $match: { id: { $in: users[0].wardid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "wardid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              ward_en: "$ward_en",
              ward: `$ward_${lang}`,
              ward_type: "$ward_type",
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.ward_en,
          name: levelss._id.ward,
          ward_type: levelss._id.ward_type,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "nigam") {
      const count = await Nikay.countDocuments({ id: { $in: users[0].nikayid } });

      const levels = await Nikay.aggregate([
        { $match: { id: { $in: users[0].nikayid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "nikayid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              nikay_en: "$nikay_en",
              nikay: `$nikay_${lang}`,
              nikay_type: "$nikay_type",
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      // console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.nikay_en,
          name: levelss._id.nikay,
          nikay_type: levelss._id.nikay_type,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "loksabha") {
      var lang1 = lang;
      const count = await Loksabha.countDocuments({
        id: {
          $in: users[0].loksabhaid
        }
      });
      const levels = await Loksabha.aggregate([
        {
          $match: {
            id: {
              $in: users[0].loksabhaid
            }
          }
        },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "loksabhaid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              loksabha_en: "$loksabha_en",
              loksabha: `$loksabha_${lang1}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([

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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.loksabha_en,
          name: levelss._id.loksabha,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });

    } else if (level === "Jila") {
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Jila.countDocuments({ id: { $in: users[0].jilaid } });

      const levels = await Jila.aggregate([
        { $match: { id: { $in: users[0].jilaid } } },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "jilaid",
            as: "families",
          },
        },

        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              id: "$id",
              jila_en: "$jila_en",
              jila: `$jila_${lang1}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([
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
      console.log(`category.category_${lang}`);
      // const nnlang = `category.category_${lang}`;

      // console.log(JSON.stringify(allCategory));
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;


        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.jila_en,
          name: levelss._id.jila,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });

    } else if (level === "state") {
      const count = await State.countDocuments({ id: { $in: users[0].stateid } });
      const levels = await State.aggregate([
        {
          $match: { id: { $in: users[0].stateid } }
        },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "stateid",
            as: "families",
          },
        },
        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              id: "$id",
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(JSON.stringify(levels));
      const allCategory = await Category.aggregate([

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
      console.log(`category.category_${lang}`);
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;

        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;

          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.state_en,
          name: levelss._id.state,
          totalcount: totalcount,
          categorys,
        };
      });

      // console.log(JSON.stringify(finalResult));
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    } else if (level === "national") {
      const count = await State.countDocuments();
      const levels = await State.aggregate([
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "stateid",
            as: "families",
          },
        },
        {
          $unwind: {
            path: "$families",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              id: "$id",
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
            families: { $push: "$families" },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const allCategory = await Category.aggregate([

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
      console.log(`category.category_${lang}`);
      const finalResult = levels.map((levelss) => {
        let totalcount = levelss.families.length;
        const categorys = allCategory.map((category) => {
          const familyCount = levelss.families.filter(
            (family) => family.categoryid === category.id
          ).length;
          return {
            id: category.id,
            category: category.categoryname,
            category_en: category.category_en,
            familyCount: familyCount,
          };
        });

        return {
          id: levelss._id.id,
          name_en: levelss._id.state_en,
          name: levelss._id.state,
          totalcount: totalcount,
          categorys,
        };
      });

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
      let result = await Category.aggregate([
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "id",
            foreignField: "categoryid",
            as: "families",
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            category: `$category_${lang}`,
            category_en: 1,
            familyCount: { $size: "$families" },
          },
        },
      ]);
      // console.log(result);
      // data1.push(...data1, {
      //   id: element.id,
      //   state_en: element.state_en,
      //   state: element.state,
      //   categorys: result,
      // });
      data.forEach((element, index) => {
        data[index].categorys = result;
      });
      console.log(JSON.stringify(data));

      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: data,
        familydata: [],
      });
    }

    //
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
exports.categorywisetryyyy = async (req, res, next) => {
  try {
    var { lang, limit, skip } = req.body;

    const count = await State.countDocuments();
    const levels = await State.aggregate([
      {
        $project: {
          id: 1,
          state_hi: 1,
          state_en: 1,
        },
      },
      { $sort: { id: 1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    const allReligions = await Religion.find({}).sort({ id: 1 });

    const finalResult = await Promise.all(
      levels.map(async (levelss) => {
        let religions = await Promise.all(
          allReligions.map(async (religion) => {
            const allReligionscounts = await Surveyfamily.countDocuments({
              stateid: levelss.id,
              religionid: religion.id,
            });
            console.log(allReligionscounts);
            return {
              id: religion.id,
              religion: religion.religion_hi,
              religion_en: religion.religion_en,
              familyCount: allReligionscounts,
            };
          })
        );

        return {
          id: levelss.id,
          name_en: levelss.state_en,
          name: levelss.state_hi,
          religions,
        };
      })
    );

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      count: count,
      data: finalResult,
    });

    //
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};

exports.castewise = async (req, res, next) => {
  try {
    var {
      username,
      lang,
      levletype,
      blockid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      boothid,
      zoneid,
      sectorid,
      jilaid,
      stateid,
      countryid,
      limit,
      skip,
      app_type,
    } = req.body;
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
    const users = await mobilenumber_details(username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    if (wardid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            wardid: wardid,
          },
        },
        {
          $group: {
            _id: "$casteid",
            count: {
              $sum: 1,
            },
          },
        },
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
                  caste: "$caste_hi",
                  caste_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "_id",
            foreignField: "casteid",
            as: "familyresult",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$familyid",
                  house_no: "$house_no",
                  familyid: 1,
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
            familyresult: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
      });
    } else if (boothid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            boothid: boothid,
          },
        },
        {
          $group: {
            _id: "$casteid",
            count: {
              $sum: 1,
            },
          },
        },
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
                  caste: "$caste_hi",
                  caste_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "_id",
            foreignField: "casteid",
            as: "familyresult",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$familyid",
                  house_no: "$house_no",
                  familyid: 1,
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
            familyresult: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
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
          const allcasteid = await Surveyfamily.aggregate([
            {
              $match: {
                boothid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: "$casteid",
              },
            },
          ]);
          var casteids = await Promise.all(
            allcasteid.map(function (item) {
              return item["_id"];
            })
          );
          const allCaste = await Caste.aggregate([
            {
              $match: {
                id: { $in: casteids },
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                castename: `$caste_${lang}`,
                caste_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);

          const castes = await Promise.all(
            // let totalcount = levelss.families.length;

            allCaste.map(async (caste) => {
              const familyCount = await Surveyfamily.countDocuments({
                boothid: levelss._id.id,
                casteid: caste.id,
              });

              return {
                id: caste.id,
                caste: caste.castename,
                caste_en: caste.caste_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            castes,
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
          const allcasteid = await Surveyfamily.aggregate([
            {
              $match: {
                sectorid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: "$casteid",
              },
            },
          ]);
          var casteids = await Promise.all(
            allcasteid.map(function (item) {
              return item["_id"];
            })
          );
          const allCaste = await Caste.aggregate([
            {
              $match: {
                id: { $in: casteids },
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                castename: `$caste_${lang}`,
                caste_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);

          const castes = await Promise.all(
            allCaste.map(async (caste) => {
              const familyCount = await Surveyfamily.countDocuments({
                sectorid: levelss._id.id,
                casteid: caste.id,
              });

              return {
                id: caste.id,
                caste: caste.castename,
                caste_en: caste.caste_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            castes,
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
          const allcasteid = await Surveyfamily.aggregate([
            {
              $match: {
                zoneid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: "$casteid",
              },
            },
          ]);
          var casteids = await Promise.all(
            allcasteid.map(function (item) {
              return item["_id"];
            })
          );
          const allCaste = await Caste.aggregate([
            {
              $match: {
                id: { $in: casteids },
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                castename: `$caste_${lang}`,
                caste_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);

          const castes = await Promise.all(
            allCaste.map(async (caste) => {
              const familyCount = await Surveyfamily.countDocuments({
                zoneid: levelss._id.id,
                casteid: caste.id,
              });

              return {
                id: caste.id,
                caste: caste.castename,
                caste_en: caste.caste_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            castes,
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
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

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
          const allcasteid = await Surveyfamily.aggregate([
            {
              $match: {
                blockid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: "$casteid",
              },
            },
          ]);
          var casteids = await Promise.all(
            allcasteid.map(function (item) {
              return item["_id"];
            })
          );
          const allCaste = await Caste.aggregate([
            {
              $match: {
                id: { $in: casteids },
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                castename: `$caste_${lang}`,
                caste_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);

          const castes = await Promise.all(
            allCaste.map(async (caste) => {
              const familyCount = await Surveyfamily.countDocuments({
                blockid: levelss._id.id,
                casteid: caste.id,
              });

              return {
                id: caste.id,
                caste: caste.castename,
                caste_en: caste.caste_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            castes,
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
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

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
          const allcasteid = await Surveyfamily.aggregate([
            {
              $match: {
                vidhansabhaid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: "$casteid",
              },
            },
          ]);
          var casteids = await Promise.all(
            allcasteid.map(function (item) {
              return item["_id"];
            })
          );
          const allCaste = await Caste.aggregate([
            {
              $match: {
                id: { $in: casteids },
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                castename: `$caste_${lang}`,
                caste_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);

          const castes = await Promise.all(
            allCaste.map(async (caste) => {
              const familyCount = await Surveyfamily.countDocuments({
                vidhansabhaid: levelss._id.id,
                casteid: caste.id,
              });

              return {
                id: caste.id,
                caste: caste.castename,
                caste_en: caste.caste_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            castes,
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
          const allcasteid = await Surveyfamily.aggregate([
            {
              $match: {
                wardid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: "$casteid",
              },
            },
          ]);
          var casteids = await Promise.all(
            allcasteid.map(function (item) {
              return item["_id"];
            })
          );
          const allCaste = await Caste.aggregate([
            {
              $match: {
                id: { $in: casteids },
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                castename: `$caste_${lang}`,
                caste_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);

          const castes = await Promise.all(
            allCaste.map(async (caste) => {
              const familyCount = await Surveyfamily.countDocuments({
                wardid: levelss._id.id,
                casteid: caste.id,
              });

              return {
                id: caste.id,
                caste: caste.castename,
                caste_en: caste.caste_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            castes,
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
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
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
            const allcasteid = await Surveyfamily.aggregate([
              {
                $match: {
                  nikayid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: "$casteid",
                },
              },
            ]);
            var casteids = await Promise.all(
              allcasteid.map(function (item) {
                return item["_id"];
              })
            );
            const allCaste = await Caste.aggregate([
              {
                $match: {
                  id: { $in: casteids },
                },
              },
              {
                $project: {
                  _id: 0,
                  id: 1,
                  castename: `$caste_${lang}`,
                  caste_en: 1,
                },
              },
              { $sort: { id: 1 } },
            ]);

            const castes = await Promise.all(
              allCaste.map(async (caste) => {
                const familyCount = await Surveyfamily.countDocuments({
                  nikayid: levelss._id.id,
                  casteid: caste.id,
                });

                return {
                  id: caste.id,
                  caste: caste.castename,
                  caste_en: caste.caste_en,
                  familyCount: familyCount,
                };
              })
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.nikay_en,
              name: levelss._id.nikay,
              nikay_type: levelss._id.nikay_type,
              castes,
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
            const allcasteid = await Surveyfamily.aggregate([
              {
                $match: {
                  vidhansabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: "$casteid",
                },
              },
            ]);
            var casteids = await Promise.all(
              allcasteid.map(function (item) {
                return item["_id"];
              })
            );
            const allCaste = await Caste.aggregate([
              {
                $match: {
                  id: { $in: casteids },
                },
              },
              {
                $project: {
                  _id: 0,
                  id: 1,
                  castename: `$caste_${lang}`,
                  caste_en: 1,
                },
              },
              { $sort: { id: 1 } },
            ]);

            const castes = await Promise.all(
              allCaste.map(async (caste) => {
                const familyCount = await Surveyfamily.countDocuments({
                  vidhansabhaid: levelss._id.id,
                  casteid: caste.id,
                });

                return {
                  id: caste.id,
                  caste: caste.castename,
                  caste_en: caste.caste_en,
                  familyCount: familyCount,
                };
              })
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.vidhansabha_en,
              name: levelss._id.vidhansabha,
              castes,
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
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const allcasteid = await Surveyfamily.aggregate([
              {
                $match: {
                  jilaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: "$casteid",
                },
              },
            ]);
            var casteids = await Promise.all(
              allcasteid.map(function (item) {
                return item["_id"];
              })
            );
            const allCaste = await Caste.aggregate([
              {
                $match: {
                  id: { $in: casteids },
                },
              },
              {
                $project: {
                  _id: 0,
                  id: 1,
                  castename: `$caste_${lang}`,
                  caste_en: 1,
                },
              },
              { $sort: { id: 1 } },
            ]);

            const castes = await Promise.all(
              allCaste.map(async (caste) => {
                const familyCount = await Surveyfamily.countDocuments({
                  jilaid: levelss._id.id,
                  casteid: caste.id,
                });

                return {
                  id: caste.id,
                  caste: caste.castename,
                  caste_en: caste.caste_en,
                  familyCount: familyCount,
                };
              })
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.jila_en,
              name: levelss._id.jila,
              castes,
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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const allcasteid = await Surveyfamily.aggregate([
              {
                $match: {
                  loksabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: "$casteid",
                },
              },
            ]);
            var casteids = await Promise.all(
              allcasteid.map(function (item) {
                return item["_id"];
              })
            );
            const allCaste = await Caste.aggregate([
              {
                $match: {
                  id: { $in: casteids },
                },
              },
              {
                $project: {
                  _id: 0,
                  id: 1,
                  castename: `$caste_${lang}`,
                  caste_en: 1,
                },
              },
              { $sort: { id: 1 } },
            ]);

            const castes = await Promise.all(
              allCaste.map(async (caste) => {
                const familyCount = await Surveyfamily.countDocuments({
                  loksabhaid: levelss._id.id,
                  casteid: caste.id,
                });

                return {
                  id: caste.id,
                  caste: caste.castename,
                  caste_en: caste.caste_en,
                  familyCount: familyCount,
                };
              })
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.loksabha_en,
              name: levelss._id.loksabha,
              castes,
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
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const allcasteid = await Surveyfamily.aggregate([
            {
              $match: {
                stateid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: "$casteid",
              },
            },
          ]);
          var casteids = await Promise.all(
            allcasteid.map(function (item) {
              return item["_id"];
            })
          );
          const allCaste = await Caste.aggregate([
            {
              $match: {
                id: { $in: casteids },
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                castename: `$caste_${lang}`,
                caste_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);

          const castes = await Promise.all(
            allCaste.map(async (caste) => {
              const familyCount = await Surveyfamily.countDocuments({
                stateid: levelss._id.id,
                casteid: caste.id,
              });

              return {
                id: caste.id,
                caste: caste.castename,
                caste_en: caste.caste_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.state_en,
            name: levelss._id.state,
            castes,
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
          const allcasteid = await Surveyfamily.aggregate([
            {
              $group: {
                _id: "$casteid",
              },
            },
          ]);
          var casteids = await Promise.all(
            allcasteid.map(function (item) {
              return item["_id"];
            })
          );
          const allCaste = await Caste.aggregate([
            {
              $match: {
                id: { $in: casteids },
              },
            },
            {
              $project: {
                _id: 0,
                id: 1,
                castename: `$caste_${lang}`,
                caste_en: 1,
              },
            },
            { $sort: { id: 1 } },
          ]);

          const castes = await Promise.all(
            allCaste.map(async (caste) => {
              const familyCount = await Surveyfamily.countDocuments({
                casteid: caste.id,
              });

              return {
                id: caste.id,
                caste: caste.castename,
                caste_en: caste.caste_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            castes,
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
exports.total_new_voter = async (req, res, next) => {
  try {
    var {
      username,
      lang,
      levletype,
      blockid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      zoneid,
      sectorid,
      boothid,
      jilaid,
      stateid,
      countryid,
      limit,
      skip,
      app_type,
    } = req.body;
    blockid = parseInt(blockid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    zoneid = parseInt(zoneid);
    sectorid = parseInt(sectorid);
    boothid = parseInt(boothid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    //
    const users = await mobilenumber_details(username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;
    if (wardid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            wardid: wardid,
            new_voters_count: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            sum: "$new_voters_count",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
      });
    } else if (boothid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            boothid: boothid,
            new_voters_count: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            sum: "$new_voters_count",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                boothid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$new_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                sectorid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$new_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                zoneid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$new_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            sum: familyscount,
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
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                blockid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$new_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            sum: familyscount,
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
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                vidhansabhaid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$new_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                wardid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$new_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            sum: familyscount,
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
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
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
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  nikayid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$new_voters_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.nikay_en,
              name: levelss._id.nikay,
              nikay_type: levelss._id.nikay_type,
              sum: familyscount,
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
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  vidhansabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$new_voters_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.vidhansabha_en,
              name: levelss._id.vidhansabha,
              sum: familyscount,
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
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  jilaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$new_voters_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.jila_en,
              name: levelss._id.jila,
              sum: familyscount,
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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  loksabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$new_voters_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.loksabha_en,
              name: levelss._id.loksabha,
              sum: familyscount,
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
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                stateid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$new_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.state_en,
            name: levelss._id.state,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            // {
            //   $match: {
            //     wardid: 1,
            //   },
            // },
            {
              $group: {
                _id: null,
                sum: { $sum: "$new_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            sum: familyCount[0].sum,
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
exports.total_out_of_voter = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
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
    zoneid = parseInt(zoneid);
    sectorid = parseInt(sectorid);
    boothid = parseInt(boothid);
    blockid = parseInt(blockid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    //

    if (wardid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            wardid: wardid,
            out_of_voter_count: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            sum: "$out_of_voter_count",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
      });
    } else if (boothid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            boothid: boothid,
            out_of_voter_count: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            sum: "$out_of_voter_count",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                boothid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$out_of_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                sectorid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$out_of_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                zoneid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$out_of_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            sum: familyscount,
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
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                blockid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$out_of_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            sum: familyscount,
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
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                vidhansabhaid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$out_of_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                wardid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$out_of_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            sum: familyscount,
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
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
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
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  nikayid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$out_of_voter_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.nikay_en,
              name: levelss._id.nikay,
              nikay_type: levelss._id.nikay_type,
              sum: familyscount,
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
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  vidhansabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$out_of_voter_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.vidhansabha_en,
              name: levelss._id.vidhansabha,
              sum: familyscount,
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
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  jilaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$out_of_voter_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.jila_en,
              name: levelss._id.jila,
              sum: familyscount,
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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  loksabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$out_of_voter_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.loksabha_en,
              name: levelss._id.loksabha,
              sum: familyscount,
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
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                stateid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$out_of_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.state_en,
            name: levelss._id.state,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            // {
            //   $match: {
            //     wardid: 1,
            //   },
            // },
            {
              $group: {
                _id: null,
                sum: { $sum: "$out_of_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            sum: familyCount[0].sum,
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
exports.total_dead_voter = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      boothid,
      zoneid,
      sectorid,
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
    blockid = parseInt(blockid);
    boothid = parseInt(boothid);
    zoneid = parseInt(zoneid);
    sectorid = parseInt(sectorid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    //

    if (wardid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            wardid: wardid,
            dead_voter_count: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            sum: "$dead_voter_count",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
      });
    } else if (boothid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            boothid: boothid,
            dead_voter_count: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            sum: "$dead_voter_count",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                boothid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$dead_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                sectorid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$dead_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                zoneid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$dead_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            sum: familyscount,
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
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                blockid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$dead_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            sum: familyscount,
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
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                vidhansabhaid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$dead_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                wardid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$dead_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            sum: familyscount,
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
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
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
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  nikayid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$dead_voter_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.nikay_en,
              name: levelss._id.nikay,
              nikay_type: levelss._id.nikay_type,
              sum: familyscount,
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
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  vidhansabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$dead_voter_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.vidhansabha_en,
              name: levelss._id.vidhansabha,
              sum: familyscount,
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
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  jilaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$dead_voter_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.jila_en,
              name: levelss._id.jila,
              sum: familyscount,
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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  loksabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$dead_voter_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.loksabha_en,
              name: levelss._id.loksabha,
              sum: familyscount,
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
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                stateid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$dead_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.state_en,
            name: levelss._id.state,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            // {
            //   $match: {
            //     wardid: 1,
            //   },
            // },
            {
              $group: {
                _id: null,
                sum: { $sum: "$dead_voter_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            sum: familyCount[0].sum,
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
exports.total_voters_count = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      boothid,
      zoneid,
      sectorid,
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
    boothid = parseInt(boothid);
    zoneid = parseInt(zoneid);
    sectorid = parseInt(sectorid);
    blockid = parseInt(blockid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    //

    if (wardid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            wardid: wardid,
            total_voters_count: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            sum: "$total_voters_count",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
      });
    } else if (boothid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            boothid: boothid,
            total_voters_count: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            sum: "$total_voters_count",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                boothid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$total_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                sectorid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$total_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                zoneid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$total_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            sum: familyscount,
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
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                blockid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$total_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            sum: familyscount,
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
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                vidhansabhaid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$total_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                wardid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$total_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            sum: familyscount,
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
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
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
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  nikayid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$total_voters_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.nikay_en,
              name: levelss._id.nikay,
              nikay_type: levelss._id.nikay_type,
              sum: familyscount,
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
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  vidhansabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$total_voters_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.vidhansabha_en,
              name: levelss._id.vidhansabha,
              sum: familyscount,
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
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  jilaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$total_voters_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.jila_en,
              name: levelss._id.jila,
              sum: familyscount,
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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const familyCount = await Surveyfamily.aggregate([
              {
                $match: {
                  loksabhaid: levelss._id.id,
                },
              },
              {
                $group: {
                  _id: null,
                  sum: { $sum: "$total_voters_count" },
                },
              },
              {
                $project: {
                  _id: 0,
                  sum: 1,
                },
              },
            ]);
            var familyscount = 0;
            if (familyCount.length >= 1) {
              familyscount = familyCount[0].sum;
            }
            return {
              id: levelss._id.id,
              name_en: levelss._id.loksabha_en,
              name: levelss._id.loksabha,
              sum: familyscount,
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
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const familyCount = await Surveyfamily.aggregate([
            {
              $match: {
                stateid: levelss._id.id,
              },
            },
            {
              $group: {
                _id: null,
                sum: { $sum: "$total_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          var familyscount = 0;
          if (familyCount.length >= 1) {
            familyscount = familyCount[0].sum;
          }
          return {
            id: levelss._id.id,
            name_en: levelss._id.state_en,
            name: levelss._id.state,
            sum: familyscount,
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
          const familyCount = await Surveyfamily.aggregate([
            // {
            //   $match: {
            //     wardid: 1,
            //   },
            // },
            {
              $group: {
                _id: null,
                sum: { $sum: "$total_voters_count" },
              },
            },
            {
              $project: {
                _id: 0,
                sum: 1,
              },
            },
          ]);
          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            sum: familyCount[0].sum,
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

exports.card_wise_report = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      boothid,
      zoneid,
      sectorid,
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
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            wardid: wardid,
            card_type: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            card_type: "$card_type",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
      });
    } else if (boothid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            boothid: boothid,
            card_type: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            card_type: "$card_type",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
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
          const card1 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            card_type: 1,
          });
          const card2 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            card_type: 2,
          });
          const card3 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            card_type: 3,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            card1: card1,
            card2: card2,
            card3: card3,
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
          const card1 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            card_type: 1,
          });
          const card2 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            card_type: 2,
          });
          const card3 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            card_type: 3,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            card1: card1,
            card2: card2,
            card3: card3,
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
          const card1 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            card_type: 1,
          });
          const card2 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            card_type: 2,
          });
          const card3 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            card_type: 3,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            card1: card1,
            card2: card2,
            card3: card3,
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
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

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
          const card1 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            card_type: 1,
          });
          const card2 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            card_type: 2,
          });
          const card3 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            card_type: 3,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            card1: card1,
            card2: card2,
            card3: card3,
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
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

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
          const card1 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            card_type: 1,
          });
          const card2 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            card_type: 2,
          });
          const card3 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            card_type: 3,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            card1: card1,
            card2: card2,
            card3: card3,
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
          const card1 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            card_type: 1,
          });
          const card2 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            card_type: 2,
          });
          const card3 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            card_type: 3,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            card1: card1,
            card2: card2,
            card3: card3,
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
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
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
            const card1 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              card_type: 1,
            });
            const card2 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              card_type: 2,
            });
            const card3 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              card_type: 3,
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.nikay_en,
              name: levelss._id.nikay,
              nikay_type: levelss._id.nikay_type,
              card1: card1,
              card2: card2,
              card3: card3,
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
            const card1 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              card_type: 1,
            });
            const card2 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              card_type: 2,
            });
            const card3 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              card_type: 3,
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.vidhansabha_en,
              name: levelss._id.vidhansabha,
              card1: card1,
              card2: card2,
              card3: card3,
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
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const card1 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              card_type: 1,
            });
            const card2 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              card_type: 2,
            });
            const card3 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              card_type: 3,
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.jila_en,
              name: levelss._id.jila,
              card1: card1,
              card2: card2,
              card3: card3,
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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const card1 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              card_type: 1,
            });
            const card2 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              card_type: 2,
            });
            const card3 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              card_type: 3,
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.loksabha_en,
              name: levelss._id.loksabha,
              card1: card1,
              card2: card2,
              card3: card3,
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
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const card1 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            card_type: 1,
          });
          const card2 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            card_type: 2,
          });
          const card3 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            card_type: 3,
          });
          return {
            id: levelss._id.id,
            name_en: levelss._id.state_en,
            name: levelss._id.state,
            card1: card1,
            card2: card2,
            card3: card3,
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
          const card1 = await Surveyfamily.countDocuments({
            card_type: 1,
          });
          const card2 = await Surveyfamily.countDocuments({
            card_type: 2,
          });
          const card3 = await Surveyfamily.countDocuments({
            card_type: 3,
          });
          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            card1: card1,
            card2: card2,
            card3: card3,
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

exports.economics_condition_report = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
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
    blockid = parseInt(blockid);
    boothid = parseInt(boothid);
    zoneid = parseInt(zoneid);
    sectorid = parseInt(sectorid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    //

    if (wardid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            wardid: wardid,
            economics_condition: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            economics_condition: "$economics_condition",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
      });
    } else if (boothid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            boothid: boothid,
            economics_condition: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            economics_condition: "$economics_condition",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
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
          const condition1 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            economics_condition: 1,
          });
          const condition2 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            economics_condition: 2,
          });
          const condition3 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            economics_condition: 3,
          });
          const condition4 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            economics_condition: 4,
          });
          const condition5 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            economics_condition: 5,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            condition1: condition1,
            condition2: condition2,
            condition3: condition3,
            condition4: condition4,
            condition5: condition5,
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
          const condition1 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            economics_condition: 1,
          });
          const condition2 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            economics_condition: 2,
          });
          const condition3 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            economics_condition: 3,
          });
          const condition4 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            economics_condition: 4,
          });
          const condition5 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            economics_condition: 5,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            condition1: condition1,
            condition2: condition2,
            condition3: condition3,
            condition4: condition4,
            condition5: condition5,
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
          const condition1 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            economics_condition: 1,
          });
          const condition2 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            economics_condition: 2,
          });
          const condition3 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            economics_condition: 3,
          });
          const condition4 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            economics_condition: 4,
          });
          const condition5 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            economics_condition: 5,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            condition1: condition1,
            condition2: condition2,
            condition3: condition3,
            condition4: condition4,
            condition5: condition5,
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
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

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
          const condition1 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            economics_condition: 1,
          });
          const condition2 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            economics_condition: 2,
          });
          const condition3 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            economics_condition: 3,
          });
          const condition4 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            economics_condition: 4,
          });
          const condition5 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            economics_condition: 5,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            condition1: condition1,
            condition2: condition2,
            condition3: condition3,
            condition4: condition4,
            condition5: condition5,
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
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

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
          const condition1 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            economics_condition: 1,
          });
          const condition2 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            economics_condition: 2,
          });
          const condition3 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            economics_condition: 3,
          });
          const condition4 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            economics_condition: 4,
          });
          const condition5 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            economics_condition: 5,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            condition1: condition1,
            condition2: condition2,
            condition3: condition3,
            condition4: condition4,
            condition5: condition5,
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
          const condition1 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            economics_condition: 1,
          });
          const condition2 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            economics_condition: 2,
          });
          const condition3 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            economics_condition: 3,
          });
          const condition4 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            economics_condition: 4,
          });
          const condition5 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            economics_condition: 5,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            condition1: condition1,
            condition2: condition2,
            condition3: condition3,
            condition4: condition4,
            condition5: condition5,
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
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
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
            const condition1 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              economics_condition: 1,
            });
            const condition2 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              economics_condition: 2,
            });
            const condition3 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              economics_condition: 3,
            });
            const condition4 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              economics_condition: 4,
            });
            const condition5 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              economics_condition: 5,
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.nikay_en,
              name: levelss._id.nikay,
              nikay_type: levelss._id.nikay_type,
              condition1: condition1,
              condition2: condition2,
              condition3: condition3,
              condition4: condition4,
              condition5: condition5,
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
            const condition1 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              economics_condition: 1,
            });
            const condition2 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              economics_condition: 2,
            });
            const condition3 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              economics_condition: 3,
            });
            const condition4 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              economics_condition: 4,
            });
            const condition5 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              economics_condition: 5,
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.vidhansabha_en,
              name: levelss._id.vidhansabha,
              condition1: condition1,
              condition2: condition2,
              condition3: condition3,
              condition4: condition4,
              condition5: condition5,
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
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const condition1 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              economics_condition: 1,
            });
            const condition2 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              economics_condition: 2,
            });
            const condition3 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              economics_condition: 3,
            });
            const condition4 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              economics_condition: 4,
            });
            const condition5 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              economics_condition: 5,
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.jila_en,
              name: levelss._id.jila,
              condition1: condition1,
              condition2: condition2,
              condition3: condition3,
              condition4: condition4,
              condition5: condition5,
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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const condition1 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              economics_condition: 1,
            });
            const condition2 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              economics_condition: 2,
            });
            const condition3 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              economics_condition: 3,
            });
            const condition4 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              economics_condition: 4,
            });
            const condition5 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              economics_condition: 5,
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.loksabha_en,
              name: levelss._id.loksabha,
              condition1: condition1,
              condition2: condition2,
              condition3: condition3,
              condition4: condition4,
              condition5: condition5,
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
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const condition1 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            economics_condition: 1,
          });
          const condition2 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            economics_condition: 2,
          });
          const condition3 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            economics_condition: 3,
          });
          const condition4 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            economics_condition: 4,
          });
          const condition5 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            economics_condition: 5,
          });
          return {
            id: levelss._id.id,
            name_en: levelss._id.state_en,
            name: levelss._id.state,
            condition1: condition1,
            condition2: condition2,
            condition3: condition3,
            condition4: condition4,
            condition5: condition5,
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
          const condition1 = await Surveyfamily.countDocuments({
            economics_condition: 1,
          });
          const condition2 = await Surveyfamily.countDocuments({
            economics_condition: 2,
          });
          const condition3 = await Surveyfamily.countDocuments({
            economics_condition: 3,
          });
          const condition4 = await Surveyfamily.countDocuments({
            economics_condition: 4,
          });
          const condition5 = await Surveyfamily.countDocuments({
            economics_condition: 5,
          });
          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            condition1: condition1,
            condition2: condition2,
            condition3: condition3,
            condition4: condition4,
            condition5: condition5,
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

exports.vehicals_wise_report = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
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
    boothid = parseInt(boothid);
    zoneid = parseInt(zoneid);
    sectorid = parseInt(sectorid);
    blockid = parseInt(blockid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    //

    if (wardid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            wardid: wardid,
            vehicals: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            vehicals: "$vehicals",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
      });
    } else if (boothid >= 1) {
      const allCaste = await Surveyfamily.aggregate([
        {
          $match: {
            boothid: boothid,
            vehicals: { $nin: [null, ""] },
          },
        },

        {
          $project: {
            _id: 0,
            WebId: "$familyid",
            house_no: "$house_no",
            vehicals: "$vehicals",
            familyid: 1,
          },
        },
        { $sort: { "_id.id": 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allCaste,
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
          const vehicals1 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            vehicals: { $regex: /1/, $options: "m" },
          });
          const vehicals2 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            vehicals: { $regex: /2/, $options: "m" },
          });
          const vehicals3 = await Surveyfamily.countDocuments({
            boothid: levelss._id.id,
            vehicals: { $regex: /3/, $options: "m" },
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            vehicals1: vehicals1,
            vehicals2: vehicals2,
            vehicals3: vehicals3,
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
          const vehicals1 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            vehicals: { $regex: /1/, $options: "m" },
          });
          const vehicals2 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            vehicals: { $regex: /2/, $options: "m" },
          });
          const vehicals3 = await Surveyfamily.countDocuments({
            sectorid: levelss._id.id,
            vehicals: { $regex: /3/, $options: "m" },
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            vehicals1: vehicals1,
            vehicals2: vehicals2,
            vehicals3: vehicals3,
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
          const vehicals1 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            vehicals: { $regex: /1/, $options: "m" },
          });
          const vehicals2 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            vehicals: { $regex: /2/, $options: "m" },
          });
          const vehicals3 = await Surveyfamily.countDocuments({
            zoneid: levelss._id.id,
            vehicals: { $regex: /3/, $options: "m" },
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            vehicals1: vehicals1,
            vehicals2: vehicals2,
            vehicals3: vehicals3,
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
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

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
          const vehicals1 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            vehicals: { $regex: /1/, $options: "m" },
          });
          const vehicals2 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            vehicals: { $regex: /2/, $options: "m" },
          });
          const vehicals3 = await Surveyfamily.countDocuments({
            blockid: levelss._id.id,
            vehicals: { $regex: /3/, $options: "m" },
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            vehicals1: vehicals1,
            vehicals2: vehicals2,
            vehicals3: vehicals3,
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
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

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
          const vehicals1 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            vehicals: { $regex: /1/, $options: "m" },
          });
          const vehicals2 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            vehicals: { $regex: /2/, $options: "m" },
          });
          const vehicals3 = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss._id.id,
            vehicals: { $regex: /3/, $options: "m" },
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            vehicals1: vehicals1,
            vehicals2: vehicals2,
            vehicals3: vehicals3,
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
          const vehicals1 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            vehicals: { $regex: /1/, $options: "m" },
          });
          const vehicals2 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            vehicals: { $regex: /2/, $options: "m" },
          });
          const vehicals3 = await Surveyfamily.countDocuments({
            wardid: levelss._id.id,
            vehicals: { $regex: /3/, $options: "m" },
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            vehicals1: vehicals1,
            vehicals2: vehicals2,
            vehicals3: vehicals3,
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
                nikay_en: "$nikay_en",
                nikay: `$nikay_${lang}`,
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
            const vehicals1 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              vehicals: { $regex: /1/, $options: "m" },
            });
            const vehicals2 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              vehicals: { $regex: /2/, $options: "m" },
            });
            const vehicals3 = await Surveyfamily.countDocuments({
              nikayid: levelss._id.id,
              vehicals: { $regex: /3/, $options: "m" },
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.nikay_en,
              name: levelss._id.nikay,
              nikay_type: levelss._id.nikay_type,
              vehicals1: vehicals1,
              vehicals2: vehicals2,
              vehicals3: vehicals3,
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
            const vehicals1 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              vehicals: { $regex: /1/, $options: "m" },
            });
            const vehicals2 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              vehicals: { $regex: /2/, $options: "m" },
            });
            const vehicals3 = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss._id.id,
              vehicals: { $regex: /3/, $options: "m" },
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.vidhansabha_en,
              name: levelss._id.vidhansabha,
              vehicals1: vehicals1,
              vehicals2: vehicals2,
              vehicals3: vehicals3,
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
                jila_en: "$jila_en",
                jila: `$jila_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const vehicals1 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              vehicals: { $regex: /1/, $options: "m" },
            });
            const vehicals2 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              vehicals: { $regex: /2/, $options: "m" },
            });
            const vehicals3 = await Surveyfamily.countDocuments({
              jilaid: levelss._id.id,
              vehicals: { $regex: /3/, $options: "m" },
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.jila_en,
              name: levelss._id.jila,
              vehicals1: vehicals1,
              vehicals2: vehicals2,
              vehicals3: vehicals3,
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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

        const levels = await Loksabha.aggregate([
          { $match: { stateid: stateid } },

          {
            $group: {
              _id: {
                id: "$id",
                loksabha_en: "$loksabha_en",
                loksabha: `$loksabha_${lang1}`,
              },
            },
          },
          { $sort: { "_id.id": 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          levels.map(async (levelss) => {
            const vehicals1 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              vehicals: { $regex: /1/, $options: "m" },
            });
            const vehicals2 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              vehicals: { $regex: /2/, $options: "m" },
            });
            const vehicals3 = await Surveyfamily.countDocuments({
              loksabhaid: levelss._id.id,
              vehicals: { $regex: /3/, $options: "m" },
            });
            return {
              id: levelss._id.id,
              name_en: levelss._id.loksabha_en,
              name: levelss._id.loksabha,
              vehicals1: vehicals1,
              vehicals2: vehicals2,
              vehicals3: vehicals3,
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
              state_en: "$state_en",
              state: `$state_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const vehicals1 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            vehicals: { $regex: /1/, $options: "m" },
          });
          const vehicals2 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            vehicals: { $regex: /2/, $options: "m" },
          });
          const vehicals3 = await Surveyfamily.countDocuments({
            stateid: levelss._id.id,
            vehicals: { $regex: /3/, $options: "m" },
          });
          return {
            id: levelss._id.id,
            name_en: levelss._id.state_en,
            name: levelss._id.state,
            vehicals1: vehicals1,
            vehicals2: vehicals2,
            vehicals3: vehicals3,
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
          const vehicals1 = await Surveyfamily.countDocuments({
            vehicals: { $regex: /1/, $options: "m" },
          });
          const vehicals2 = await Surveyfamily.countDocuments({
            vehicals: { $regex: /2/, $options: "m" },
          });
          const vehicals3 = await Surveyfamily.countDocuments({
            vehicals: { $regex: /3/, $options: "m" },
          });
          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            vehicals1: vehicals1,
            vehicals2: vehicals2,
            vehicals3: vehicals3,
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
exports.educationwise = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      boothid,
      zoneid,
      sectorid,
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
    const allData = await Education.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          name: `$education_${lang}`,
          name_en: 1,
        },
      },
      { $sort: { id: 1 } },
    ]);
    if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
          },
        },
        {
          $group: {
            _id: "$educationid",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "educations",
            localField: "_id",
            foreignField: "id",
            as: "result",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  education: "$education_hi",
                  education_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyvoters",
            localField: "_id",
            foreignField: "educationid",
            as: "familyresult",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$_id",
                  name: "$name",
                  age: 1,
                  fathername: "$rel_name",
                  mobile: 1,
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
            familyresult: 1,
          },
        },
        { $sort: { _id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allData,
      });
    } else if (boothid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            boothid: boothid,
          },
        },
        {
          $group: {
            _id: "$educationid",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "educations",
            localField: "_id",
            foreignField: "id",
            as: "result",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  education: "$education_hi",
                  education_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyvoters",
            localField: "_id",
            foreignField: "educationid",
            as: "familyresult",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$_id",
                  name: "$name",
                  age: 1,
                  fathername: "$rel_name",
                  mobile: 1,
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
            familyresult: 1,
          },
        },
        { $sort: { _id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allData,
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
          const reportdata = await Promise.all(
            allData.map(async (rdata) => {
              const familyCount = await Surveyvoter.countDocuments({
                boothid: levelss._id.id,
                educationid: rdata.id,
              });

              return {
                id: rdata.id,
                name: rdata.name,
                name_en: rdata.name_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            reportdata,
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
          const reportdata = await Promise.all(
            allData.map(async (rdata) => {
              const familyCount = await Surveyvoter.countDocuments({
                sectorid: levelss._id.id,
                educationid: rdata.id,
              });

              return {
                id: rdata.id,
                name: rdata.name,
                name_en: rdata.name_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            reportdata,
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
          const reportdata = await Promise.all(
            allData.map(async (rdata) => {
              const familyCount = await Surveyvoter.countDocuments({
                zoneid: levelss._id.id,
                educationid: rdata.id,
              });

              return {
                id: rdata.id,
                name: rdata.name,
                name_en: rdata.name_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            reportdata,
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
      const count = await Block.countDocuments({ vidhansabha_id: vidhansabhaid });

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
          const reportdata = await Promise.all(
            allData.map(async (rdata) => {
              const familyCount = await Surveyvoter.countDocuments({
                blockid: levelss._id.id,
                educationid: rdata.id,
              });

              return {
                id: rdata.id,
                name: rdata.name,
                name_en: rdata.name_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            reportdata,
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
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

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
          const reportdata = await Promise.all(
            allData.map(async (rdata) => {
              const familyCount = await Surveyvoter.countDocuments({
                vidhansabhaid: levelss._id.id,
                educationid: rdata.id,
              });

              return {
                id: rdata.id,
                name: rdata.name,
                name_en: rdata.name_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            reportdata,
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
          const reportdata = await Promise.all(
            allData.map(async (rdata) => {
              const familyCount = await Surveyvoter.countDocuments({
                wardid: levelss._id.id,
                educationid: rdata.id,
              });

              return {
                id: rdata.id,
                name: rdata.name,
                name_en: rdata.name_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            reportdata,
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
            const reportdata = await Promise.all(
              allData.map(async (rdata) => {
                const familyCount = await Surveyvoter.countDocuments({
                  nikayid: levelss._id.id,
                  educationid: rdata.id,
                });

                return {
                  id: rdata.id,
                  name: rdata.name,
                  name_en: rdata.name_en,
                  familyCount: familyCount,
                };
              })
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              reportdata,
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
            const reportdata = await Promise.all(
              allData.map(async (rdata) => {
                const familyCount = await Surveyvoter.countDocuments({
                  vidhansabhaid: levelss._id.id,
                  educationid: rdata.id,
                });

                return {
                  id: rdata.id,
                  name: rdata.name,
                  name_en: rdata.name_en,
                  familyCount: familyCount,
                };
              })
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              reportdata,
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
            const reportdata = await Promise.all(
              allData.map(async (rdata) => {
                const familyCount = await Surveyvoter.countDocuments({
                  jilaid: levelss._id.id,
                  educationid: rdata.id,
                });

                return {
                  id: rdata.id,
                  name: rdata.name,
                  name_en: rdata.name_en,
                  familyCount: familyCount,
                };
              })
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              reportdata,
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

        const count = await Loksabha.countDocuments({ stateid: stateid });;

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
            const reportdata = await Promise.all(
              allData.map(async (rdata) => {
                const familyCount = await Surveyvoter.countDocuments({
                  loksabhaid: levelss._id.id,
                  educationid: rdata.id,
                });

                return {
                  id: rdata.id,
                  name: rdata.name,
                  name_en: rdata.name_en,
                  familyCount: familyCount,
                };
              })
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              reportdata,
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
          const reportdata = await Promise.all(
            allData.map(async (rdata) => {
              const familyCount = await Surveyvoter.countDocuments({
                stateid: levelss._id.id,
                educationid: rdata.id,
              });

              return {
                id: rdata.id,
                name: rdata.name,
                name_en: rdata.name_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            reportdata,
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
          const reportdata = await Promise.all(
            allData.map(async (rdata) => {
              const familyCount = await Surveyvoter.countDocuments({
                educationid: rdata.id,
              });

              return {
                id: rdata.id,
                name: rdata.name,
                name_en: rdata.name_en,
                familyCount: familyCount,
              };
            })
          );

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            reportdata,
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
