const { Builder, By, Key, until, Capabilities } = require("selenium-webdriver");

describe("Amazon CE Assignment", () => {
  let driver;

  beforeAll(() => {
    const capabilities = Capabilities.chrome();
    capabilities.set("bstack:options", {
      maskCommands: "setValues, getValues, click",
      geolocation: "40.730610,-73935424",
      networkProfile: "4g-lte-good",
      seleniumVersion: "4.1.0",
      localindentifier: "My Local Test",
    });

    driver = new Builder()
      .usingServer(`http://localhost:4444/wd/hub`)
      .withCapabilities(Capabilities.chrome())
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Amazon test", async () => {
    await driver.get("https://amazon.com");
    await driver.wait(until.titleMatches(/Amazon/i), 10000);

    await driver.wait(until.elementLocated(By.id("twotabsearchtextbox")));
    await driver.findElement(By.id("twotabsearchtextbox")).sendKeys("iphone x");

    let amazonSearchButton = await driver.findElement(
      By.id("nav-search-submit-button")
    );
    await amazonSearchButton.click();

    await driver.wait(until.titleMatches(/Amazon/i), 10000);

    let spanElement = await driver.findElement(
      By.xpath("//span[text()='Operating System']")
    );
    await spanElement.click();

    await driver.wait(until.titleMatches(/Amazon/i), 10000);
    let amazonFilterButton = await driver.findElement(
      By.id("s-all-filters-announce")
    );

    await driver.findElement(By.id("s-all-filters-announce")).click();

    expect(
      await driver.findElement(By.id("#s-all-filters-announce")).getText()
    ).toBe("Filters");
  }, 1000000);
});
