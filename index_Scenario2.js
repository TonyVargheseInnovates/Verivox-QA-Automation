/* 
    Author : Tony Varghese
    
    AS A User 
    I WANT TO use the DSL Calculator  
    SO THAT I am able to select the best possible tariff for me 
    
*/

/* 
      Scenario 2: Result List - verify Offer detail page  
        
        GIVEN the User is on the DSL Result List (follow scenario 1) 
        WHEN he selects one of the listed Tariffs 
        AND clicks on "mehr zum Tarif" button 
        THEN he should be able see the details of the selected Tariff (see screenshot 2) 
        AND he should also see a button labeled as "In 5 Minuten online wechseln" (see screenshot 3) 
      
      Note : For additional Test Coverage, Checking 5 tariffs on result list page and Details page
*/

const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const driver = new Builder().forBrowser("chrome").build();

async function dslCalculator() {
  try {
    driver
      .manage()
      .window()
      .maximize();

    await driver.get("https://www.verivox.de/");

    // Accepting Cookies by clicking on Concent Bar
    var consentbar = driver.findElement(
      By.css("span.gdpr-vx-consent-bar-button")
    );
    if (consentbar) {
      consentbar.click();
    }

    // Clicking on dslcalculator

    await driver
      .wait(until.elementLocated(By.css("nav > ul > li:nth-child(4) > a")))
      .click();

    await driver.wait(
      until.titleIs(
        "Internettarife & Internetanbieter stressfrei vergleichen | VERIVOX"
      )
    );

    await driver
      .findElement(By.xpath("(//input[@name='Prefix'])[1]"))
      .sendKeys("030");

    await driver.findElement(By.xpath("(//button[@type='submit'])[2]")).click();

    await driver.wait(
      until.titleIs("DSL-Preisvergleich aller DSL-Anbieter in Deutschland")
    );

    let resultList = await driver.wait(
      until.elementLocated(
        By.xpath("//h1[@class='mt-3 text-center text-xl-left']")
      )
    );
    let resultListName = await resultList.getText();

    if (resultListName === "Ermittelte Tarife") {
      if (
        await driver
          .findElement(By.xpath("(//app-tariff[@class='d-block w-100'])[1]"))
          .isDisplayed()
      ) {
        console.log("Scenario 1 Passed - Result List Populated Successfully");
      }
    } else {
      console.log("Scenario 1 Failed - Result List Failed to populate");
    }

    // Scenario 2 Begins

    console.log("Scenario 2 Begins");
    for (let i = 4; i <= 8; i++) {
      // Retreiving Tariff Name and Price from Result List
      let resultListTariffNamePath = await driver.wait(
        until.elementLocated(
          By.xpath(`(//strong[@class='headline-large'])[${i}]`)
        )
      );

      let resultListTariffName = await resultListTariffNamePath.getText();
      // console.log("First Tariff Name Displayed -- " + resultListTariffName);

      let resultListTariffPricePath = await driver.wait(
        until.elementLocated(
          By.xpath(
            `(//div[@class='position-relative large mb-2']/strong)[${i}]`
          )
        )
      );

      let resultListTariffPrice = await resultListTariffPricePath.getText();
      // console.log("First Tariff Price Displayed -- " + resultListTariffPrice);

      await (
        await driver.wait(
          until.elementLocated(
            By.xpath(`(//a[@class='button-primary w-100'])[${i}]`)
          )
        )
      ).click();

      await driver.wait(
        until.titleIs("Verivox – Vergleichen. Wechseln. Sparen!")
      );

      // Validating Button labelled 'In 5 Minuten online wechseln'

      let firstAvailabilityCheckButton = await driver.wait(
        until.elementLocated(
          By.xpath("//a[@data-description='firstAvailabilityCheckButton']")
        )
      );
      let checkoutButtonDisplayed = await firstAvailabilityCheckButton.isDisplayed();
      debugger;
      if (checkoutButtonDisplayed) {
        console.log(
          "-- Tariff " +
            resultListTariffName +
            " -> Button labelled 'In 5 Minuten online wechseln' - Displayed successfully -> Pass"
        );
      } else {
        console.log(
          "-- Tariff " +
            resultListTariffName +
            " -> Button labelled 'In 5 Minuten online wechseln' Display -> Failed"
        );
      }

      // Validating Tariff Details

      let detailsTariffPricePath = await driver.wait(
        until.elementLocated(By.xpath("(//div[@class='price'])[1]"))
      );

      let detailsTariffPrice = await detailsTariffPricePath.getText();
      // console.log("Details Tariff Price : " + detailsTariffPrice);

      let detailsTariffNamePath = await driver.wait(
        until.elementLocated(
          By.xpath("//strong[@data-description='providerName']")
        )
      );

      let detailsTariffName = await detailsTariffNamePath.getText();
      // console.log("Details Tariff Name : " + detailsTariffName);

      if (
        resultListTariffName === detailsTariffName &&
        resultListTariffPrice === detailsTariffPrice
      ) {
        console.log(
          "-- Tariff " +
            resultListTariffName +
            " Details (Name and Price) Validated --> Pass"
        );
      } else {
        console.log(
          "-- Tariff " +
            resultListTariffName +
            " Details (Name and Price) Validated  --> Fail"
        );
      }

      //  Clicking on Back Button
      await driver
        .wait(until.elementLocated(By.xpath("(//span[@class='back'])[1]")))
        .click();
    }
    console.log("Scenario 2 Ends");
  } catch (error) {
    console.log(error);
  }
}

dslCalculator();
