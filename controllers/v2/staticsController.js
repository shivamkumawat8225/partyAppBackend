const Category = require("../../models/categoryModel");
const Religion = require("../../models/religionModel");
const Education = require("../../models/educationModel");
const Profession = require("../../models/professionModel");
const Party = require("../../models/party");
const Gender = require("../../models/genderModel");
const Caste = require("../../models/casteModel");
const UserRole = require("../../models/UserroleModel");
const Booth = require("../../models/boothModel");
const Block = require("../../models/blockModel");
const Vidhansabha = require("../../models/vidhansabhaModel");
const Jila = require("../../models/jilaModel");
const Loksabha = require("../../models/loksabhaModel");
const State = require("../../models/stateModel");
const Question = require("../../models/questionModel");

const creatError = require("../../utils/appError");
const Nikay = require("../../models/nikayModel");
const Ward = require("../../models/wardModel");
const Sector = require("../../models/sectorModel");
const Zone = require("../../models/zoneModel");
const problemtype = require("../../models/problemtypeModel");
const User = require("../../models/userModel");
const User_role = require("../../models/UserroleModel");

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
    const problemtypes = await problemtype.aggregate([
      {
        $project: {
          _id: 0,
          id: 1,
          type_en: 1,
          type: `$type_${lang}`,
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
          problemtype: problemtypes,
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
    var { lang, categoryid, stateid, limit = 500, skip } = req.body;
    categoryid = parseInt(categoryid);
    stateid = parseInt(stateid);
    const d = `categoryData.category${lang}`;
    if (categoryid > 0 && stateid > 0) {
      counts = await Caste.countDocuments({
        categoryid: categoryid,
        stateid: stateid,
      });
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else if (categoryid > 0) {
      counts = await Caste.countDocuments({ categoryid: categoryid });
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else if (stateid > 0) {
      counts = await Caste.countDocuments({ stateid: stateid });
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else {
      counts = await Caste.countDocuments();
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
        { $sort: { id: 1 } },
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
      zoneid,
      sectorid,

      vidhansabhaid,
      loksabhaid,
      nikayid,
      app_type,
      jilaid,
      stateid,
      limit,
      skip,
    } = req.body;
    sectorid = parseInt(sectorid);
    zoneid = parseInt(zoneid);
    blockid = parseInt(blockid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    nikayid = parseInt(nikayid);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
            ward_kramank: 1,
            ward_type: 1,
          },
        },
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
              nikay_kramank: 1,
              nikay_type: 1,
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
    } else {
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
exports.levelLists = async (req, res, next) => {
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
      app_type,
      jilaid,
      stateid,
      limit,
      skip,
      username,
    } = req.body;
    sectorid = parseInt(sectorid);
    zoneid = parseInt(zoneid);
    blockid = parseInt(blockid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    nikayid = parseInt(nikayid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);
    const d = `categoryData.category${lang}`;
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
      },
    );
    // console.log("access", rolesaccess);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
            ward_kramank: 1,
            ward_type: 1,
          },
        },
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
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
              nikay_kramank: 1,
              nikay_type: 1,
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
    } else if (rolesaccess.level == "loksabha") {
      counts = await Loksabha.countDocuments({
        loksabhaid: {
          $in: users.loksabhaid,
        },
      });
      data = await Loksabha.aggregate([
        {
          $match: {
            loksabhaid: {
              $in: users.loksabhaid,
            },
          },
        },
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
    } else if (rolesaccess.level == "ward") {
      console.log("ward");
      counts = await Ward.countDocuments({
        id: {
          $in: users.wardid,
        },
      });
      data = await Ward.aggregate([
        {
          $match: {
            id: {
              $in: users.wardid,
            },
          },
        },
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
    } else if (rolesaccess.level == "nigam") {
      counts = await Nikay.countDocuments({
        id: {
          $in: users.nikayid,
        },
      });
      data = await Nikay.aggregate([
        {
          $match: {
            id: {
              $in: users.nikayid,
            },
          },
        },
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
    } else if (rolesaccess.level == "jila") {
      counts = await Jila.countDocuments({
        id: {
          $in: users.jilaid,
        },
      });
      data = await Jila.aggregate([
        {
          $match: {
            id: {
              $in: users.jilaid,
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            jila: `$jila_${lang}`,
            jila_en: 1,
          },
        },
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else if (rolesaccess.level == "block") {
      counts = await Block.countDocuments({
        id: {
          $in: users.blockid,
        },
      });
      data = await Block.aggregate([
        {
          $match: {
            id: {
              $in: users.blockid,
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            block: `$block_${lang}`,
            block_en: 1,
          },
        },
        { $sort: { id: 1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else if (rolesaccess.level == "state") {
      counts = await State.countDocuments({
        id: {
          $in: users.stateid,
        },
      });
      data = await State.aggregate([
        {
          $match: {
            id: {
              $in: users.stateid,
            },
          },
        },
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
    } else if (rolesaccess.level == "national") {
      counts = await State.countDocuments({});
      data = await State.aggregate([
        {
          $match: {},
        },
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
    } else {
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
        $match: {
          q_type: "normal",
        },
      },
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

exports.boothquestions = async (req, res, next) => {
  try {
    const { lang } = req.body;
    const question = await Question.aggregate([
      {
        $match: {
          q_type: "booth",
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          question_en: 1,
          question: `$question_${lang}`,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: {
        question: question,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.postlist = async (req, res, next) => {
  try {
    const { lang } = req.body;

    const role = await UserRole.aggregate([
      {
        $match: {
          role_type: "warroom",
          level: { $in: ["booth", "sector", "block", "zone", "vidhansabha"] },
          id: { $nin: [98, 97, 96, 95] },
        },
      },
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

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: {
        role: role,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.boothlist = async (req, res, next) => {
  try {
    const { lang } = req.body;

    const booths = await Booth.aggregate([
      {
        $match: {
          vidhansabha_id: req.body.vidhansabhaid * 1,
        },
      },
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

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: {
        booths: booths,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.boothlistwithpagginations = async (req, res, next) => {
  try {
    const { lang, vidhansabhaid, search = "", limit = 500, skip = 0 } = req.body;
    let matchCondition = {};
    if (search) {
      matchCondition.$or = [
        { booth_en: { $regex: search, $options: "i" } },
        { booth_kramank: search * 1 },
        { [`booth_${lang}`]: { $regex: search, $options: "i" } },
      ];
    }
    if (vidhansabhaid && vidhansabhaid > 0) {

      matchCondition.vidhansabha_id = req.body.vidhansabhaid * 1;
    }
    const totalData = await Booth.countDocuments(matchCondition);

    const booths = await Booth.aggregate([
      {
        $match: matchCondition,
      },
      { $sort: { booth_kramank: 1 } },
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
          sector_id: 1,
          zone_id: 1,
          block_id: 1,
          vidhansabha_id: 1,
          loksabha_id: 1,
          jila_id: 1,
          stateid:1
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: {
        total: totalData,
        returnData: booths.length,
        booths: booths,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.blocklistwithpagginations = async (req, res, next) => {
  try {
    const { lang, vidhansabhaid, search = "", limit = 500, skip = 0 } = req.body;
    let matchCondition = {};
    if (search) {
      matchCondition.$or = [
        { block_en: { $regex: search, $options: "i" } },
        { [`block_${lang}`]: { $regex: search, $options: "i" } },
      ];
    }
    if (vidhansabhaid && vidhansabhaid > 0) {
      matchCondition.vidhansabha_id = req.body.vidhansabhaid * 1;
    }
    const totalData = await Block.countDocuments(matchCondition);
    const blocks = await Block.aggregate([
      {
        $match: {
         ...matchCondition
        },
      },
      { $sort: { id: 1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          id: 1,
          block_en: 1,
          block: `$block_${lang}`,
          level: 1,
          vidhansabha_id: 1,
          loksabha_id: 1,
          jila_id: 1,
          stateid:1
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: {
        total: totalData,
        returnData: blocks.length,
        blocks: blocks,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.zonelistwithpagginations = async (req, res, next) => {
  try {
    const { lang,  vidhansabhaid, search = "",limit = 500, skip = 0 } = req.body;
    
    let matchCondition = {};
    if (search) {
      matchCondition.$or = [
        { zone_en: { $regex: search, $options: "i" } },
        { [`zone_${lang}`]: { $regex: search, $options: "i" } },
      ];
    }
    if (vidhansabhaid && vidhansabhaid > 0) {
      matchCondition.vidhansabha_id = req.body.vidhansabhaid * 1;
    }
    const totalData = await Zone.countDocuments(matchCondition);
    const zones = await Zone.aggregate([
      {
        $match: {
          ...matchCondition
        },
      },
      { $sort: { id: 1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          id: 1,
          zone_en: 1,
          zone: `$zone_${lang}`,
          level: 1,
          block_id: 1,
          vidhansabha_id: 1,
          loksabha_id: 1,
          jila_id: 1,
          stateid:1
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: {
        total: totalData,
        returnData: zones.length,
        zones: zones,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.sectorlistwithpagginations = async (req, res, next) => {
  try {
    const { lang,  vidhansabhaid, search = "",limit = 500, skip = 0 } = req.body;
    let matchCondition = {};
    if (search) {
      matchCondition.$or = [
        { sector_en: { $regex: search, $options: "i" } },
        { [`sector_${lang}`]: { $regex: search, $options: "i" } },
      ];
    }
    if (vidhansabhaid && vidhansabhaid > 0) {
      matchCondition.vidhansabha_id = req.body.vidhansabhaid * 1;
    }
    const totalData = await Sector.countDocuments(matchCondition);
    const sectors = await Sector.aggregate([
      {
        $match: {
          ...matchCondition
        
        },
      },
      { $sort: { id: 1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          id: 1,
          sector_en: 1,
          sector: `$sector_${lang}`,
          level: 1,
          block_id: 1,
          zone_id: 1,
          vidhansabha_id: 1,
          loksabha_id: 1,
          jila_id: 1,
          stateid:1
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: {
        total: totalData,
        returnData: sectors.length,
        sectors: sectors,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.vidhansabhalistwithpagginations = async (req, res, next) => {
  try {
    const { vidhansabhaid, search = "", lang, limit = 500, skip = 0 } = req.body;
    let matchCondition = {};
    if (vidhansabhaid && vidhansabhaid > 0) {
      matchCondition.id = vidhansabhaid * 1;
    }
    if (search) {
      matchCondition.$or = [
        { vidhansabha_en: { $regex: search, $options: "i" } },
        { vidhansabha_hindi: { $regex: search, $options: "i" } },
      ];
    }
    const totalData = await Vidhansabha.countDocuments(matchCondition);
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }

    const vidhansabhas = await Vidhansabha.aggregate([
      {
        $match: matchCondition,
      },
      { $sort: { id: 1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          id: 1,
          vidhansabha_en: 1,
          vidhansabha: `$vidhansabha_${lang1}`,
          level: 1,          
          loksabha_id: 1,
          jila_id: 1,
          stateid:1
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      data: {
        total: totalData,
        returnData: vidhansabhas.length,
        vidhansabhas: vidhansabhas,
      },
    });
  } catch (error) {
    next(error);
  }
};
