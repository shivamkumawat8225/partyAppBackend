const Booth = require("../../../../models/boothModel");
const Block = require("../../../../models/blockModel");
const Vidhansabha = require("../../../../models/vidhansabhaModel");
const Jila = require("../../../../models/jilaModel");
const Loksabha = require("../../../../models/loksabhaModel");
const State = require("../../../../models/stateModel");
const Nikay = require("../../../../models/nikayModel");
const Ward = require("../../../../models/wardModel");
const Zone = require("../../../../models/zoneModel");
const Sector = require("../../../../models/sectorModel");
const Familysurvey = require("../../../../models/surveyfamilyModel");

const creatError = require("../../../../utils/appError");
const Surveyfamily = require("../../../../models/surveyfamilyModel");
const Surveyvoter = require("../../../../models/surveyvoterModel");
const Education = require("../../../../models/educationModel");
const Profession = require("../../../../models/professionModel");
const Party = require("../../../../models/party");
const Gender = require("../../../../models/genderModel");
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
exports.educationwise = async (req, res, next) => {
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    const allData = await Education.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          name: `$education_${lang}`,
          name_en: `$education_en`,
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
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$wardid", wardid] }],
                  },
                },
              },
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
            count: 1,
            id: "$_id",
            result: { $arrayElemAt: ["$result", 0] },
            familyresult: 1,
          },
        },
        { $sort: { id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allData,
      });
    }
    else if (boothid >= 1) {
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
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$boothid", boothid] }],
                  },
                },
              },
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
            count: 1,
            id: "$_id",
            result: { $arrayElemAt: ["$result", 0] },
            familyresult: 1,
          },
        },
        { $sort: { id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allData,
      });
    }
    else if (level === "booth") {
      const count = await Booth.countDocuments({ id: { $in: users[0].boothid } });
      const levels = await Booth.aggregate([
        { $match: { id: { $in: users[0].boothid } } },
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
    }
    else if (sectorid >= 1) {
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
    }
    else if (zoneid >= 1) {
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
    }
    else if (level === "sector") {
      const count = await Sector.countDocuments({ id: { $in: users[0].sectorid } });

      const levels = await Sector.aggregate([
        { $match: { id: { $in: users[0].sectorid } } },

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
    }
    else if (blockid >= 1) {
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
    }
    else if (level === "zone") {
      const count = await Zone.countDocuments({ id: { $in: users[0].zoneid } });

      const levels = await Zone.aggregate([
        { $match: { id: { $in: users[0].zoneid } } },

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
    }
    else if (level === "block") {
      const count = await Block.countDocuments({ id: { $in: users[0].blockid } });
      const levels = await Block.aggregate([
        { $match: { id: { $in: users[0].blockid } } },
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
    }
    else if (vidhansabhaid >= 1) {
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
    }
    else if (loksabhaid >= 1) {
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
    }
    else if (level === "vidhansabha") {
      const count = await Vidhansabha.countDocuments({ id: { $in: users[0].vidhansabhid } });

      const levels = await Vidhansabha.aggregate([
        { $match: { id: { $in: users[0].vidhansabhid } } },

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
    }
    else if (nikayid >= 1) {
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
    }
    else if (level === "ward") {
      const count = await Ward.countDocuments({ id: { $in: users[0].wardid } });

      const levels = await Ward.aggregate([
        { $match: { id: { $in: users[0].wardid } } },

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
    }
    else if (jilaid >= 1) {
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
    }
    else if (level === "nikay") {
      const count = await Nikay.countDocuments({ id: { $in: users[0].nikayid } });
      const levels = await Nikay.aggregate([
        { $match: { id: { $in: users[0].nikayid } } },
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

    }
    else if (stateid >= 1) {
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
    }
    else if (level === "loksabha") {
      var lang1 = lang;
      const count = await Loksabha.countDocuments({ id: { $in: users[0].loksabhaid } });

      const levels = await Loksabha.aggregate([
        { $match: { id: { $in: users[0].loksabhaid } } },
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

    } else if (level === "jila") {

      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      const count = await Jila.countDocuments({ id: { $in: users[0].jilaid } });

      const levels = await Jila.aggregate([
        { $match: { id: { $in: users[0].jilaid } } },

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
    } else if (level === "state") {
      const count = await State.countDocuments({ id: { $in: users[0].stateid } });
      const levels = await State.aggregate([
        {
          $match: { id: { $in: users[0].stateid } }
        },
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
    }
    else if (level === "national") {
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
    }
    else {
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
exports.professionwise = async (req, res, next) => {
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    const allData = await Profession.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          name: `$profession_${lang}`,
          name_en: `$profession_en`,
        },
      },
      { $sort: { id: 1 } },
    ]);
    if (boothid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            boothid: boothid,
          },
        },
        {
          $group: {
            _id: "$professionid",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "professions",
            localField: "_id",
            foreignField: "id",
            as: "result",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  profession: "$profession_hi",
                  profession_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyvoters",
            localField: "_id",
            foreignField: "professionid",
            as: "familyresult",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$boothid", boothid] }],
                  },
                },
              },
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
            count: 1,
            id: "$_id",
            result: { $arrayElemAt: ["$result", 0] },
            familyresult: 1,
          },
        },
        { $sort: { id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allData,
      });
    } else if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
          },
        },
        {
          $group: {
            _id: "$professionid",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "professions",
            localField: "_id",
            foreignField: "id",
            as: "result",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  profession: "$profession_hi",
                  profession_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyvoters",
            localField: "_id",
            foreignField: "professionid",
            as: "familyresult",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$wardid", wardid] }],
                  },
                },
              },
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
            count: 1,
            id: "$_id",
            result: { $arrayElemAt: ["$result", 0] },
            familyresult: 1,
          },
        },
        { $sort: { id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allData,
      });
    }
    else if (level === "booth") {
      const count = await Booth.countDocuments({ id: { $in: users[0].boothid } });

      const levels = await Booth.aggregate([
        { $match: { id: { $in: users[0].boothid } } },

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
                professionid: rdata.id,
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
    }
    else if (sectorid >= 1) {
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
                professionid: rdata.id,
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
    }
    else if (zoneid >= 1) {
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
                professionid: rdata.id,
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
    }
    else if (level === "sector") {
      const count = await Sector.countDocuments({ id: { $in: users[0].sectorid } });

      const levels = await Sector.aggregate([
        { $match: { id: { $in: users[0].sectorid } } },

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
                professionid: rdata.id,
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
    }
    else if (blockid >= 1) {
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
                professionid: rdata.id,
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
    }
    else if (level === "zone") {
      const count = await Zone.countDocuments({ id: { $in: users[0].zoneid } });

      const levels = await Zone.aggregate([
        { $match: { id: { $in: users[0].zoneid } } },

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
                professionid: rdata.id,
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
    }
    else if (vidhansabhaid >= 1) {
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
                professionid: rdata.id,
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
    }
    else if (level === "block") {
      const count = await Block.countDocuments({ id: { $in: users[0].blockid } });

      const levels = await Block.aggregate([
        { $match: { id: { $in: users[0].blockid } } },

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
                professionid: rdata.id,
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
    }
    else if (loksabhaid >= 1) {
      const count = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });

      const levels = await Vidhansabha.aggregate([
        { $match: { loksabha_id: loksabhaid } },

        {
          $group: {
            _id: {
              id: "$id",
              vidhansabh_en: "$vidhansabh_en",
              vidhansabh: `$vidhansabh_${lang1}`,
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
                vidhansabhid: levelss._id.id,
                professionid: rdata.id,
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
            name_en: levelss._id.vidhansabh_en,
            name: levelss._id.vidhansabh,
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
    }
    else if (nikayid >= 1) {
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
                professionid: rdata.id,
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
    }
    else if (level === "ward") {
      const count = await Ward.countDocuments({ id: { $in: users[0].wardid } });

      const levels = await Ward.aggregate([
        { $match: { id: { $in: users[0].wardid } } },

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
                professionid: rdata.id,
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
    }
    else if (jilaid >= 1) {
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
                  professionid: rdata.id,
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
                  professionid: rdata.id,
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
    }
    else if (stateid >= 1) {
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
                  professionid: rdata.id,
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
            const reportdata = await Promise.all(
              allData.map(async (rdata) => {
                const familyCount = await Surveyvoter.countDocuments({
                  loksabhaid: levelss._id.id,
                  professionid: rdata.id,
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
    }
    else if (countryid >= 1) {
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
                professionid: rdata.id,
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
    }
    else {
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
                professionid: rdata.id,
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
exports.partywise = async (req, res, next) => {
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    const allData = await Party.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          name: `$party_${lang}`,
          name_en: `$party_en`,
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
            _id: "$partyid",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "parties",
            localField: "_id",
            foreignField: "id",
            as: "result",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  party: "$party_hi",
                  party_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyvoters",
            localField: "_id",
            foreignField: "partyid",
            as: "familyresult",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$wardid", wardid] }],
                  },
                },
              },
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
            count: 1,
            _id: 0,
            id: "$_id",
            result: { $arrayElemAt: ["$result", 0] },
            familyresult: 1,
          },
        },
        { $sort: { id: 1 } },
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
            _id: "$partyid",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "parties",
            localField: "_id",
            foreignField: "id",
            as: "result",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  party: "$party_hi",
                  party_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyvoters",
            localField: "_id",
            foreignField: "partyid",
            as: "familyresult",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$boothid", boothid] }],
                  },
                },
              },
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
            count: 1,
            _id: 0,
            id: "$_id",
            result: { $arrayElemAt: ["$result", 0] },
            familyresult: 1,
          },
        },
        { $sort: { id: 1 } },
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
                partyid: rdata.id,
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
                partyid: rdata.id,
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
                partyid: rdata.id,
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
                partyid: rdata.id,
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
                partyid: rdata.id,
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
                partyid: rdata.id,
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
                  partyid: rdata.id,
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
                  partyid: rdata.id,
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
                  partyid: rdata.id,
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
            const reportdata = await Promise.all(
              allData.map(async (rdata) => {
                const familyCount = await Surveyvoter.countDocuments({
                  loksabhaid: levelss._id.id,
                  partyid: rdata.id,
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
                partyid: rdata.id,
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
                partyid: rdata.id,
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
exports.genderywise = async (req, res, next) => {
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
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

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
    const allData = await Gender.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          name: `$gender_${lang}`,
          name_en: `$gender_en`,
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
            _id: "$gender",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "genders",
            localField: "_id",
            foreignField: "id",
            as: "result",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  gender: "$gender_hi",
                  gender_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyvoters",
            localField: "_id",
            foreignField: "gender",
            as: "familyresult",

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$wardid", wardid] }],
                  },
                },
              },
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
            count: 1,
            id: "$_id",
            result: { $arrayElemAt: ["$result", 0] },
            familyresult: 1,
          },
        },
        { $sort: { id: 1 } },
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
            _id: "$gender",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "genders",
            localField: "_id",
            foreignField: "id",
            as: "result",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  WebId: "$id",
                  gender: "$gender_hi",
                  gender_en: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "surveyvoters",
            localField: "_id",
            foreignField: "gender",
            as: "familyresult",

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$boothid", boothid] }],
                  },
                },
              },
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
            count: 1,
            id: "$_id",
            result: { $arrayElemAt: ["$result", 0] },
            familyresult: 1,
          },
        },
        { $sort: { id: 1 } },
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
                gender: rdata.id,
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
                gender: rdata.id,
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
                gender: rdata.id,
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
                gender: rdata.id,
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
                gender: rdata.id,
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
                gender: rdata.id,
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
                  gender: rdata.id,
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
                  gender: rdata.id,
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
                  gender: rdata.id,
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
            const reportdata = await Promise.all(
              allData.map(async (rdata) => {
                const familyCount = await Surveyvoter.countDocuments({
                  loksabhaid: levelss._id.id,
                  gender: rdata.id,
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
                gender: rdata.id,
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
                gender: rdata.id,
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

exports.allwhatsapp = async (req, res, next) => {
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;


    if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            whatsapp: 1,
          },
        },
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
            whatsapp: 1,
          },
        },
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
          const count1 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            whatsapp: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            whatsapp: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            whatsapp: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            whatsapp: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            whatsapp: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            whatsapp: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              whatsapp: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              whatsapp: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              whatsapp: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              whatsapp: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            whatsapp: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            whatsapp: 1,
          });

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            count: count1,
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

exports.educationstatus = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      zoneid,
      sectorid,
      boothid,
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    if (wardid >= 1) {
      const allData1 = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            education_status: 0,
          },
        },
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
        { $sort: { _id: 1 } },
      ]);
      const allData2 = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            education_status: 1,
          },
        },
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
        { $sort: { _id: 1 } },
      ]);
      const educationstatus = {
        educationend: allData1,
        educationrunning: allData2,
      };
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: educationstatus,
      });
    } else if (boothid >= 1) {
      const allData1 = await Surveyvoter.aggregate([
        {
          $match: {
            boothid: boothid,
            education_status: 0,
          },
        },
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
        { $sort: { _id: 1 } },
      ]);
      const allData2 = await Surveyvoter.aggregate([
        {
          $match: {
            boothid: boothid,
            education_status: 1,
          },
        },
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
        { $sort: { _id: 1 } },
      ]);
      const educationstatus = {
        educationend: allData1,
        educationrunning: allData2,
      };
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: educationstatus,
      });
    } else if (sectorid >= 1) {
      const count = await Booth.countDocuments({ sector_id: sectorid });

      const levels = await Booth.aggregate([
        { $match: { sector_id: sectorid } },

        {
          $group: {
            _id: {
              id: "$id",
              name_en: "$booth_en",
              name: `$booth_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const count1 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            education_status: 1,
          });
          const count2 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            education_status: 0,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            running: count1,
            end: count2,
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
              name_en: "$sector_en",
              name: `$sector_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const count1 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            education_status: 1,
          });
          const count2 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            education_status: 0,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            running: count1,
            end: count2,
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
              name_en: "$zone_en",
              name: `$zone_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const count1 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            education_status: 1,
          });
          const count2 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            education_status: 0,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            running: count1,
            end: count2,
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
              name_en: "$block_en",
              name: `$block_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const count1 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            education_status: 1,
          });
          const count2 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            education_status: 0,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            running: count1,
            end: count2,
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
          const count1 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            education_status: 1,
          });
          const count2 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            education_status: 0,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            running: count1,
            end: count2,
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
              name_en: "$ward_en",
              name: `$ward_${lang}`,
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
          const count1 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            education_status: 1,
          });
          const count2 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            education_status: 0,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            ward_type: levelss._id.ward_type,
            running: count1,
            end: count2,
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
            const count1 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              education_status: 1,
            });
            const count2 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              education_status: 0,
            });


            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              running: count1,
              end: count2,
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
            const count1 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              education_status: 1,
            });
            const count2 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              education_status: 0,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              running: count1,
              end: count2,
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
            const count1 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              education_status: 1,
            });
            const count2 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              education_status: 0,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              running: count1,
              end: count2,
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
            const count1 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              education_status: 1,
            });
            const count2 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              education_status: 0,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              running: count1,
              end: count2,
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
          const count1 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            education_status: 1,
          });
          const count2 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            education_status: 0,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            running: count1,
            end: count2,
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
          const count1 = await Surveyvoter.countDocuments({
            education_status: 1,
          });
          const count2 = await Surveyvoter.countDocuments({
            education_status: 0,
          });

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            running: count1,
            end: count2,
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

