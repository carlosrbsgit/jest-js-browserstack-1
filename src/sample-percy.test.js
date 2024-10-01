const { Builder } = require("selenium-webdriver");
const percySnapshot = require("@percy/selenium-webdriver");

(async function example() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    const resolutions = [
      { width: 375, height: 812 },
      { width: 480, height: 800 },
      { width: 720, height: 1200 },
      { width: 1280, height: 1400 },
      { width: 1440, height: 1200 },
      { width: 1920, height: 1080 },
    ];
    for (const resolution of resolutions) {
      await driver
        .manage()
        .window()
        .setRect({ width: resolution.width, height: resolution.height });

      await driver.get("https://www.browserstack.com");
      await percySnapshot(
        driver,
        "bs Homepage",
        `BS HOME EXAMPLE 1 SNAPSHOT - ${resolution.width}px`
      );
      await driver.get("https://k8s.bsstag.com/");
      await percySnapshot(
        driver,
        "Non-Prod  Site",`PROD HOME EXAMPLE 1 SNAPSHOT - ${resolution.width}px`
      );

      await driver.get("https://www.browserstack.com/pricing");
      await percySnapshot(
        driver,
        "bs Homepage",
        `BS PRICING SNAPSHOT - ${resolution.width}px`
      );

      await driver.get("https://k8s.bsstag.com/pricing");
      await percySnapshot(
        driver,
        "Non-Prod  Site",
        `BS PRICING PROD SNAPSHOT - ${resolution.width}px`
      );

      await driver.get("https://www.browserstack.com/integrations/automate");
      await percySnapshot(
        driver,
        "bs Homepage",
        `BS automate live SNAPSHOT - ${resolution.width}px`
      );

      await driver.get("https://k8s.bsstag.com/integrations/automate");
      await percySnapshot(
        driver,
        "Non-Prod  Site",
        `BS automate PROD SNAPSHOT - ${resolution.width}px`
      );
    }
  } finally {
    await driver.quit();
  }
})();
