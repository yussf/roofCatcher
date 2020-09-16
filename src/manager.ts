import puppeteer from "puppeteer";
import { HandlerInterface, MessengerInterface } from "./types";

export class Manager {
  handlers: Array<HandlerInterface> = Array();
  messenger: MessengerInterface;
  ShouldRegisterWebhook: boolean;
  browser: puppeteer.Browser;

  init = async (): Promise<void> => {
    this.browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
  };
  registerHandler = async (handler: HandlerInterface): Promise<void> => {
    this.handlers.push(handler);
    const page = await this.browser.newPage();
    handler.init({ page });
  };

  registerMessenger = (
    m: MessengerInterface,
    options: { webhook: boolean }
  ): void => {
    this.messenger = m;
    this.ShouldRegisterWebhook = options.webhook;
  };

  dispatch = async (): Promise<void> => {
    if (this.ShouldRegisterWebhook && this.messenger) {
      this.messenger.registerWebhook();
      this.ShouldRegisterWebhook = false;
    }
    const time = Date().toString().split(" GMT")[0];
    console.log("Dispatched at " + time);
    let feedback: Array<string> = Array();
    for (let handler of this.handlers) {
      const res = await handler.call();
      if (res) feedback = feedback.concat(res);
    }
    let response = "Housing available at: \n";
    if (feedback.length == 0) {
      console.log("No news.");
    } else {
      response += feedback.join("\n");
      const res = await this.messenger.sendMessage(response);
      if (res) console.log("Message sent!");
      else console.log("An error occured!");
    }
  };
}
