//This script is modeled after:
// https://www.browserstack.com/docs/automate/selenium/getting-started/nodejs

require("dotenv").config();
//Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env

//prints out enviroment vars for debugging
//console.log(process.env.email);
//Imports the necessary Selenium WebDriver modules.
const { Builder, By, Key, until, Capabilities } = require("selenium-webdriver");

// https://www.selenium.dev/selenium/docs/api/javascript/By.html
//Defines a test suite named "BStack demo test".

const chrome = require("selenium-webdriver/chrome");

describe("BrowserStack Homepage Login test", () => {
  let options = new chrome.Options();
  options.addArguments(
    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  );
  let driver;
  //Initializes a Chrome WebDriver instance before all tests run.
  beforeAll(() => {
    driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .usingServer(`http://localhost:4444/wd/hub`)
      .withCapabilities(Capabilities.chrome())
      .build();
  });

  //Quits the WebDriver session after all tests have completed.
  afterAll(async () => {
    await driver.quit();
  });

  //Start Test
  test("BStack Login test", async () => {
    // Go to Browserstack.com
    await driver.get("https://browserstack.com");

    // Get the resolution size
    let resolution = await driver.manage().window().getRect();
    let width = resolution.width;
    let height = resolution.height;

    console.log(`Width: ${width}, Height: ${height}`);
    await driver.wait(
      until.titleMatches(
        /Most Reliable App & Cross Browser Testing Platform | BrowserStack/i
      ),
      10000
    );

    //Depending on the size of the browser window, .primary-menu-toggle may or may not be in view
    //Therefore, window size detection is required to click on primary-menu-toggle if in mobile view
    if (width < 980) {
      await driver.wait(
        until.elementLocated(By.id("primary-menu-toggle")),
        5000
      );
      console.log("Responsive screen size detected...");

      await driver.findElement(By.id("primary-menu-toggle")).click();
    }
    await driver.wait(
      until.elementLocated(By.css(".bstack-mm-main-link-sign-in"))
    );

    await driver.findElement(By.css(".bstack-mm-main-link-sign-in")).click();

    let isElementPresent = await driver
      .findElements(By.css("._vis_hide_layer"))
      .then((elements) => elements.length > 0);

    if (isElementPresent) {
      // Wait for the overlapping element to disappear
      await driver.wait(
        until.elementIsNotVisible(
          driver.findElement(By.css("._vis_hide_layer"))
        ),
        10000
      );
    }

    console.log("Menu Button Clicked");

    await driver.wait(until.elementLocated(By.id("user_email_login")));

    await driver
      .findElement(By.id("user_email_login"))
      .sendKeys(process.env.email);

    console.log("Entered email address using sendKeys");
    //https://www.selenium.dev/documentation/webdriver/elements/interactions/#send-keys

    await driver
      .findElement(By.id("user_password"))
      .sendKeys(process.env.password);

    await driver.findElement(By.css("#user_submit")).click();

    await driver.wait(until.elementLocated(By.css(".bs-alert-error")));

    expect(await driver.findElement(By.css(".bs-alert-error")).getText()).toBe(
      "Something went wrong. Please contact our support."
    );
  }, 1000000);
});
