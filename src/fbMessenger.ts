import express from "express";
import axios from "axios";
import { MessengerInterface } from "./types";
import dotenv from "dotenv";

dotenv.config();
export class fbMessenger implements MessengerInterface {
  app = express();
  sendMessage = async (text: string): Promise<boolean> => {
    const url = "https://graph.facebook.com/v8.0/me/messages?access_token=";
    const secret_token = process.env.SECRET_TOKEN;
    const body = {
      messaging_type: "MESSAGE_TAG",
      tag: "CONFIRMED_EVENT_UPDATE",
      recipient: {
        id: process.env.RECIPIENT_PSID,
      },
      message: { text },
    };
    const res = await axios
      .post(url + secret_token, body)
      .then(() => {
        return true;
      })
      .catch((reason) => {
        console.log(reason);
        return false;
      });
    return res;
  };
  registerWebhook = (): void => {
    this.app.post("/webhook", (req, res) => {
      console.log(req?.body);
      res.status(200).send("EVENT_RECEIVED");
    });

    this.app.get("/webhook", (req, res) => {
      let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
      let mode = req.query["hub.mode"];
      let token = req.query["hub.verify_token"];
      let challenge = req.query["hub.challenge"];
      if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          res.sendStatus(403);
        }
      }
    });

    this.app.listen(process.env.PORT || 1337, () =>
      console.log(`Listening on ${process.env.PORT}`)
    );
  };
}
