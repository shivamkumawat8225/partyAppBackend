const Category = require("../models/categoryModel");
const Religion = require("../models/religionModel");
const Education = require("../models/educationModel");
const Profession = require("../models/professionModel");
const Party = require("../models/party");
const Gender = require("../models/genderModel");
const Caste = require("../models/casteModel");
const UserRole = require("../models/UserroleModel");
const Booth = require("../models/boothModel");
const Block = require("../models/blockModel");
const Vidhansabha = require("../models/vidhansabhaModel");
const Jila = require("../models/jilaModel");
const Loksabha = require("../models/loksabhaModel");
const State = require("../models/stateModel");
const Question = require("../models/questionModel");

const creatError = require("../utils/appError");

exports.all = async (req, res, next) => {
  try {
    const { lang } = req.body;
    const category = await Category.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          category_en: 1,
          category: `$category_${lang}`,
        },
      },
    ]);
    const religion = await Religion.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          religion_en: 1,
          religion: `$religion_${lang}`,
        },
      },
    ]);
    const education = await Education.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          education_en: 1,
          education: `$education_${lang}`,
        },
      },
    ]);
    const profession = await Profession.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          profession_en: 1,
          profession: `$profession_${lang}`,
        },
      },
    ]);
    const party = await Party.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          party_en: 1,
          party: `$party_${lang}`,
        },
      },
    ]);
    const gender = await Gender.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          gender_en: 1,
          gender: `$gender_${lang}`,
        },
      },
    ]);
    const role = await UserRole.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          role_en: 1,
          role: `$role_${lang}`,
          level: 1,
          role_type: 1,
        },
      },
    ]);

    const responseData = () => {
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: {
          category: category,
          religion: religion,
          profession: profession,
          education: education,
          gender: gender,
          party: party,
          role: role,
        },
      });
    };
    await responseData();
  } catch (error) {
    next(error);
  }
};

exports.castes = async (req, res, next) => {
  try {
    var caste = [];
    var counts = 0;
    var { lang, categoryid, stateid, limit, skip } = req.body;
    categoryid = parseInt(categoryid);
    stateid = parseInt(stateid);
    const d = `categoryData.category${lang}`;
    if (categoryid > 0 && stateid > 0) {
      counts = await Caste.find({
        categoryid: categoryid,
        stateid: stateid,
      }).count();
      caste = await Caste.aggregate([
        { $match: { categoryid: categoryid, stateid: stateid } },
        {
          $project: {
            _id: 0,
            id: 1,
            caste_en: 1,
            caste: `$caste_${lang}`,
            stateid: 1,
            categoryid: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else if (categoryid > 0) {
      counts = await Caste.find({ categoryid: categoryid }).count();
      caste = await Caste.aggregate([
        { $match: { categoryid: categoryid } },
        {
          $project: {
            _id: 0,
            id: 1,
            caste_en: 1,
            caste: `$caste_${lang}`,
            stateid: 1,
            categoryid: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else if (stateid > 0) {
      counts = await Caste.find({ stateid: stateid }).count();
      caste = await Caste.aggregate([
        { $match: { stateid: stateid } },
        {
          $project: {
            _id: 0,
            id: 1,
            caste_en: 1,
            caste: `$caste_${lang}`,
            stateid: 1,
            categoryid: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else {
      counts = await Caste.find().count();
      caste = await Caste.aggregate([
        {
          $project: {
            _id: 0,
            id: 1,
            caste_en: 1,
            caste: `$caste_${lang}`,
            stateid: 1,
            categoryid: 1,
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    }

    const responseData = () => {
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: caste,
      });
    };
    responseData();
  } catch (error) {
    next(error);
  }
};

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
    } else {
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
      ]);
    }

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
exports.allquestion = async (req, res, next) => {
  try {
    const { lang } = req.body;

    const question = await Question.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          question_en: 1,
          question: `$question_${lang}`,
        },
      },
    ]);

    const responseData = () => {
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        data: {
          question: question,
        },
      });
    };
    await responseData();
  } catch (error) {
    next(error);
  }
};
