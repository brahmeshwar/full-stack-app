/** @format */

import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import crypto from "crypto";
import express, { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { DateTime } from "luxon";
import config from "../../config";
import Db from "../../models/mongodb";
import { IMngrActivity, userType } from "../../types";
import { getIp, getUserBrowser, getUserOS } from "../../utils/client-info";
import Encrypt, { ClientEncrypt } from "../../utils/encrypt";
import { jaction } from "../../utils/express-utils";
import { genId, genPass } from "../../utils/generate-random";
import { getMngrCredentialsTemplate } from "../../utils/get-templates";
import { authenticate } from "../validate";
import { getManagerSchoolRouter } from "./school";

export function getManagerRouter() {
  return express
    .Router({ mergeParams: true })
    .use("/school", getManagerSchoolRouter())
    .post("/login", jaction(verifyLogin))
    .post("/changePassword", jaction(changePassword))
    .post("/create", jaction(createManager))
    .post("/edit", jaction(validateManager))
    .post("/edit/:email", jaction(updateMngrProfile))
    .get("/edit/:email", jaction(getMngrProfile))
    .get("/activities", jaction(getActivities))
    .get("/profile", jaction(getProfile));
}

async function getActivities(req: Request, res: Response) {
  const cookie = req.headers.cookie as string;
  const { success, info } = authenticate(cookie);
  if (success && info) {
    const { id } = info;
    const toIndianDateTime = new Date(
      DateTime.utc().plus({ hours: 5, minutes: 30 }).toString()
    ).toISOString();
    const fromIndianDateTime = new Date(
      DateTime.fromMillis(
        new Date(
          new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          })
        ).setHours(0, 0, 0, 0)
      )
        .plus({ hours: 5, minutes: 30 })
        .toString()
    ).toISOString();
    const rows = await Db.managerActivity.getList(
      id,
      fromIndianDateTime,
      toIndianDateTime
    );
    return { success: true, type: true, data: rows };
  } else {
    res.status(401).send({
      success: false,
      type: false,
      userMessage: "Login Required",
    });
  }
}

async function recordActivity(req: Request, id: string, activity: string) {
  const activityData: IMngrActivity = {
    id,
    ip: getIp(req),
    browser: getUserBrowser(req),
    iAt: new Date(
      DateTime.utc().plus({ hours: 5 }).plus({ minutes: 30 }).toString()
    ).toISOString(),
    os: getUserOS(req),
    userAgent: req.headers["user-agent"] || "",
    activity,
  };
  await Db.managerActivity.set(activityData);
}

async function verifyLogin(req: Request, res: Response) {
  const { userName, password } = req.body;
  const { jwtTokenAlgo, jwtTokenKey, jwtTokenIV } = config;
  const data = { userName, password };
  data.password = Encrypt.hash(password, config.secretKey);
  data.userName = Encrypt.hash(userName, config.secretKey);
  const rows = await Db.manager.verifyLogin(data.userName, data.password);

  if (rows.isVerified && !rows.disabled) {
    const signOpts: SignOptions = {
      expiresIn: "24h",
    };
    await recordActivity(req, rows.id, "Logged In Successfully");
    const jwtToken = jwt.sign(
      { id: rows.id, user: req.body.userName, userType: "manager" },
      config.jwtSecret,
      signOpts
    );
    const cipher = crypto.createCipheriv(jwtTokenAlgo, jwtTokenKey, jwtTokenIV);
    const encToken = Buffer.concat([
      cipher.update(Buffer.from(jwtToken).toString("base64")),
      cipher.final(),
    ]).toString("hex");
    const luxonTime = new Date(
      DateTime.utc().plus({ hours: 29, minutes: 30 }).toString()
    ).toISOString();
    const expiresAt = new Date(luxonTime);
    res.cookie("ch-token", encToken, {
      expires: expiresAt,
    });
    res.send({
      success: true,
      type: true,
      data: { isDefault: rows.isDefault },
      userMessage: "Logged in Successfully",
    });
  } else {
    res.send({
      success: true,
      type: false,
      userMessage: "Login Failed! Invalid Login Credentials",
    });
  }
}

async function updateMngrProfile(req: Request, res: Response) {
  const { body } = req;
  const { email } = req.params;
  const cookie = req.headers.cookie as string;
  const { success, info } = authenticate(cookie);
  if (success && info) {
    await recordActivity(req, info.id, `Updated Manager Profile of ${email}`);
    await Db.manager.setCtxByEmail(email, body);
    return {
      success: true,
      type: true,
      userMessage: "Manager Profile Updated Successfully",
    };
  } else {
    res.status(401).send({
      success: true,
      type: false,
      userMessage: "Login Required",
    });
  }
}

