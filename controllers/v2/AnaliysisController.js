const Booth = require("../../models/boothModel");
const Block = require("../../models/blockModel");
const Vidhansabha = require("../../models/vidhansabhaModel");
const Jila = require("../../models/jilaModel");
const Loksabha = require("../../models/loksabhaModel");
const State = require("../../models/stateModel");
const Nikay = require("../../models/nikayModel");
const Ward = require("../../models/wardModel");
const Sector = require("../../models/sectorModel");

const creatError = require("../../utils/appError");
const User = require("../../models/userModel");
const Surveyfamily = require("../../models/surveyfamilyModel");
const Zone = require("../../models/zoneModel");

exports.levelList = async (req, res, next) => {
  try {
    var data = [];
    var counts = 0;
    var {
      lang,
      levletype,
      blockid,
      zoneid,
      sectorid,

      vidhansabhaid,
      loksabhaid,
      nikayid,
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
    nikayid = parseInt(nikayid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    const d = `categoryData.category${lang}`;

    if (sectorid > 0) {
      var lang1 = lang;

      counts = await Booth.countDocuments({ sector_id: parseInt(sectorid) });
      data = await Booth.aggregate([
        { $match: { sector_id: parseInt(sectorid) } },
        {
          $project: {
            _id: 0,
            id: 1,
            booth: `$booth_${lang1}`,
            booth_en: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        { $sort: { id: 1 } },
      ]);
      const finalResult = await Promise.all(
        data.map(async (levelss) => {
          const completedcounts = await Surveyfamily.countDocuments({
            boothid: levelss.id,
          });
          const approving_count = await Surveyfamily.countDocuments({
            boothid: levelss.id,
            nikay_approve: 1,
          });
          const familyCount = await User.aggregate([
            {
              $match: {
                boothid: levelss.id,
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
              },
            },
          ]);
          var assign_familycount = 0;
          if (familyCount.length >= 1) {
            assign_familycount = familyCount[0].sum;
          }

          return {
            id: levelss.id,
            name_en: levelss.booth_en,
            name: levelss.booth,
            approvedcounts: approving_count,
            totalcounts: assign_familycount,
            completedcounts: completedcounts,
            pandingcounts: assign_familycount - approving_count,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: finalResult,
      });
    } else if (zoneid > 0) {
      var lang1 = lang;

      counts = await Sector.countDocuments({ zone_id: parseInt(zoneid) });
      data = await Sector.aggregate([
        { $match: { zone_id: parseInt(zoneid) } },
        {
          $project: {
            _id: 0,
            id: 1,
            sector: `$sector_${lang1}`,
            sector_en: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        { $sort: { id: 1 } },
      ]);
      const finalResult = await Promise.all(
        data.map(async (levelss) => {
          const completedcounts = await Surveyfamily.countDocuments({
            sectorid: levelss.id,
          });
          const approving_count = await Surveyfamily.countDocuments({
            sectorid: levelss.id,
            nikay_approve: 1,
          });
          const familyCount = await User.aggregate([
            {
              $match: {
                sectorid: levelss.id,
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
              },
            },
          ]);
          var assign_familycount = 0;
          if (familyCount.length >= 1) {
            assign_familycount = familyCount[0].sum;
          }

          return {
            id: levelss.id,
            name_en: levelss.sector_en,
            name: levelss.sector,
            approvedcounts: approving_count,
            totalcounts: assign_familycount,
            completedcounts: completedcounts,
            pandingcounts: assign_familycount - approving_count,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: finalResult,
      });
    } else if (blockid > 0) {
      var lang1 = lang;

      counts = await Zone.countDocuments({ block_id: parseInt(blockid) });
      data = await Zone.aggregate([
        { $match: { block_id: parseInt(blockid) } },
        {
          $project: {
            _id: 0,
            id: 1,
            zone: `$zone_${lang1}`,
            zone_en: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        { $sort: { id: 1 } },
      ]);
      const finalResult = await Promise.all(
        data.map(async (levelss) => {
          const completedcounts = await Surveyfamily.countDocuments({
            zoneid: levelss.id,
          });
          const approving_count = await Surveyfamily.countDocuments({
            zoneid: levelss.id,
            nikay_approve: 1,
          });
          const familyCount = await User.aggregate([
            {
              $match: {
                zoneid: levelss.id,
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
              },
            },
          ]);
          var assign_familycount = 0;
          if (familyCount.length >= 1) {
            assign_familycount = familyCount[0].sum;
          }

          return {
            id: levelss.id,
            name_en: levelss.zone_en,
            name: levelss.zone,
            approvedcounts: approving_count,
            totalcounts: assign_familycount,
            completedcounts: completedcounts,
            pandingcounts: assign_familycount - approving_count,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: finalResult,
      });
    } else if (vidhansabhaid > 0) {
      var lang1 = lang;

      counts = await Block.countDocuments({
        vidhansabha_id: parseInt(vidhansabhaid),
      });
      data = await Block.aggregate([
        { $match: { vidhansabha_id: parseInt(vidhansabhaid) } },
        {
          $project: {
            _id: 0,
            id: 1,
            block: `$block_${lang1}`,
            block_en: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        { $sort: { id: 1 } },
      ]);
      const finalResult = await Promise.all(
        data.map(async (levelss) => {
          const completedcounts = await Surveyfamily.countDocuments({
            blockid: levelss.id,
          });
          const approving_count = await Surveyfamily.countDocuments({
            blockid: levelss.id,
            nikay_approve: 1,
          });
          const familyCount = await User.aggregate([
            {
              $match: {
                blockid: levelss.id,
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
              },
            },
          ]);
          var assign_familycount = 0;
          if (familyCount.length >= 1) {
            assign_familycount = familyCount[0].sum;
          }

          return {
            id: levelss.id,
            name_en: levelss.block_en,
            name: levelss.block,
            approvedcounts: approving_count,
            totalcounts: assign_familycount,
            completedcounts: completedcounts,
            pandingcounts: assign_familycount - approving_count,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: finalResult,
      });
    } else if (loksabhaid > 0) {
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      counts = await Vidhansabha.countDocuments({ loksabha_id: loksabhaid });
      data = await Vidhansabha.aggregate([
        { $match: { loksabha_id: loksabhaid } },
        {
          $project: {
            _id: 0,
            id: 1,
            vidhansabha: `$vidhansabha_${lang1}`,
            vidhansabha_en: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        { $sort: { id: 1 } },
      ]);
      const finalResult = await Promise.all(
        data.map(async (levelss) => {
          const completedcounts = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss.id,
          });
          const approving_count = await Surveyfamily.countDocuments({
            vidhansabhaid: levelss.id,
            nikay_approve: 1,
          });
          const familyCount = await User.aggregate([
            {
              $match: {
                vidhansabhaid: levelss.id,
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
              },
            },
          ]);
          var assign_familycount = 0;
          if (familyCount.length >= 1) {
            assign_familycount = familyCount[0].sum;
          }

          return {
            id: levelss.id,
            name_en: levelss.vidhansabha_en,
            name: levelss.vidhansabha,
            approvedcounts: approving_count,
            totalcounts: assign_familycount,
            completedcounts: completedcounts,
            pandingcounts: assign_familycount - approving_count,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: finalResult,
      });
    } else if (nikayid > 0) {
      counts = await Ward.countDocuments({ nikay_id: nikayid });
      data = await Ward.aggregate([
        { $match: { nikay_id: nikayid } },
        {
          $project: {
            _id: 0,
            id: 1,
            ward: `$ward_${lang}`,
            ward_en: 1,
            ward_type: 1,
          },
        },
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      // console.log(data);
      const finalResult = await Promise.all(
        data.map(async (levelss) => {
          const completedcounts = await Surveyfamily.countDocuments({
            wardid: levelss.id,
          });
          const approving_count = await Surveyfamily.countDocuments({
            wardid: levelss.id,
            nikay_approve: 1,
          });
          const familyCount = await User.aggregate([
            {
              $match: {
                wardid: levelss.id,
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
              },
            },
          ]);
          var assign_familycount = 0;
          if (familyCount.length >= 1) {
            assign_familycount = familyCount[0].sum;
          }

          return {
            id: levelss.id,
            name_en: levelss.ward_en,
            name: levelss.ward,
            ward_type: levelss.ward_type,
            approvedcounts: approving_count,
            totalcounts: assign_familycount,
            completedcounts: completedcounts,
            pandingcounts: assign_familycount - approving_count,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: finalResult,
      });
    } else if (jilaid > 0) {
      if (app_type === "nigam") {
        counts = await Nikay.countDocuments({ jila_id: jilaid });
        data = await Nikay.aggregate([
          { $match: { jila_id: jilaid } },
          {
            $project: {
              _id: 0,
              id: 1,
              nikay: `$nikay_${lang}`,
              nikay_en: 1,
              nikay_type: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          data.map(async (levelss) => {
            const completedcounts = await Surveyfamily.countDocuments({
              nikayid: levelss.id,
            });
            const approving_count = await Surveyfamily.countDocuments({
              nikayid: levelss.id,
              nikay_approve: 1,
            });
            const familyCount = await User.aggregate([
              {
                $match: {
                  nikayid: levelss.id,
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
                },
              },
            ]);
            var assign_familycount = 0;
            if (familyCount.length >= 1) {
              assign_familycount = familyCount[0].sum;
            }

            return {
              id: levelss.id,
              name_en: levelss.nikay_en,
              name: levelss.nikay,
              nikay_type: levelss.nikay_type,
              approvedcounts: approving_count,
              totalcounts: assign_familycount,
              completedcounts: completedcounts,
              pandingcounts: assign_familycount - approving_count,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: finalResult,
        });
      } else {
        var lang1 = lang;
        if (lang === "hi") {
          lang1 = "hindi";
        }
        counts = await Vidhansabha.countDocuments({ jila_id: jilaid });
        data = await Vidhansabha.aggregate([
          { $match: { jila_id: jilaid } },
          {
            $project: {
              _id: 0,
              id: 1,
              vidhansabha: `$vidhansabha_${lang1}`,
              vidhansabha_en: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          data.map(async (levelss) => {
            const completedcounts = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss.id,
            });
            const approving_count = await Surveyfamily.countDocuments({
              vidhansabhaid: levelss.id,
              nikay_approve: 1,
            });
            const familyCount = await User.aggregate([
              {
                $match: {
                  vidhansabhaid: levelss.id,
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
                },
              },
            ]);
            var assign_familycount = 0;
            if (familyCount.length >= 1) {
              assign_familycount = familyCount[0].sum;
            }

            return {
              id: levelss.id,
              name_en: levelss.vidhansabha_en,
              name: levelss.vidhansabha,
              approvedcounts: approving_count,
              totalcounts: assign_familycount,
              completedcounts: completedcounts,
              pandingcounts: assign_familycount - approving_count,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: finalResult,
        });
      }
    } else if (stateid > 0) {
      if (levletype == "loksabha") {
        counts = await Loksabha.countDocuments({
          stateid: stateid,
        });
        data = await Loksabha.aggregate([
          { $match: { stateid: stateid } },
          {
            $project: {
              _id: 0,
              id: 1,
              loksabha: `$loksabha_${lang}`,
              loksabha_en: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          data.map(async (levelss) => {
            const completedcounts = await Surveyfamily.countDocuments({
              loksabhaid: levelss.id,
            });
            const approving_count = await Surveyfamily.countDocuments({
              loksabhaid: levelss.id,
              nikay_approve: 1,
            });
            const familyCount = await User.aggregate([
              {
                $match: {
                  loksabhaid: levelss.id,
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
                },
              },
            ]);
            var assign_familycount = 0;
            if (familyCount.length >= 1) {
              assign_familycount = familyCount[0].sum;
            }

            return {
              id: levelss.id,
              name_en: levelss.loksabha_en,
              name: levelss.loksabha,
              approvedcounts: approving_count,
              totalcounts: assign_familycount,
              completedcounts: completedcounts,
              pandingcounts: assign_familycount - approving_count,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: finalResult,
        });
      } else if (levletype == "jila") {
        var lang1 = lang;
        if (lang === "hi") {
          lang1 = "hindi";
        }
        counts = await Jila.countDocuments({ stateid: stateid });
        data = await Jila.aggregate([
          { $match: { stateid: stateid } },
          {
            $project: {
              _id: 0,
              id: 1,
              jila: `$jila_${lang1}`,
              jila_en: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        const finalResult = await Promise.all(
          data.map(async (levelss) => {
            const completedcounts = await Surveyfamily.countDocuments({
              jilaid: levelss.id,
            });
            const approving_count = await Surveyfamily.countDocuments({
              jilaid: levelss.id,
              nikay_approve: 1,
            });
            const familyCount = await User.aggregate([
              {
                $match: {
                  jilaid: levelss.id,
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
                },
              },
            ]);
            var assign_familycount = 0;
            if (familyCount.length >= 1) {
              assign_familycount = familyCount[0].sum;
            }

            return {
              id: levelss.id,
              name_en: levelss.jila_en,
              name: levelss.jila,
              approvedcounts: approving_count,
              totalcounts: assign_familycount,
              completedcounts: completedcounts,
              pandingcounts: assign_familycount - approving_count,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: finalResult,
        });
      } else {
        const loksabha_counts = await Loksabha.countDocuments({
          stateid: stateid,
        });
        const loksabha = await Loksabha.aggregate([
          { $match: { stateid: stateid } },
          {
            $project: {
              _id: 0,
              id: 1,
              loksabha: `$loksabha_${lang}`,
              loksabha_en: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        var lang1 = lang;
        if (lang === "hi") {
          lang1 = "hindi";
        }
        const jila_counts = await Jila.countDocuments({ stateid: stateid });
        const jila = await Jila.aggregate([
          { $match: { stateid: stateid } },
          {
            $project: {
              _id: 0,
              id: 1,
              jila: `$jila_${lang1}`,
              jila_en: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);

        data = {
          loksabha: {
            count: loksabha_counts,
            data: loksabha,
          },
          jila: {
            count: jila_counts,
            data: jila,
          },
        };
      }
    } else if (countryid >= 1) {
      counts = await State.countDocuments();
      data = await State.aggregate([
        {
          $project: {
            _id: 0,
            id: 1,
            state: `$state_${lang}`,
            state_en: 1,
          },
        },
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      const finalResult = await Promise.all(
        data.map(async (levelss) => {
          const completedcounts = await Surveyfamily.countDocuments({
            stateid: levelss.id,
          });
          const approving_count = await Surveyfamily.countDocuments({
            stateid: levelss.id,
            nikay_approve: 1,
          });
          const familyCount = await User.aggregate([
            {
              $match: {
                stateid: levelss.id,
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
              },
            },
          ]);
          var assign_familycount = 0;
          if (familyCount.length >= 1) {
            assign_familycount = familyCount[0].sum;
          }

          return {
            id: levelss.id,
            name_en: levelss.state_en,
            name: levelss.state,
            approvedcounts: approving_count,
            totalcounts: assign_familycount,
            completedcounts: completedcounts,
            pandingcounts: assign_familycount - approving_count,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: finalResult,
      });
    } else {
      let countryname = "india";
      if (lang === "hi") { countryname = "भारत"; } else if (lang === "en") { countryname = "India" } else if (lang === "as") { countryname = "ভাৰত" } else if (lang === "gu") { countryname = "ભારત" } else if (lang === "mr") { countryname = "भारत" } else if (lang === "ta") { countryname = "இந்தியா" } else if (lang === "te") { countryname = "భారతదేశం" } else if (lang === "pu") { countryname = "ਭਾਰਤ" } else if (lang === "bn") { countryname = "ভারত" } else if (lang === "kn") { countryname = "ಭಾರತ" } else if (lang === "ml") { countryname = "ഇന്ത്യ" } else if (lang === "or") { countryname = "ଭାରତ" } else if (lang === "lus") { countryname = "India" } else if (lang === "doi") { countryname = "भारत" }

      data[0] = {
        id: "1",
        country_en: "India",
        country: countryname,
      };
      counts = 1;
      const finalResult = await Promise.all(
        data.map(async (levelss) => {
          const completedcounts = await Surveyfamily.countDocuments();
          const approving_count = await Surveyfamily.countDocuments({
            nikay_approve: 1,
          });
          const familyCount = await User.aggregate([
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
              },
            },
          ]);
          var assign_familycount = 0;
          if (familyCount.length >= 1) {
            assign_familycount = familyCount[0].sum;
          }

          return {
            id: levelss.id,
            name_en: levelss.country_en,
            name: levelss.country,
            approvedcounts: approving_count,
            totalcounts: assign_familycount,
            completedcounts: completedcounts,
            pandingcounts: assign_familycount - approving_count,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: finalResult,
      });
    }
    // data.forEach((element, index) => {
    //   data[index].totalcounts = 0;
    //   data[index].pandingcounts = 0;
    //   data[index].completedcounts = 0;
    //   data[index].approvedcounts = 0;
    // });

    // const responseData = () => {
    //   res.status(200).json({
    //     status: "success",
    //     message: "Data Found successful",
    //     count: counts,
    //     data: data,
    //   });
    // };

    // responseData();
  } catch (error) {
    next(error);
  }
};
