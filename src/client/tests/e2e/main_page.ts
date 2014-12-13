/// <reference path="../../../../typings/angular-protractor/angular-protractor.d.ts" />

class MainPage {
  foodIndicator = element(by.className('icon-food'));
  lumberIndicator = element(by.className('icon-lumber'));
  stoneIndicator = element(by.className('icon-stone'));
  goldIndicator = element(by.className('icon-gold'));

  ageName = element(by.tagName('age-indicator'))
      .element(by.className('age-name'));

  timeIndicator = element(by.className('time-indicator'));
  timePicker = element(by.tagName('timeline-picker'));
  pickTime(t: number) {
    browser.actions().mouseMove(
        this.timePicker.getWebElement(), 
        {x: 36 + 3 * t, y: 5}).click().perform();
  }

  taskDistribution = element(by.className('task-distribution'));
  idleTaskAssignment = this.taskDistribution.element(by.className('icon-idle'));

  buildPane = element(by.tagName('build-pane'));
  
  constructButton = element(by.className('icon-construct'));
  constructHouseButton = this.buildPane.element(by.className('icon-house'));

  harvestButton = element(by.className('icon-harvest'));
  harvestSheepButton = this.buildPane.element(by.className('icon-sheep'));

  expectSelected(taskObject: string, count: number) {
    var selection = element(by.tagName('selection'));
    expect(selection.element(by.className('icon-' + taskObject)).isPresent()).toBe(true);
    expect(selection.element(by.className('counter')).getText()).toBe('' + count);
  }
}
export = MainPage;

