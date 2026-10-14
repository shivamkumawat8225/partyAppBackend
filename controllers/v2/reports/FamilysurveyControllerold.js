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

exports.religionwise = async (req, res, next) => {
  try {
    var data = [];
    var counts = 0;
    var {
      lang,
      levletype,
      blockid,
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
    nikayid = parseInt(nikayid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    const d = `categoryData.category${lang}`;
    var religionDtos = await Religion.find();

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
      data.forEach(async (element, index) => {
        //family survey
        var religionobj = [];
        religionDtos.forEach(async (elements, index) => {
          var newcounts = await Familysurvey.find({
            booth_id: parseInt(element.id),
            religionid: elements.id,
          }).count();
          religionobj.push({
            name: elements.religion,
            counts: newcounts,
          });
        });
        data[index].religion = religionobj;
      });
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
    } else if (nikayid > 0) {
      counts = await Ward.find({ nikay_id: nikayid }).count();
      data = await Ward.aggregate([
        { $match: { nikay_id: nikayid } },
        {
          $project: {
            _id: 0,
            id: 1,
            ward: `$ward_${lang}`,
            ward_en: 1,
          },
        },
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else if (jilaid > 0) {
      if (app_type === "nigam") {
        counts = await Nikay.find({ jila_id: jilaid }).count();
        data = await Nikay.aggregate([
          { $match: { jila_id: jilaid } },
          {
            $project: {
              _id: 0,
              id: 1,
              nikay: `$nikay_${lang}`,
              nikay_en: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
      } else {
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
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
      }
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
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
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
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
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
          { $sort: { id: 1 } },
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
      data.forEach(async (element, index) => {
        //family survey
        var religionobj = [];
        religionDtos.forEach(async (elements, index) => {
          var newcounts = 0;
          newcounts = await Familysurvey.find({
            stateid: element.id,
            religionid: elements.id,
          }).count();
          console.log(newcounts);
          religionobj.push({
            name: elements.religion_hi,
            counts: newcounts,
          });
        });
        data[index].religion = religionobj;
      });
    } else {
      data[0] = {
        id: "1",
        country_en: "India",
        country: "भारत",
      };
      counts = 1;
    }
    // data.forEach((element, index) => {
    //   data[index].totalcounts = 0;
    //   data[index].pandingcounts = 0;
    //   data[index].completedcounts = 0;
    //   data[index].approvedcounts = 0;
    // });

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
