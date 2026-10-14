
const mongoose = require("mongoose");
const User = require("../../models/userModel");
const Booth = require("../../models/boothModel");
const Ward = require("../../models/wardModel");
const Caste = require("../../models/casteModel");
const CasteStatics = require("../../models/castestaticsModel");
const creatError = require("../../utils/appError");
const Castestatics = require("../../models/castestaticsModel");
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

exports.saveMultipleCastes = async (req, res) => {
  try {
    const { castes } = req.body;
    var boothid = 0;
    var wardid = 0;
    var {
      stateid,
      jilaid,
      loksabhaid,
      vidhansabhaid,
      blockid,
      zoneid,
      sectorid,
      nikayid,
    } = 0;
    // validate input array
    const user = await mobilenumber_details(req.body.username, (lang = "hi"));
    if (!user) {
      return next(new creatError("User not Found!", 404));
    }
    if (req.body.boothid != "") {
      boothid = parseInt(req.body.boothid);
    }
    if (req.body.wardid != "") {
      wardid = parseInt(req.body.wardid);
    }
    if (boothid > 0) {
      const booths = await Booth.findOne({ id: boothid });
      if (!booths) {
        return next(new creatError("booths not exists", 400));
      } else {
        stateid = booths.stateid;
        jilaid = booths.jila_id;
        loksabhaid = booths.loksabha_id;
        vidhansabhaid = booths.vidhansabha_id;
        blockid = booths.block_id;
        zoneid = booths.zone_id;
        sectorid = booths.sector_id;
      }
    } else {
      if (!Number.isInteger(wardid) || wardid <= 0) {
        return res.status(400).json({
          success: false,
          message: 'a valid wardid is required when boothid is not provided'
        });
      }

      const wards = await Ward.findOne({ id: wardid });
      if (!wards) {
        return next(new creatError("wards not exists", 400));
      } else {
        stateid = wards.stateid;
        jilaid = wards.jila_id;
        nikayid = wards.nikay_id;
      }
    }
    if (!Array.isArray(castes) || castes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'castes must be a non-empty array'
      });
    }

    // validate each entry
    const formattedCastes = [];
    for (const item of castes) {
      if (!item.casteId) {
        return res.status(400).json({
          success: false,
          message: 'each item must include casteId'
        });
      }
      // console.log('Processing casteId:', item.casteId, 'with voterCount:', item.voterCount ,'for boothid:', boothid);
      const casteInsertAndUpdate = await Castestatics.findOneAndUpdate(
        { casteId: item.casteId, boothid: boothid },
        {
          userId: user[0]._id,
          casteId: item.casteId,
          boothid: boothid,
          voterCount: item.voterCount || 0,
          stateid: stateid,
          jilaid: jilaid,
          loksabhaid: loksabhaid,
          vidhansabhaid: vidhansabhaid,
          blockid: blockid,
          zoneid: zoneid,
          sectorid: sectorid,
          nikayid: nikayid,
        },
        { new: true, upsert: true }
      );



      // formattedCastes.push({
      //   userId: user[0]._id,
      //   casteId: item.casteId,
      //   boothid: item.boothid,
      //   voterCount: item.voterCount || 0,
      //   stateid:stateid,
      //   jilaid: jilaid,
      //   loksabhaid: loksabhaid,
      //   vidhansabhaid: vidhansabhaid,
      //   blockid: blockid,
      //   zoneid: zoneid,
      //   sectorid: sectorid,
      //   nikayid: nikayid,
      // });
    }

    // insert records in bulk
    // const savedCastes = await CasteStatics.insertMany(formattedCastes, { ordered: true });

    return res.status(201).json({
      success: true,
      // message: `${savedCastes.length} caste records inserted successfully`,
      // data: savedCastes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error saving caste data',
      error: error.message
    });
  }
};

async function getCasteStatistics({
  lang = 'en',
  filters = {},
  searchTerm = "",
  skip = 0,
  limit = 10
}) {
  const pipeline = [];
  // 1. dynamic match on castestatics fields like boothid, stateid, etc.
  const matchStage = {};
  if (filters.boothid) matchStage.boothid = Number(filters.boothid);
  if (filters.vidhansabhaid) matchStage.vidhansabhaid = Number(filters.vidhansabhaid);
  if (filters.loksabhaid) matchStage.loksabhaid = Number(filters.loksabhaid);
  if (filters.stateid) matchStage.stateid = Number(filters.stateid);
  if (filters.userId) matchStage.userId = filters.userId;

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }
  // 2. lookup caste details where castestatics.casteId matches caste.id
  pipeline.push({
    $lookup: {
      from: "castes",
      localField: "casteId",
      foreignField: "id",
      as: "casteDetails",
     
    }
  });
  // 3. flatten the joined caste details array
  pipeline.push({
    $unwind: {
      path: "$casteDetails",
      preserveNullAndEmptyArrays: false
    }
  });

  // 4. search on caste names across languages if searchTerm is provided
  if (searchTerm && searchTerm.trim() !== "") {
    const regex = new RegExp(searchTerm.trim(), "i");
    pipeline.push({
      $match: {
        $or: [
          { "casteDetails.caste_en": { $regex: regex } },
          { "casteDetails.caste_hi": { $regex: regex } },
          { "casteDetails.caste_mr": { $regex: regex } },
          { "casteDetails.caste_gu": { $regex: regex } }
        ]
      }
    });
  }

  // 5. sort and pagination
  pipeline.push(
    { $sort: { voterCount: -1 } },
    { $skip: skip },
    { $limit: limit }
  );
  // 6. project required fields
  pipeline.push({
    $project: {
      _id: 1,
      boothid: 1,     
      casteId: 1,
      voterCount: 1,
      caste: `$casteDetails.caste_${lang}`,
      createdAt: 1,
      updatedAt: 1,
    }
  });
  const count = await Castestatics.countDocuments(matchStage);
  const results = await CasteStatics.aggregate(pipeline).exec();
  return { results, count };
}
exports.getCastesByBoothId = async (req, res) => {
  try {
    const { boothid } = req.params;
    const { search = '', limit = 10, skip = 0, lang = 'en' } = req.query;

    // Build the query
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const parsedSkip = Math.max(0, parseInt(skip, 10) || 0);

    const results = await getCasteStatistics({
      lang,
      filters: {
        boothid: boothid,
      },
      searchTerm: search,
      skip: parsedSkip,
      limit: parsedLimit
    });

    return res.status(200).json({
      success: true,
      data: results.results,
      count: results.count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching castes',
      error: error.message,
    });
  }
};
exports.removeCasteStatistic = async (req, res) => {
  try {
    const { id, boothid, casteId } = req.body;

    let deleteFilter = {};

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "invalid document id format"
        });
      }
      deleteFilter._id = new mongoose.Types.ObjectId(id);
    } else if (boothid !== undefined && casteId !== undefined) {
      deleteFilter.boothid = Number(boothid);
      deleteFilter.casteId = Number(casteId);
    } else {
      return res.status(400).json({
        success: false,
        message: "please provide either id or both boothid and casteId"
      });
    }

    const deletedRecord = await Castestatics.findOneAndDelete(deleteFilter);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: "caste record not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "caste record removed successfully",
      data: deletedRecord
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error while removing caste record",
      error: error.message
    });
  }
};