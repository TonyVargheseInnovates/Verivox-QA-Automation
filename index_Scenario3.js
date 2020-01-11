/* 
    Author : Tony Varghese
    
    AS A User 
    I WANT TO use the DSL Calculator  
    SO THAT I am able to select the best possible tariff for me 
    
*/

/*
    Scenario 3: Lazy loading/pagination for loading the Result List 

      GIVEN the User is on the DSL Result List (follow scenario 1)  
      WHEN there are more than 20 tariffs available for the provided Vorwahl and bandwidth  
      THEN the User should a button labeled as "20 weitere laden" 
      AND WHEN he/she clicks on this button  
      THEN the list should be appended with next 20 tariffs and so on until all Tariffs are loaded
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

    // Scenario 3 begins

    console.log("Scenario 3 Begins");

    let tariffs = await driver.wait(
      until.elementsLocated(By.xpath("//app-tariff-provider"))
    );
    console.log("-- Results List Loaded with " + tariffs.length + " tariffs");

    // Validating more than 20 Tariffs loaded

    if (tariffs.length > 20) {
      let loadTariffButton = await driver.wait(
        until.elementLocated(
          By.xpath("//button[@class='btn btn-primary text-uppercase']")
        )
      );
      let loadTariffButtonEnabled = await loadTariffButton.isEnabled();
      while (loadTariffButtonEnabled) {
        await loadTariffButton.click();
        console.log("-- User clicks on Load Tariff Button");
        await driver.wait(
          until.elementLocated(
            By.xpath(`(//app-tariff-provider)[${tariffs.length + 1}]`)
          )
        );
        let newTariffs = await driver.wait(
          until.elementsLocated(By.xpath("//app-tariff-provider"))
        );
        tariffs.length = newTariffs.length;
        console.log(
          "-- Results List Loaded with " + tariffs.length + " tariffs"
        );
      }
    } else {
      console.log("-- More than 20 Tariffs not loaded");
    }
  } catch (error) {}
}

dslCalculator();
