/* 
    Author : Tony Varghese
    
    AS A User 
    I WANT TO use the DSL Calculator  
    SO THAT I am able to select the best possible tariff for me 
    
*/

/*
    Scenario 1: DSL Result List - verify result list 
    
        GIVEN the User is on www.verivox.de 
        WHEN he is on the DSL calculator 
        AND he enters prefix/code “Ihre Vorwahl” as 030 with 16 Mbit/s bandwidth selection 
        AND clicks on the button labeled as "JETZT VERGLEICHEN"  
        THEN he should be able see the Result List page with all the available Tariffs 

*/

const { Builder, By, until } = require("selenium-webdriver");
require("chromedriver");
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
  } catch (error) {
    console.log(error);
  }
}

dslCalculator();
