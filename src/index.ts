import { arpejHandler } from "./handlers/arpejHandler";
import { crousHandler } from "./handlers/crousHandler";
import { Manager } from "./manager";
import { fbMessenger } from "./fbMessenger";
import { arpej_urls, crous_url } from "./globals";
import { Scheduler } from "./scheduler";

const args = process.argv;
let mode: "once" | "multi" = "multi";
if (args.length === 3) {
  if (args[2] == "once") mode = "once";
  if (args[2] == "multi") mode = "multi";
}
(async () => {
  const manager = new Manager();
  await manager.init();
  await manager.registerHandler(new arpejHandler(arpej_urls));
  await manager.registerHandler(new crousHandler(crous_url));
  manager.registerMessenger(new fbMessenger(), { webhook: false });
  const scheduler = new Scheduler(manager);
  await scheduler.start(mode);
})();
