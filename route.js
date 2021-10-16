const route = require("express").Router();
const register_Schema = require("./modules/register_Schema");
const bcard_Schema = require("./modules/bcard_Schema");
const multer = require("multer");
const bcrypt = require("bcrypt");

const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const email_tester =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let email = "undefined";
let key = "";
let bcard = "not exist";

let storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, req.body.bemail + "-" + req.body.lname + "-" + file.originalname);
  },
});

let upload = multer({ storage: storage });

route.use(async (req, res, next) => {
  const { user_key } = req.cookies;
  if (typeof user_key != "undefined") {
    await register_Schema
      .findOne({ user_key })
      .then((data) => {
        if (data != null) {
          key = data.user_key;
          email = data.email;
        } else {
          email = "undefined";
          res.clearCookie("user_key");
        }
      })
      .catch(() => res.render('ejs/fail', {err: 'Server Error'}));
    await bcard_Schema.findOne({ user_key: key }).then((data) => {
      bcard = data != null ? "exist" : "not exist";
    });
  } else {
    email = "undefined";
  }
  next();
});

route.get("/", async (req, res) => {
  res.render("ejs/home", { username: email.split("@")[0], bcard });
});

route.get("/signup", (req, res) => {
  if (email != "undefined") {
    return res.redirect("/");
  } else {
    return res.render("ejs/signup");
  }
});
route.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email_tester.test(email)) {
    res.render("ejs/signup", {
      EmailErr: "מייל לא תקין",
      email,
      password,
    });
    return;
  }
  register_Schema
    .findOne({ email })
    .then((data) => {
      if (data == null) {
        const newUser = new register_Schema({
          email,
          password,
          user_key:
            email + "000" + (Math.random() + 1).toString(36).substring(7),
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((data) => {
                res.cookie("user_key", data.user_key, {
                  maxAge: 253402300000000,
                  httpOnly: true,
                });
                res.redirect("/");
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      } else {
        bcrypt.compare(password, data.password, (err, isMatch) => {
          if (isMatch) {
            res.cookie("user_key", data.user_key, {
              maxAge: 253402300000000,
              httpOnly: true,
            });
            res.redirect("/");
          } else {
            res.render("ejs/signup", {
              PassErr: "הסיסמא לא נכונה",
              email,
            });
          }
        });
      }
    })
    .catch((err) => console.log(err));
});
route.get("/create", (req, res) => {
  if (email == "undefined" || bcard == "exist") {
    return res.redirect("/");
  } else {
    return res.render("ejs/createCard");
  }
});
route.post(
  "/create",
  (req, res, next) => {
    if (email != "undefined") {
      next();
    } else {
      res.send("you disconnected from you account");
    }
  },
  upload.single("logo"),
  async (req, res) => {
    const {
      lname,
      bname,
      description,
      bemail,
      btel,
      whatsapp,
      tlocation,
      llocation,
      facebook_username,
      facebook_link,
      instagram_username,
      instagram_link,
      twitter_username,
      twitter_link,
      tiktok_username,
      tiktok_link,
      bcard_type,
    } = req.body;

    let existData;
    let findLname = bcard_Schema
      .findOne({ lname })
      .then((data) => (existData = data))
      .catch((err) => console.log(err));
    await findLname;
    if (existData != null) {
      await unlinkAsync(`./public/uploads/${req.file.filename}`);
      return res.render("ejs/fail", {
        err: "כרטיס זה כבר קיים במערכת, תוכל למצוא אותו ב:",
        link: existData.lname,
        errStatus: "undefined",
      });
    }

    if (checkValidation(req.body) == true) {
      if (email == "undefined") {
        unlinkAsync(`./public/uploads/${req.file.filename}`);
        return res.send("user is not connected");
      } else {
        bcard_Schema.findOne({ user_key: key }).then((data) => {
          if (data == null) {
            const new_bcard_Schema = new bcard_Schema({
              user_key: key,
              lname,
              bname,
              description,
              btel,
              bcard_type,
              bemail,
              whatsapp,
              facebook_username,
              facebook_link,
              instagram_username,
              instagram_link,
              twitter_username,
              twitter_link,
              tiktok_username,
              tiktok_link,
              tlocation,
              llocation,
              logo_location: req.file.filename,
            });
            new_bcard_Schema
              .save()
              .then((data) => {
                res.render("ejs/done", {
                  headline: "הכרטיס שלך נוצר בהצלחה!",
                  link: data.lname,
                });
              })
              .catch((err) => {
                unlinkAsync(`./public/uploads/${req.file.filename}`);
                res.render("ejs/fail", {
                  err: "שגיאה בלתי צפויה אירעה, אנא נסה במועד מאוחר יותר",
                  errStatus: "undefined",
                });
              });
          } else {
            unlinkAsync(`./public/uploads/${req.file.filename}`);
            res.render("ejs/fail", {
              err: "כרטיס ביקור כבר קיים בבעלותך",
              errStatus: "undefined",
            });
          }
        });
      }
    } else {
      unlinkAsync(`./public/uploads/${req.file.filename}`);
      res.send(fail_message);
    }
  }
);
let fail_message = {};
function checkValidation(data) {
  fail_message = {};
  if (/[^|a-z0-9]+/g.test(data.lname) || data.lname.length < 3)
    fail_message["lname"] = "lname is doesnt match the size its supposed to be";
  if (data.bname.length < 10 || data.bname.length > 50)
    fail_message["bname"] = "bname is not good";
  if (data.description.length < 50 || data.description.length > 200)
    fail_message["description"] = "description sucks";
  if (!email_tester.test(data.bemail))
    fail_message["bemail"] = "email not currect";
  if (data.btel.lastIndexOf("+972") !== 0)
    fail_message["btel"] = "tel must start with +972";
  if (data.btel.length < 12 || data.btel.length > 13)
    fail_message["btel"] = "tel is too short / long";
  if (data.whatsapp.length != 0 && data.whatsapp.lastIndexOf("+972") !== 0)
    fail_message["whatsapp"] = "whatsapp must start with +972";
  if (data.whatsapp.length != 0 && data.whatsapp.length != 13)
    fail_message["whatsapp"] = "whatsapp length needs to be 13";
  if (data.llocation.length > 0 && data.tlocation.length == 0)
    fail_message["tlocation"] =
      "cant write link-location when theres no text location";
  if (
    data.llocation.length > 0 &&
    !linkIsValid(data.llocation, ["waze.com", "goo.gl/", "google.com/maps/"])
  )
    fail_message["llocation"] = "link is not waze / googole maps";
  if (data.facebook_link.length > 0 && data.facebook_username.length == 0)
    fail_message["FBusername"] =
      "cant write facebook link when theres no username";
  if (
    data.facebook_username.length > 0 &&
    data.facebook_link.length !== 0 &&
    !linkIsValid(data.facebook_link, ["facebook.com"])
  )
    fail_message["FBlink"] = "facebook link is not from facebook..";
  if (data.instagram_link.length > 0 && data.instagram_username.length == 0)
    fail_message["IGusername"] =
      "cant write instagram link when theres no username";
  if (
    data.instagram_username.length > 0 &&
    data.instagram_link.length !== 0 &&
    !linkIsValid(data.instagram_link, ["instagram.com"])
  )
    fail_message["IGlink"] = "instagram link ainr valid";
  if (data.twitter_link.length > 0 && data.twitter_username.length == 0)
    fail_message["TWusername"] =
      "cant write twitter link when theres no username";
  if (
    data.twitter_username.length > 0 &&
    data.twitter_link.length !== 0 &&
    !linkIsValid(data.twitter_link, ["twitter.com"])
  )
    fail_message["TWlink"] = "twitter link ainr valid";
  if (data.tiktok_link.length > 0 && data.tiktok_username.length == 0)
    fail_message["TKusername"] =
      "cant write tiktok link when theres no username";
  if (
    data.tiktok_username.length > 0 &&
    data.tiktok_link.length !== 0 &&
    !linkIsValid(data.tiktok_link, ["tiktok.com"])
  )
    fail_message["TKlink"] = "tiktok link ainr valid";
  if (!["basic", "innovative", "space"].includes(data.bcard_type))
    fail_message["bcardType"] = "bcard type doesnt found";

  if (Object.keys(fail_message).length === 0) return true;
}

function linkIsValid(link, po) {
  if (!link.lastIndexOf("https://") == 0) {
    return false;
  }
  if (!po.some((opt) => link.includes(opt))) {
    return false;
  }
  return true;
}

route.get("/b/:lname", (req, res) => {
  const { lname } = req.params;
  bcard_Schema
    .findOne({ lname })
    .then((data) => {
      if (data != null) {
        let exist_cookie = req.cookies[`visited${req.params.lname}`];
        if (typeof exist_cookie == "undefined") {
          res.cookie(`visited${req.params.lname}`, true, {
            httpOnly: true,
            maxAge: 86400000,
          });
          updateViews(lname, data.views);
        }
        data.user_key = 0;
        res.status(200);
        res.render("ejs/card", { data });
      } else {
        res.status(201);
        res.render("ejs/fail", {
          err: "כרטיס לא נמצא במערכת",
          errStatus: "404",
        });
      }
    })
    .catch((err) =>
      res.render("ejs/fail", {
        err: "שגיאה בלתי צפויה אירעה, אנא נסה במועד מאוחר יותר",
        errStatus: "undefined",
      })
    );
});

async function updateViews(lname, v) {
  await bcard_Schema.findOneAndUpdate(
    { lname },
    { views: v + 1 },
    { useFindAndModify: false }
  );
}

route.get("/dashboard", (req, res) => {
  if (email != "undefined" && bcard == "exist") {
    bcard_Schema
      .findOne({ user_key: key })
      .then((data) => {
        res.render("ejs/dashboard", {
          success_edit: "false",
          data,
          username: email.split("@")[0],
        });
      })
      .catch((err) =>
        res.render("ejs/fail", {
          err: "שגיאה בלתי צפויה אירעה, אנא נסה במועד מאוחר יותר",
          errStatus: "undefined",
        })
      );
  } else {
    return res.redirect("/");
  }
});
route.post("/editCard", (req, res) => {
  if (email == "undefined") {
    res.json("התחברו לחשבון ונסו שנית.");
  } else if (["basic", "innovative", "space"].includes(req.body.bcard_type)) {
    bcard_Schema
      .findOneAndUpdate(
        { user_key: req.body.user_key },
        { bcard_type: req.body.bcard_type },
        { useFindAndModify: false }
      )
      .then((data) => {
        if (data == null) {
          res.json("כרטיס לא נמצא");
        } else {
          res.json('העיצוב שונה בהצלחה <i class="fas fa-check-circle"></i>');
        }
      })
      .catch((err) => res.json("שגיאה, נסו שוב."));
  } else {
    res.json("invalid bcard-type");
  }
});
route.get("/deleteCard/:user_key", (req, res) => {
  let user_key = req.params.user_key;
  if (user_key == key) {
    bcard_Schema
      .deleteOne({ user_key })
      .then(() =>
        res.render("ejs/done", {
          headline: "הכרטיס שלך נמחק בהצלחה",
        })
      )
      .catch(() =>
        res.render("ejs/fail", {
          err: "שגיאה בלתי צפויה אירעה, אנא נסה במועד מאוחר יותר",
          errStatus: "undefined",
        })
      );
  } else {
    res.render("ejs/fail", {
      err: "אתה לא מחובר לחשבון של בעל הכרטיס.",
      errStatus: "undefined",
    });
  }
});

route.get('*', (req, res) => {
    res.render("ejs/fail", {
        err: "הדף הזה לא קיים",
        errStatus: "404",
    });
})

module.exports = route;
