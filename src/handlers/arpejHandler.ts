import { Page } from "puppeteer";
import { HandlerInterface } from "src/types";

export class arpejHandler implements HandlerInterface {
  resultsPrev: Array<boolean> = Array();
  page: Page;
  urls: Array<string>;
  constructor(urls: Array<string>) {
    this.urls = urls;
  }

  init = (options: { page: Page }): void => {
    this.page = options.page;
  };

  getAvailability = async (url: string): Promise<boolean> => {
    await this.page.goto(url);
    const iframe_url = await this.page.evaluate(() => {
      const iframe_url = document
        .getElementsByTagName("iframe")[1]
        .getAttribute("src");
      return iframe_url;
    });

    if (!iframe_url) {
      console.log("Couldn't find the iframe url of " + url);
    } else await this.page.goto(iframe_url, { waitUntil: "networkidle0" });
    const isAvailable = await this.page.evaluate(() => {
      const btn = document.getElementsByClassName(
        "iFrame__firstLine-right-button disabled"
      );
      return btn.length !== 1;
    });
    return isAvailable;
  };
  checkAll = async (): Promise<Array<boolean>> => {
    const availabilityArray = Array();
    for (let url of this.urls) {
      try {
        const state = await this.getAvailability(url);
        availabilityArray.push(state);
      } catch (e) {
        console.log("Error on " + url);
        console.log(e);
        availabilityArray.push(false);
      }
    }
    return availabilityArray;
  };

  call = async (): Promise<Array<string> | null> => {
    try {
      const results = await this.checkAll();
      const toReport: Array<string> = Array();
      for (let i = 0; i < results.length; i++) {
        if (results[i] && !this.resultsPrev[i]) {
          toReport.push(this.urls[i]);
        }
      }
      this.resultsPrev = results;
      return toReport;
    } catch {
      console.log("Something's wrong");
      return null;
    }
  };
}
