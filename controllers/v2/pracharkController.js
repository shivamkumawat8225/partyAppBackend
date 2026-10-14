// const { ObjectId } = require("mongodb"); // or ObjectID
var mongoose = require("mongoose");
const User = require("../../models/userModel");
const Booth = require("../../models/boothModel");
const creatError = require("../../utils/appError");
const Ward = require("../../models/wardModel");
const Group = require('../../models/pracharkgroupModel');
const Member = require('../../models/pracharkmemberModel');

const selfhelpgroup = require("../../models/selfhelpgroupModel");
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
exports.addselfhelpgroup = async (req, res, next) => {
  try {
    var newid = 1;
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
    if (req.body.boothid != "") {
      boothid = parseInt(req.body.boothid);
    }
    if (req.body.wardid != "") {
      wardid = parseInt(req.body.wardid);
    }
    // console.log(req.body.username);
    const user = await mobilenumber_details(req.body.username, (lang = "hi"));
    if (!user) {
      return next(new creatError("User not Found!", 404));
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
      const wards = await Ward.findOne({ id: wardid });
      if (!wards) {
        return next(new creatError("wards not exists", 400));
      } else {
        stateid = wards.stateid;
        jilaid = wards.jila_id;
        nikayid = wards.nikay_id;
      }
    }
    var webId = req.body.webId;

    // console.log("user details : -", user);
    const newdata = {
      userId: user[0]._id,
      groupname: req.body.groupname,
      name: req.body.name,
      father_name: req.body.father_name,
      age: req.body.age,
      mobile: req.body.mobile,
      casteid: req.body.casteid,
      remark: req.body.remark,

      stateid: stateid,
      jilaid: jilaid,
      loksabhaid: loksabhaid,
      vidhansabhaid: vidhansabhaid,
      blockid: blockid,
      sectorid: sectorid,
      zoneid: zoneid,
      nikayid: nikayid,
      wardid: wardid,
      boothid: boothid,
      entrydatetime: new Date(),
    };
    var newSurvey = [];
    if (req.body.datatype == "update") {
      const query = { familyid: req.body.webId };
      const update = { $set: newdata };
      const options = {};
      newSurvey = await selfhelpgroup.updateOne(query, update, options);
    } else {
      newSurvey = await selfhelpgroup.create(newdata);
    }

    // console.log(newSurvey._id.toString());
    // console.log(newSurvey.modifiedCount);
    if (newSurvey.modifiedCount > 0 || newSurvey._id != "") {
      res.status(201).json({
        success: true,
        status: "success",
        message: "Data Sync successful",
      });
    } else {
      res.status(200).json({
        success: false,
        status: "unsuccess",
        message: "user Not Sync successful",
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.getselfhelpgroup = async (req, res, next) => {
  try {
    var fam_data = [];
    var user = [];
    var que = [];
    var counts = 0;
    const {
      lang,
      app_type,
      boothid,
      wardid,
      limit,
      skip,
    } = req.body;

    if (app_type === "nigam") {
      counts = await selfhelpgroup.countDocuments({
        wardid: wardid * 1,
      });
      user = await selfhelpgroup.aggregate([
        {
          $match: {
            wardid: wardid * 1,
          },
        },
        {
          $lookup: {
            from: "castes",
            localField: "casteid",
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
            groupname: 1,
            name: 1,
            mobile: 1,
            father_name: 1,
            age: 1,
            remark: 1,

            casteid: 1,
            casteData: 1,
            entrydatetime: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$entrydatetime",
              },
            },
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else {
      counts = await selfhelpgroup.countDocuments({
        boothid: boothid * 1,
      });
      user = await selfhelpgroup.aggregate([
        {
          $match: {
            boothid: boothid * 1,
          },
        },
        {
          $lookup: {
            from: "castes",
            localField: "casteid",
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
            groupname: 1,
            name: 1,
            mobile: 1,
            father_name: 1,
            age: 1,
            casteid: 1,
            casteData: 1,
            remark: 1,
            entrydatetime: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$entrydatetime",
              },
            },
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
        data: user,
      });
    };
    responseData();

  } catch (error) {
    next(error);
  }
};


// 1. नया ग्रुप बनाएँ
exports.createGroup = async (req, res) => {
  try {
    const { name, type, vehicle_type, voter_range_from, voter_range_to } = req.body;

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
    if (req.body.boothid != "") {
      boothid = parseInt(req.body.boothid);
    }
    if (req.body.wardid != "") {
      wardid = parseInt(req.body.wardid);
    }
    // console.log(req.body.username);
    const user = await mobilenumber_details(req.body.username, (lang = "hi"));
    if (!user) {
      return next(new creatError("User not Found!", 404));
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
      const wards = await Ward.findOne({ id: wardid });
      if (!wards) {
        return next(new creatError("wards not exists", 400));
      } else {
        stateid = wards.stateid;
        jilaid = wards.jila_id;
        nikayid = wards.nikay_id;
      }
    }

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'name और type फ़ील्ड अनिवार्य हैं'
      });
    }

    if (type === 'rally' && !vehicle_type) {
      return res.status(400).json({
        success: false,
        message: 'rally के लिए vehicle_type अनिवार्य है'
      });
    }

    if (type === 'toli' && (!voter_range_from || !voter_range_to)) {
      return res.status(400).json({
        success: false,
        message: 'toli के लिए voter_range_from और voter_range_to अनिवार्य हैं'
      });
    }

    const group = await Group.create({
      userId: user[0]._id,
      name,
      type,
      vehicle_type: type === 'rally' ? vehicle_type : null,
      voter_range_from: type === 'toli' ? voter_range_from : null,
      voter_range_to: type === 'toli' ? voter_range_to : null,
      boothid: boothid || null,
      wardid: wardid || null,
      stateid: stateid || null,
      jilaid: jilaid || null,
      loksabhaid: loksabhaid || null,
      vidhansabhaid: vidhansabhaid || null,
      blockid: blockid || null,
      zoneid: zoneid || null,
      sectorid: sectorid || null,
    });

    return res.status(201).json({
      success: true,
      message: 'ग्रुप सफलतापूर्वक बनाया गया',
      data: group
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'सर्वर एरर',
      error: error.message
    });
  }
};

// 2. सभी ग्रुप्स प्राप्त करें (सर्च, लिमिट और स्किप के साथ)
exports.getAllGroups = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = Math.max(0, parseInt(req.query.skip, 10) || (page - 1) * limit);
    const search = req.query.search ? req.query.search.trim() : '';
    const type = req.query.type;
    const boothId = req.query.boothid;
    const nikayId = req.query.nikayid;
    const filter = {};
    if (boothId) {
      filter.boothid = boothId;
    }
    if (nikayId) {
      filter.nikayid = nikayId;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    const [groups, total] = await Promise.all([
      Group.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Group.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: groups,
      count: total,
      // pagination: {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit)
      // }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'ग्रुप्स लाने में त्रुटि हुई',
      error: error.message
    });
  }
};

// 3. मेंबर बनाएँ और मल्टीपल ग्रुप्स असाइन करें
exports.upsertMemberWithGroups = async (req, res) => {
  try {
    const { name, mobile, address, groupIds } = req.body;
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
    if (req.body.boothid != "") {
      boothid = parseInt(req.body.boothid);
    }
    if (req.body.wardid != "") {
      wardid = parseInt(req.body.wardid);
    }
    // console.log(req.body.username);
    const user = await mobilenumber_details(req.body.username, (lang = "hi"));
    if (!user) {
      return next(new creatError("User not Found!", 404));
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
      const wards = await Ward.findOne({ id: wardid });
      if (!wards) {
        return next(new creatError("wards not exists", 400));
      } else {
        stateid = wards.stateid;
        jilaid = wards.jila_id;
        nikayid = wards.nikay_id;
      }
    }

    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'name और mobile अनिवार्य हैं'
      });
    }

    const updateData = {

      userId: user[0]._id,
      mobile: mobile.trim(),
      name: name.trim(),
      address: address ? address.trim() : '',
      boothid: boothid || null,
      wardid: wardid || null,
      stateid: stateid || null,
      jilaid: jilaid || null,
      loksabhaid: loksabhaid || null,
      vidhansabhaid: vidhansabhaid || null,
      blockid: blockid || null,
      zoneid: zoneid || null,
      sectorid: sectorid || null,

    };

    if (Array.isArray(groupIds) && groupIds.length > 0) {
      updateData.assigned_groups = { $each: groupIds };
    }

    const member = await Member.findOneAndUpdate(
      { mobile: mobile.trim() },
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    ).populate('assigned_groups', 'name type vehicle_type voter_range_from voter_range_to');

    return res.status(200).json({
      success: true,
      message: 'मेंबर और ग्रुप्स सफलतापूर्वक अपडेट हो गए',
      data: member
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'मेंबर सेव करने में त्रुटि हुई',
      error: error.message
    });
  }
};

// 4. सभी मेंबर्स प्राप्त करें (सर्च, लिमिट और स्किप के साथ)
exports.getAllMembers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip =  Math.max(0, parseInt(req.query.skip, 10) || (page - 1) * limit);
    const search = req.query.search ? req.query.search.trim() : '';
    const groupId = req.query.groupId;
    const boothId = req.query.boothid;
    const nikayId = req.query.nikayid;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    if (groupId) {
      filter.assigned_groups = groupId;
    }

    if (boothId) {
      filter.boothid = boothId;
    }
    if (nikayId) {
      filter.nikayid = nikayId;
    }

    const [members, total] = await Promise.all([
      Member.find(filter)
        .populate('assigned_groups', 'name type vehicle_type toli_name voter_range_from voter_range_to')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Member.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: members,
      count: total,
      // pagination: {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit)
      // }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'मेंबर्स लाने में त्रुटि हुई',
      error: error.message
    });
  }
};