/// <reference path="../../typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />

import MainPage = require('./main-page');

describe('Main page', function() {
  var mainPage = new MainPage();

  it('should render with correct title', function() {
    browser.driver.manage().window().setSize(1280, 960);
    browser.get('http://localhost:8080/');
    expect(browser.getTitle()).toEqual('AoC Planner');
  });

  it('should have the correct start resources', function() {
    expect(mainPage.foodIndicator.getText()).toBe('200');
    expect(mainPage.lumberIndicator.getText()).toBe('200');
    expect(mainPage.goldIndicator.getText()).toBe('100');
    expect(mainPage.stoneIndicator.getText()).toBe('200');

    expect(mainPage.timeIndicator.getText()).toBe('0:00:00');
  });

  it('should start in dark age', function() {
    expect(mainPage.ageName.getText()).toBe('Dark Age');
  });

  it('should start at time 0', function() {
    expect(mainPage.timeIndicator.getText()).toBe('0:00:00');
  });

  it('should allow selecting one idle villager', function() {
    mainPage.idleTaskAssignment.click();
    mainPage.expectSelected('idle', 1);    
  });

  it('should allow assigning one idle villagers to build a house', function() {
    mainPage.constructButton.click();
    mainPage.constructHouseButton.click();

    expect(mainPage.foodIndicator.getText()).toBe('200');
    expect(mainPage.lumberIndicator.getText()).toBe('170');
    expect(mainPage.goldIndicator.getText()).toBe('100');
    expect(mainPage.stoneIndicator.getText()).toBe('200');

    expect(mainPage.timeIndicator.getText()).toBe('0:00:25');
  });

  it('should allow reassignment villager after temporary task', function() {
    mainPage.harvestButton.click();
    mainPage.harvestSheepButton.click();
  });

  it('should reset time when assigning to indefinite task', function() {
    expect(mainPage.timeIndicator.getText()).toBe('0:00:00');
  });

  it('should allow assigning multiple idle villagers to construct house', function() {
    mainPage.idleTaskAssignment.click();
    mainPage.idleTaskAssignment.click();
    mainPage.constructButton.click();
    mainPage.constructHouseButton.click();

    expect(mainPage.foodIndicator.getText()).toBe('200');
    expect(mainPage.lumberIndicator.getText()).toBe('140');
    expect(mainPage.goldIndicator.getText()).toBe('100');
    expect(mainPage.stoneIndicator.getText()).toBe('200');
  });

  it('should be faster to construct with multiple villagers', function() {
    expect(mainPage.timeIndicator.getText()).toBe('0:00:18');
  });

  it('should allow setting the time', function() {
    mainPage.pickTime(0);
    expect(mainPage.timeIndicator.getText()).toBe('0:00:00');
  });


});