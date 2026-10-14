const User = require("../../models/userModel");
const creatError = require("../../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User_role = require("../../models/UserroleModel");
const { authenticateToken } = require('../../middilware/authMiddleware');
const Projectsetting = require("../../models/projectSettingModel");

exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(new creatError("User Already exists", 400));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    //jsonwebtoken JWT
    const token = jwt.sign({ _id: newUser._id }, "secretkey123", {
      expiresIn: "90d",
    });
    res.status(201).json({
      status: "success",
      message: "user Add successful",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        mobile: newUser.mobile,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, lang } = req.body;
    var user = await User.findOne({
      "$or": [{
        "email": email
      }, {
        "mobile": email
      }]
    });

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    const rolesaccess = await User_role.findOne(
      { id: user.role },
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
      }
    );
    user.roles = rolesaccess;
    // if (user.role !== 4) {
    //   const isPasswordvalid = await bcrypt.compare(password, user.password);
    //   if (!isPasswordvalid) {
    //     return next(new creatError("Invalid email and password!", 401));
    //   }
    // }
    //jsonwebtoken JWT
    // const token = jwt.sign({ _id: user._id }, "secretkey123", { expiresIn: '1h' });
    const token = jwt.sign({ _id: user._id, username: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' });
    res.status(201).json({
      status: "success",
      message: "Logged In successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        father_name: user.father_name,
        address: user.address,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        addaccess: rolesaccess,
        stateid: user.stateid,
        loksabhaid: user.loksabhaid,
        jilaid: user.jilaid,
        vidhansabhaid: user.vidhansabhaid,
        blockid: user.blockid,
        sectorid: user.sectorid,
        zoneid: user.zoneid,
        nikayid: user.nikayid,
        wardid: user.wardid,
        boothid: user.boothid,
        image: user.image,
      },
    });

  } catch (error) {
    next(error);
  }
};

exports.mobilelogin = async (req, res, next) => {
  try {
    const { mobile, lang, gcmtoken } = req.body;

    const user = await User.findOne({ mobile });
    const rolesaccess = await User_role.findOne(
      { id: user.role },
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
      }
    );
    // console.log(rolesaccess);
    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    const otp = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    //jsonwebtoken JWT
    // const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    //   expiresIn: "5d",
    // });
    const token = jwt.sign({ _id: user._id,id: user._id, username: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
     let ip = req.body.ip_address;
    let latitude = req.body.lat;
    let longitude = req.body.long;

    const query = { mobile: mobile };
    const update = { $set: { token: token, gcmtoken: gcmtoken, latitude: latitude, longitude: longitude, ip: ip } };

    const options = {
      upsert: true
    };
    await User.updateOne(query, update, options);
     res.cookie('token', token, { httpOnly: true });
    res.status(201).json({
      status: "success",
      message: "Logged In successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        father_name: user.father_name,
        address: user.address,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        addaccess: rolesaccess,
        stateid: user.stateid,
        loksabhaid: user.loksabhaid,
        jilaid: user.jilaid,
        vidhansabhaid: user.vidhansabhaid,
        blockid: user.blockid,
        sectorid: user.sectorid,
        zoneid: user.zoneid,
        nikayid: user.nikayid,
        wardid: user.wardid,
        boothid: user.boothid,
        image: user.image,
        otp: otp,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.mobileuserregister = async (req, res, next) => {
  try {
    var nikayid = 0;
    var wardid = 0;
    var boothid = 0;
    var blockid = 0;
    var zoneid = 0;
    var sectorid = 0;
    var vidhansabhaid = 0;
    var loksabhaid = 0;
    var jilaid = 0;

    console.log(req.body.nikayid);
    if (req.body.wardid) {
      wardid = req.body.wardid.split(",");
    }
    if (req.body.nikayid) {
      nikayid = req.body.nikayid.split(",");
    }
    if (req.body.boothid) {
      boothid = req.body.boothid.split(",");
    }
    // console.log(boothid);
    if (req.body.blockid) {
      blockid = req.body.blockid.split(",");
    }
    if (req.body.zoneid) {
      zoneid = req.body.zoneid.split(",");
    }
    if (req.body.sectorid) {
      sectorid = req.body.sectorid.split(",");
    }
    if (req.body.vidhansabhaid) {
      vidhansabhaid = req.body.vidhansabhaid.split(",");
    }
    if (req.body.loksabhaid) {
      loksabhaid = req.body.loksabhaid.split(",");
    }
    if (req.body.jilaid) {
      jilaid = req.body.jilaid.split(",");
    }
    // var state = req.body.stateid;
    var stateid = req.body.stateid.split(",");
    // console.log(stateid);
    // throw new Error("check state data");
    const newuserdata = {
      name: req.body.name,
      father_name: req.body.father_name,
      address: req.body.address,
      mobile: req.body.mobile,
      role: req.body.role,
      gender: req.body.gender,
      image: req.body.image,
      assign_family: req.body.assign_family,
      patrol_team: req.body.patrol_team,
      stateid: stateid,
      jilaid: jilaid,
      loksabhaid: loksabhaid,
      vidhansabhaid: vidhansabhaid,
      blockid: blockid,
      zoneid: zoneid,
      sectorid: sectorid,
      boothid: boothid,
      nikayid: nikayid,
      wardid: wardid,
      entrydatetime: new Date(),
    };
    var newUser = [];
    if (req.body.datatype == "update") {
      const query = { _id: req.body.webId };
      const update = { $set: newuserdata };
      const options = { upsert: true };
      newUser = await User.updateOne(query, update);
    } else {
      const user = await User.findOne({ mobile: req.body.mobile });
      if (user) {
        return next(new creatError("User Already exists", 400));
      }
      newUser = await User.create(newuserdata);
    }
    console.log(newUser);
    console.log(newUser.modifiedCount);
    if (newUser.modifiedCount > 0 || newUser._id != "") {
      res.status(201).json({
        success: true,
        status: "success",
        message: "user Add successful",
        user: {
          // _id: newUser._id,
          name: newUser.name,
          father_name: newUser.father_name,
          mobile: newUser.mobile,
          role: newUser.role,
          gender: newUser.gender,
          assign_family: newUser.assign_family,
          image: newUser.image,
        },
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
exports.getBasicDetails = async (req, res, next) => {
  try {
    const data = await Projectsetting.findOne({});
    if (data) {
      res.status(201).json({
        success: true,
        status: "success",
        message: "Find successful",
        data: data,

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

