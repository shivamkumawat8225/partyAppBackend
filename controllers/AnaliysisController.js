const Booth = require("../models/boothModel");
const Block = require("../models/blockModel");
const Vidhansabha = require("../models/vidhansabhaModel");
const Jila = require("../models/jilaModel");
const Loksabha = require("../models/loksabhaModel");
const State = require("../models/stateModel");

const creatError = require("../utils/appError");

exports.levelList = async (req, res, next) => {
  try {
    var data = [];
    var counts = 0;
    var {
      lang,
      levletype,
      blockid,
      vidhansabhaid,
      loksabhaid,
      jilaid,
      stateid,
      countryid,
      limit,
      skip,
    } = req.body;
    blockid = parseInt(blockid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    const d = `categoryData.category${lang}`;

    if (blockid > 0) {
      var lang1 = lang;

      counts = await Booth.find({ block_id: parseInt(blockid) }).count();
      data = await Booth.aggregate([
        { $match: { block_id: parseInt(blockid) } },
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
    } else if (vidhansabhaid > 0) {
      var lang1 = lang;

      counts = await Block.find({
        vidhansabha_id: parseInt(vidhansabhaid),
      }).count();
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
    } else if (loksabhaid > 0) {
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      counts = await Vidhansabha.find({ loksabha_id: loksabhaid }).count();
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
    } else if (jilaid > 0) {
      var lang1 = lang;
      if (lang === "hi") {
        lang1 = "hindi";
      }
      counts = await Vidhansabha.find({ jila_id: jilaid }).count();
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
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        { $sort: { id: 1 } },
      ]);
    } else if (stateid > 0) {
      if (levletype == "loksabha") {
        counts = await Loksabha.find({
          stateid: stateid,
        }).count();
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
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
          { $sort: { id: 1 } },
        ]);
      } else if (levletype == "jila") {
        var lang1 = lang;
        if (lang === "hi") {
          lang1 = "hindi";
        }
        counts = await Jila.find({ stateid: stateid }).count();
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
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
          { $sort: { id: 1 } },
        ]);
      } else {
        const loksabha_counts = await Loksabha.find({
          stateid: stateid,
        }).count();
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
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        var lang1 = lang;
        if (lang === "hi") {
          lang1 = "hindi";
        }
        const jila_counts = await Jila.find({ stateid: stateid }).count();
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
      counts = await State.find().count();
      data = await State.aggregate([
        {
          $project: {
            _id: 0,
            id: 1,
            state: `$state_${lang}`,
            state_en: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        { $sort: { id: 1 } },
      ]);
    } else {
      data[0] = {
        id: "1",
        country_en: "India",
        country: "भारत",
      };
      counts = 1;
    }
    data.forEach((element, index) => {
      data[index].totalcounts = 0;
      data[index].pandingcounts = 0;
      data[index].completedcounts = 0;
      data[index].approvedcounts = 0;
    });

    const responseData = () => {
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: data,
      });
    };

    responseData();
  } catch (error) {
    next(error);
  }
};
