const { Builder, By, until } = require("selenium-webdriver");
require("geckodriver");

const fileUnderTest =
  "file://" + __dirname.replace(/ /g, "%20") + "/../index.html";
const defaultTimeout = 10000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
  driver = await new Builder().forBrowser("firefox").build();
  await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async () => {
  await driver.quit();
}, defaultTimeout);

test("The stack should be empty in the beginning", async () => {
  let stack = await driver.findElement(By.id("top_of_stack")).getText();
  expect(stack).toEqual("n/a");
});

describe(
  "A Selenium test suite",
  () => {
    test("should open a prompt box", async () => {
      let push = await driver.findElement(By.id("push"));
      await push.click();
      let alert = await driver.switchTo().alert();
      await alert.sendKeys("Bananer");
      await alert.accept();
    });
    test("should display pop element in prompt box", async () => {
      let pop = await driver.findElement(By.id("pop"));
      await pop.click();
      let alert = await driver.switchTo().alert();
      let text = await alert.getText();
      expect(text.replace("Tog bort ", "")).toEqual("Bananer");
    });
  },
  defaultTimeout
);
