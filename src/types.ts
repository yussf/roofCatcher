import { Page } from "puppeteer";

export interface MessengerInterface {
  registerWebhook: () => void;
  sendMessage: (text: string) => Promise<boolean>;
}

export interface HandlerInterface {
  call: () => Promise<Array<string> | null>;
  init: (options: { page: Page }) => void;
}

// export interface ManagerInterface {
//   registerHandler: (h: HandlerInterface) => Promise<void>;
//   registerMessenger: (m: MessengerInterface, op: { webhook: boolean }) => void;
//   dispatch: () => void;
//   init: () => void;
// }
