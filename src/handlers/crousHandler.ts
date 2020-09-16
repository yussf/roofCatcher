import { Page } from "puppeteer";
import { HandlerInterface } from "src/types";

export class crousHandler implements HandlerInterface {
  page: Page;
  url: string;
  constructor(url: string) {
    this.url = url;
  }
  countPrev: number = 0;
  getAvailability = async (): Promise<number> => {
    await this.page.goto(this.url, { waitUntil: "networkidle0" });
    const resultsCount = await this.page.evaluate(() => {
      const resultsCount = document.getElementById("SearchResultsList")
        ?.children.length;
      return resultsCount;
    });
    return resultsCount || 0;
  };
  init = (options: { page: Page }): void => {
    this.page = options.page;
  };
  call = async (): Promise<Array<string> | null> => {
    try {
      const resultsCount = await this.getAvailability();
      if (resultsCount) {
        if (resultsCount > this.countPrev) {
          this.countPrev = resultsCount;
          return [`CROUS has ${resultsCount} housing available`];
        } else {
          this.countPrev = resultsCount;
          return [];
        }
      } else {
        return [];
      }
    } catch (e) {
      console.log({ "error catched : ": e });
      return null;
    }
  };
}