exports.agewise = async (req, res, next) => {
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
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    async function getVotersByAge(params1, params2) {
      const ageDta = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
          },
        },
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
        { $sort: { _id: 1 } },
      ]);
      return ageDta;
    }
    async function getVotersByAgeBooth(params1, params2) {
      const ageDta = await Surveyvoter.aggregate([
        {
          $match: {
            boothid: boothid,
            $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
          },
        },
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
        { $sort: { _id: 1 } },
      ]);
      return ageDta;
    }
    async function getCountByid(params1, params2, level, levelid) {
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
      } else {
        query = {
          $and: [{ age: { $gte: params1 } }, { age: { $lte: params2 } }],
        };
      }
      const agegroup = await Surveyvoter.countDocuments(query);
      return agegroup;
    }
    if (wardid >= 1) {
      const age1 = await getVotersByAge(0, 12);
      const age2 = await getVotersByAge(13, 17);
      const age3 = await getVotersByAge(18, 20);
      const age4 = await getVotersByAge(21, 30);
      const age5 = await getVotersByAge(31, 40);
      const age6 = await getVotersByAge(41, 50);
      const age7 = await getVotersByAge(51, 60);
      const age8 = await getVotersByAge(61, 70);
      const age9 = await getVotersByAge(71, 80);
      const age10 = await getVotersByAge(81, 120);

      const ageData = {
        age0_12: age1,
        age13_17: age2,
        age18_20: age3,
        age21_30: age4,
        age31_40: age5,
        age41_50: age6,
        age51_60: age7,
        age61_70: age8,
        age71_80: age9,
        age81: age10,
      };
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: ageData,
      });
    } else if (boothid >= 1) {
      const age1 = await getVotersByAgeBooth(0, 12);
      const age2 = await getVotersByAgeBooth(13, 17);
      const age3 = await getVotersByAgeBooth(18, 20);
      const age4 = await getVotersByAgeBooth(21, 30);
      const age5 = await getVotersByAgeBooth(31, 40);
      const age6 = await getVotersByAgeBooth(41, 50);
      const age7 = await getVotersByAgeBooth(51, 60);
      const age8 = await getVotersByAgeBooth(61, 70);
      const age9 = await getVotersByAgeBooth(71, 80);
      const age10 = await getVotersByAgeBooth(81, 120);

      const ageData = {
        age0_12: age1,
        age13_17: age2,
        age18_20: age3,
        age21_30: age4,
        age31_40: age5,
        age41_50: age6,
        age51_60: age7,
        age61_70: age8,
        age71_80: age9,
        age81: age10,
      };
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: ageData,
      });
    } else if (sectorid >= 1) {
      const count = await Booth.countDocuments({ sector_id: sectorid });
      const levels = await Booth.aggregate([
        { $match: { sector_id: sectorid } },

        {
          $group: {
            _id: {
              id: "$id",
              name_en: "$booth_en",
              name: `$booth_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const age1 = await getCountByid(0, 12, "booth", levelss._id.id);
          const age2 = await getCountByid(13, 17, "booth", levelss._id.id);
          const age3 = await getCountByid(18, 20, "booth", levelss._id.id);
          const age4 = await getCountByid(21, 30, "booth", levelss._id.id);
          const age5 = await getCountByid(31, 40, "booth", levelss._id.id);
          const age6 = await getCountByid(41, 50, "booth", levelss._id.id);
          const age7 = await getCountByid(51, 60, "booth", levelss._id.id);
          const age8 = await getCountByid(61, 70, "booth", levelss._id.id);
          const age9 = await getCountByid(71, 80, "booth", levelss._id.id);
          const age10 = await getCountByid(81, 120, "booth", levelss._id.id);

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            age0_12: age1,
            age13_17: age2,
            age18_20: age3,
            age21_30: age4,
            age31_40: age5,
            age41_50: age6,
            age51_60: age7,
            age61_70: age8,
            age71_80: age9,
            age81: age10,
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
              name_en: "$sector_en",
              name: `$sector_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const age1 = await getCountByid(0, 12, "sector", levelss._id.id);
          const age2 = await getCountByid(13, 17, "sector", levelss._id.id);
          const age3 = await getCountByid(18, 20, "sector", levelss._id.id);
          const age4 = await getCountByid(21, 30, "sector", levelss._id.id);
          const age5 = await getCountByid(31, 40, "sector", levelss._id.id);
          const age6 = await getCountByid(41, 50, "sector", levelss._id.id);
          const age7 = await getCountByid(51, 60, "sector", levelss._id.id);
          const age8 = await getCountByid(61, 70, "sector", levelss._id.id);
          const age9 = await getCountByid(71, 80, "sector", levelss._id.id);
          const age10 = await getCountByid(81, 120, "sector", levelss._id.id);

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            age0_12: age1,
            age13_17: age2,
            age18_20: age3,
            age21_30: age4,
            age31_40: age5,
            age41_50: age6,
            age51_60: age7,
            age61_70: age8,
            age71_80: age9,
            age81: age10,
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
              name_en: "$zone_en",
              name: `$zone_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const age1 = await getCountByid(0, 12, "zone", levelss._id.id);
          const age2 = await getCountByid(13, 17, "zone", levelss._id.id);
          const age3 = await getCountByid(18, 20, "zone", levelss._id.id);
          const age4 = await getCountByid(21, 30, "zone", levelss._id.id);
          const age5 = await getCountByid(31, 40, "zone", levelss._id.id);
          const age6 = await getCountByid(41, 50, "zone", levelss._id.id);
          const age7 = await getCountByid(51, 60, "zone", levelss._id.id);
          const age8 = await getCountByid(61, 70, "zone", levelss._id.id);
          const age9 = await getCountByid(71, 80, "zone", levelss._id.id);
          const age10 = await getCountByid(81, 120, "zone", levelss._id.id);

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            age0_12: age1,
            age13_17: age2,
            age18_20: age3,
            age21_30: age4,
            age31_40: age5,
            age41_50: age6,
            age51_60: age7,
            age61_70: age8,
            age71_80: age9,
            age81: age10,
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
              name_en: "$block_en",
              name: `$block_${lang}`,
            },
          },
        },
        { $sort: { "_id.id": 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss) => {
          const age1 = await getCountByid(0, 12, "block", levelss._id.id);
          const age2 = await getCountByid(13, 17, "block", levelss._id.id);
          const age3 = await getCountByid(18, 20, "block", levelss._id.id);
          const age4 = await getCountByid(21, 30, "block", levelss._id.id);
          const age5 = await getCountByid(31, 40, "block", levelss._id.id);
          const age6 = await getCountByid(41, 50, "block", levelss._id.id);
          const age7 = await getCountByid(51, 60, "block", levelss._id.id);
          const age8 = await getCountByid(61, 70, "block", levelss._id.id);
          const age9 = await getCountByid(71, 80, "block", levelss._id.id);
          const age10 = await getCountByid(81, 120, "block", levelss._id.id);

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            age0_12: age1,
            age13_17: age2,
            age18_20: age3,
            age21_30: age4,
            age31_40: age5,
            age41_50: age6,
            age51_60: age7,
            age61_70: age8,
            age71_80: age9,
            age81: age10,
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
          const age1 = await getCountByid(0, 12, "vidhansabha", levelss._id.id);
          const age2 = await getCountByid(
            13,
            17,
            "vidhansabha",
            levelss._id.id
          );
          const age3 = await getCountByid(
            18,
            20,
            "vidhansabha",
            levelss._id.id
          );
          const age4 = await getCountByid(
            21,
            30,
            "vidhansabha",
            levelss._id.id
          );
          const age5 = await getCountByid(
            31,
            40,
            "vidhansabha",
            levelss._id.id
          );
          const age6 = await getCountByid(
            41,
            50,
            "vidhansabha",
            levelss._id.id
          );
          const age7 = await getCountByid(
            51,
            60,
            "vidhansabha",
            levelss._id.id
          );
          const age8 = await getCountByid(
            61,
            70,
            "vidhansabha",
            levelss._id.id
          );
          const age9 = await getCountByid(
            71,
            80,
            "vidhansabha",
            levelss._id.id
          );
          const age10 = await getCountByid(
            81,
            120,
            "vidhansabha",
            levelss._id.id
          );

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            age0_12: age1,
            age13_17: age2,
            age18_20: age3,
            age21_30: age4,
            age31_40: age5,
            age41_50: age6,
            age51_60: age7,
            age61_70: age8,
            age71_80: age9,
            age81: age10,
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
              name_en: "$ward_en",
              name: `$ward_${lang}`,
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
          const age1 = await getCountByid(0, 12, "ward", levelss._id.id);
          const age2 = await getCountByid(13, 17, "ward", levelss._id.id);
          const age3 = await getCountByid(18, 20, "ward", levelss._id.id);
          const age4 = await getCountByid(21, 30, "ward", levelss._id.id);
          const age5 = await getCountByid(31, 40, "ward", levelss._id.id);
          const age6 = await getCountByid(41, 50, "ward", levelss._id.id);
          const age7 = await getCountByid(51, 60, "ward", levelss._id.id);
          const age8 = await getCountByid(61, 70, "ward", levelss._id.id);
          const age9 = await getCountByid(71, 80, "ward", levelss._id.id);
          const age10 = await getCountByid(81, 120, "ward", levelss._id.id);

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            ward_type: levelss._id.ward_type,
            age0_12: age1,
            age13_17: age2,
            age18_20: age3,
            age21_30: age4,
            age31_40: age5,
            age41_50: age6,
            age51_60: age7,
            age61_70: age8,
            age71_80: age9,
            age81: age10,
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
            const age1 = await getCountByid(0, 12, "nikay", levelss._id.id);
            const age2 = await getCountByid(13, 17, "nikay", levelss._id.id);
            const age3 = await getCountByid(18, 20, "nikay", levelss._id.id);
            const age4 = await getCountByid(21, 30, "nikay", levelss._id.id);
            const age5 = await getCountByid(31, 40, "nikay", levelss._id.id);
            const age6 = await getCountByid(41, 50, "nikay", levelss._id.id);
            const age7 = await getCountByid(51, 60, "nikay", levelss._id.id);
            const age8 = await getCountByid(61, 70, "nikay", levelss._id.id);
            const age9 = await getCountByid(71, 80, "nikay", levelss._id.id);
            const age10 = await getCountByid(81, 120, "nikay", levelss._id.id);

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              age0_12: age1,
              age13_17: age2,
              age18_20: age3,
              age21_30: age4,
              age31_40: age5,
              age41_50: age6,
              age51_60: age7,
              age61_70: age8,
              age71_80: age9,
              age81: age10,
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
            const age1 = await getCountByid(
              0,
              12,
              "vidhansabha",
              levelss._id.id
            );
            const age2 = await getCountByid(
              13,
              17,
              "vidhansabha",
              levelss._id.id
            );
            const age3 = await getCountByid(
              18,
              20,
              "vidhansabha",
              levelss._id.id
            );
            const age4 = await getCountByid(
              21,
              30,
              "vidhansabha",
              levelss._id.id
            );
            const age5 = await getCountByid(
              31,
              40,
              "vidhansabha",
              levelss._id.id
            );
            const age6 = await getCountByid(
              41,
              50,
              "vidhansabha",
              levelss._id.id
            );
            const age7 = await getCountByid(
              51,
              60,
              "vidhansabha",
              levelss._id.id
            );
            const age8 = await getCountByid(
              61,
              70,
              "vidhansabha",
              levelss._id.id
            );
            const age9 = await getCountByid(
              71,
              80,
              "vidhansabha",
              levelss._id.id
            );
            const age10 = await getCountByid(
              81,
              120,
              "vidhansabha",
              levelss._id.id
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              age0_12: age1,
              age13_17: age2,
              age18_20: age3,
              age21_30: age4,
              age31_40: age5,
              age41_50: age6,
              age51_60: age7,
              age61_70: age8,
              age71_80: age9,
              age81: age10,
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
            const age1 = await getCountByid(0, 12, "jila", levelss._id.id);
            const age2 = await getCountByid(13, 17, "jila", levelss._id.id);
            const age3 = await getCountByid(18, 20, "jila", levelss._id.id);
            const age4 = await getCountByid(21, 30, "jila", levelss._id.id);
            const age5 = await getCountByid(31, 40, "jila", levelss._id.id);
            const age6 = await getCountByid(41, 50, "jila", levelss._id.id);
            const age7 = await getCountByid(51, 60, "jila", levelss._id.id);
            const age8 = await getCountByid(61, 70, "jila", levelss._id.id);
            const age9 = await getCountByid(71, 80, "jila", levelss._id.id);
            const age10 = await getCountByid(81, 120, "jila", levelss._id.id);

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              age0_12: age1,
              age13_17: age2,
              age18_20: age3,
              age21_30: age4,
              age31_40: age5,
              age41_50: age6,
              age51_60: age7,
              age61_70: age8,
              age71_80: age9,
              age81: age10,
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
            const age1 = await getCountByid(0, 12, "loksabha", levelss._id.id);
            const age2 = await getCountByid(13, 17, "loksabha", levelss._id.id);
            const age3 = await getCountByid(18, 20, "loksabha", levelss._id.id);
            const age4 = await getCountByid(21, 30, "loksabha", levelss._id.id);
            const age5 = await getCountByid(31, 40, "loksabha", levelss._id.id);
            const age6 = await getCountByid(41, 50, "loksabha", levelss._id.id);
            const age7 = await getCountByid(51, 60, "loksabha", levelss._id.id);
            const age8 = await getCountByid(61, 70, "loksabha", levelss._id.id);
            const age9 = await getCountByid(71, 80, "loksabha", levelss._id.id);
            const age10 = await getCountByid(
              81,
              120,
              "loksabha",
              levelss._id.id
            );

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              age0_12: age1,
              age13_17: age2,
              age18_20: age3,
              age21_30: age4,
              age31_40: age5,
              age41_50: age6,
              age51_60: age7,
              age61_70: age8,
              age71_80: age9,
              age81: age10,
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
          const age1 = await getCountByid(0, 12, "state", levelss._id.id);
          const age2 = await getCountByid(13, 17, "state", levelss._id.id);
          const age3 = await getCountByid(18, 20, "state", levelss._id.id);
          const age4 = await getCountByid(21, 30, "state", levelss._id.id);
          const age5 = await getCountByid(31, 40, "state", levelss._id.id);
          const age6 = await getCountByid(41, 50, "state", levelss._id.id);
          const age7 = await getCountByid(51, 60, "state", levelss._id.id);
          const age8 = await getCountByid(61, 70, "state", levelss._id.id);
          const age9 = await getCountByid(71, 80, "state", levelss._id.id);
          const age10 = await getCountByid(81, 120, "state", levelss._id.id);

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            age0_12: age1,
            age13_17: age2,
            age18_20: age3,
            age21_30: age4,
            age31_40: age5,
            age41_50: age6,
            age51_60: age7,
            age61_70: age8,
            age71_80: age9,
            age81: age10,
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
          const age1 = await getCountByid(0, 12, "country", levelss.id);
          const age2 = await getCountByid(13, 17, "country", levelss.id);
          const age3 = await getCountByid(18, 20, "country", levelss.id);
          const age4 = await getCountByid(21, 30, "country", levelss.id);
          const age5 = await getCountByid(31, 40, "country", levelss.id);
          const age6 = await getCountByid(41, 50, "country", levelss.id);
          const age7 = await getCountByid(51, 60, "country", levelss.id);
          const age8 = await getCountByid(61, 70, "country", levelss.id);
          const age9 = await getCountByid(71, 80, "country", levelss.id);
          const age10 = await getCountByid(81, 120, "country", levelss.id);

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            age0_12: age1,
            age13_17: age2,
            age18_20: age3,
            age21_30: age4,
            age31_40: age5,
            age41_50: age6,
            age51_60: age7,
            age61_70: age8,
            age71_80: age9,
            age81: age10,
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
exports.disablevoter = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      zoneid,
      sectorid,
      boothid,
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            disable_voter: 1,
          },
        },
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
        { $sort: { _id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allData,
      });
    } else if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            disable_voter: 1,
          },
        },
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
            disable_voter: 1,
          },
        },
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
          const count1 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            disable_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            disable_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            disable_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            disable_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            disable_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            disable_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              disable_voter: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              disable_voter: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              disable_voter: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              disable_voter: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            disable_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            disable_voter: 1,
          });

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            count: count1,
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
exports.caste_dominant = async (req, res, next) => {
  try {
    var {
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
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            caste_dominant: 1,
          },
        },
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
            caste_dominant: 1,
          },
        },
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
        { $sort: { _id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allData,
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
          const count1 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            caste_dominant: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            caste_dominant: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            caste_dominant: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            caste_dominant: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            caste_dominant: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            caste_dominant: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              caste_dominant: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              caste_dominant: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              caste_dominant: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              caste_dominant: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            caste_dominant: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            caste_dominant: 1,
          });

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            count: count1,
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

exports.head_of_religion = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      jilaid,
      stateid,
      countryid,
      zoneid,
      sectorid,
      boothid,
      limit,
      skip,
      app_type,
    } = req.body;
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            head_of_religion: 1,
          },
        },
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
            head_of_religion: 1,
          },
        },
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
        { $sort: { _id: 1 } },
      ]);
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: 0,
        data: [],
        familydata: allData,
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
          const count1 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            head_of_religion: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            head_of_religion: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            head_of_religion: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            head_of_religion: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            head_of_religion: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            head_of_religion: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              head_of_religion: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              head_of_religion: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              head_of_religion: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              head_of_religion: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            head_of_religion: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            head_of_religion: 1,
          });

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            count: count1,
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

exports.first_time_voter = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      jilaid,
      zoneid,
      sectorid,
      boothid,
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            first_time_voter: 1,
          },
        },
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
            first_time_voter: 1,
          },
        },
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
          const count1 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            first_time_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            first_time_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            first_time_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            first_time_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            first_time_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            first_time_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              first_time_voter: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              first_time_voter: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              first_time_voter: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              first_time_voter: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            first_time_voter: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            first_time_voter: 1,
          });

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            count: count1,
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
exports.booth_speaker = async (req, res, next) => {
  try {
    var {
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
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            booth_speaker: 1,
          },
        },
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
            booth_speaker: 1,
          },
        },
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
          const count1 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            booth_speaker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            booth_speaker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            booth_speaker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            booth_speaker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            booth_speaker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            booth_speaker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              booth_speaker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              booth_speaker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              booth_speaker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              booth_speaker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            booth_speaker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            booth_speaker: 1,
          });

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            count: count1,
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
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
exports.support_worker = async (req, res, next) => {
  try {
    var {
      lang,
      levletype,
      blockid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      zoneid,
      sectorid,
      boothid,
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            support_worker: 1,
          },
        },
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
            support_worker: 1,
          },
        },
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
          const count1 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            support_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            support_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            support_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            support_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            support_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            support_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              support_worker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              support_worker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              support_worker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              support_worker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            support_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            support_worker: 1,
          });

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            count: count1,
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
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
exports.opposite_party_worker = async (req, res, next) => {
  try {
    var {
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
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
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
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    if (wardid >= 1) {
      const allData = await Surveyvoter.aggregate([
        {
          $match: {
            wardid: wardid,
            opposite_party_worker: 1,
          },
        },
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
            opposite_party_worker: 1,
          },
        },
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
          const count1 = await Surveyvoter.countDocuments({
            boothid: levelss._id.id,
            opposite_party_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.booth_en,
            name: levelss._id.booth,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            sectorid: levelss._id.id,
            opposite_party_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.sector_en,
            name: levelss._id.sector,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            zoneid: levelss._id.id,
            opposite_party_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.zone_en,
            name: levelss._id.zone,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            blockid: levelss._id.id,
            opposite_party_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.block_en,
            name: levelss._id.block,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            vidhansabhaid: levelss._id.id,
            opposite_party_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.vidhansabha_en,
            name: levelss._id.vidhansabha,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            wardid: levelss._id.id,
            opposite_party_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.ward_en,
            name: levelss._id.ward,
            ward_type: levelss._id.ward_type,
            count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              nikayid: levelss._id.id,
              opposite_party_worker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              nikay_type: levelss._id.nikay_type,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              vidhansabhaid: levelss._id.id,
              opposite_party_worker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              jilaid: levelss._id.id,
              opposite_party_worker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
            const count1 = await Surveyvoter.countDocuments({
              loksabhaid: levelss._id.id,
              opposite_party_worker: 1,
            });

            return {
              id: levelss._id.id,
              name_en: levelss._id.name_en,
              name: levelss._id.name,
              count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            stateid: levelss._id.id,
            opposite_party_worker: 1,
          });

          return {
            id: levelss._id.id,
            name_en: levelss._id.name_en,
            name: levelss._id.name,
            count: count1,
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
          const count1 = await Surveyvoter.countDocuments({
            opposite_party_worker: 1,
          });

          return {
            id: levelss.id,
            name_en: levelss.name_en,
            name: levelss.name,
            count: count1,
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
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