async function validateManager(req: Request, res: Response) {
  const { email } = req.body;
  const cookie = req.headers.cookie as string;
  const { success, info } = authenticate(cookie);
  if (success && info) {
    const ctx = await Db.manager.getCtx(info.id);
    if (ctx && ctx.email !== email) {
      const row = await Db.manager.getCtxByEmail(email);
      if (row)
        return { success: true, type: true, data: { valid: true, email } };
      else
        return {
          success: true,
          type: false,
          data: { valid: false },
          userMessage: "No Manager found with entered email",
        };
    } else {
      return {
        success: true,
        type: false,
        userMessage: "Please visit Profile Section to edit your profile ",
      };
    }
  } else {
    res.status(401).send({
      success: true,
      type: false,
      userMessage: "Login Required",
    });
  }
}

async function getMngrProfile(req: Request, res: Response) {
  const { email } = req.params;
  const cookie = req.headers.cookie as string;
  const { success, info } = authenticate(cookie);
  if (success && info) {
    const row = await Db.manager.getCtxByEmail(email);
    return { success: true, type: true, data: row };
  } else
    res.status(401).send({
      success: true,
      type: false,
      userMessage: "Login Required",
    });
}

async function getProfile(req: Request, res: Response) {
  const cookie = req.headers.cookie as string;
  const { success, info } = authenticate(cookie);

  if (success && info) {
    const { id } = info;
    const row = await Db.manager.getCtx(id);
    return { success: true, type: true, data: row };
  } else {
    res.status(401).send({
      success: true,
      type: false,
      userMessage: "Login Required",
    });
  }
}

async function changePassword(req: Request, res: Response) {
  const { password } = req.body;
  const cookie = req.headers.cookie as string;
  const { success, info } = authenticate(cookie);
  res.cookie("ch-token", null, {
    expires: new Date("1970-01-01"),
  });
  if (success && info) {
    const encPass = Encrypt.hash(password, config.secretKey);
    const { id, user } = info;
    if (id && user) {
      const dbUsername = Encrypt.hash(user, config.secretKey);
      await Db.manager.changeDefault(id, encPass, dbUsername);
      await recordActivity(req, info.id, "Password Changed");
      res.send({
        success: true,
        type: true,
        userMessage: "Password Changed Successfully",
      });
    } else
      return {
        success: true,
        type: false,
        userMessage: "Invalid Request",
      };
  } else
    return res.status(401).send({
      success: true,
      type: false,
      userMessage: "Login Required",
    });
}

async function createManager(req: Request, res: Response) {
  const cookie = req.headers.cookie as string;
  const { success, info } = authenticate(cookie);
  if (success && info) {
    const { body } = req;
    const { email, name } = body;
    const isExists = await Db.manager.findMngr(email);
    if (!isExists) {
      const password = genPass(userType.manager);
      const clientPassword = ClientEncrypt.hashPassword(
        password,
        config.clientSecretKey
      );
      body.password = Encrypt.hash(clientPassword, config.secretKey);
      const id = genId(8, true);
      const userName = genId(8);
      body.userName = Encrypt.hash(userName, config.secretKey);
      const attrs = {
        disabled: false,
        createdBy: info.id,
      };
      const mgrInfo = Object.assign(body, attrs);
      const isInserted = await Db.manager.createMngrCtx(id, mgrInfo);
      if (isInserted) {
        const htmlTemplate = getMngrCredentialsTemplate(
          name,
          userName,
          password
        );
        sendgrid.setApiKey(config.sendGridKey);
        const emailInfo: MailDataRequired = {
          to: email,
          from: {
            email: "donotreply-welcome@chaathra.com",
            name: "Admin-Chaathra",
          },
          subject: "Welcome to Chaathra",
          html: htmlTemplate,
        };
        await sendgrid.send(emailInfo);
        return {
          success: true,
          type: true,
          userMessage: "Manager Created Successfully",
        };
      }
    } else
      return {
        success: true,
        type: false,
        userMessage: "Manager Already Exists",
      };
  } else {
    return res.status(401).send({
      success: false,
      type: false,
      userMessage: "Login Required",
    });
  }
}
