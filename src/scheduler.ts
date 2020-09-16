import { Manager } from "./manager";

export class Scheduler {
  manager: Manager;
  interval: number = Number.parseInt(process.env.INTERVAL || "5") * 60 * 1000;

  constructor(manager: Manager) {
    this.manager = manager;
  }

  start = async (mode: "once" | "multi") => {
    switch (mode) {
      case "multi":
        await this.manager.dispatch();
        setInterval(async () => {
          await this.manager.dispatch();
        }, this.interval);
        break;
      case "once":
        await this.manager.dispatch();
        process.exit(0);
        break;
    }
  };
}
