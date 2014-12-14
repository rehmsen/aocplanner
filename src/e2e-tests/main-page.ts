/// <reference path="../../typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../../typings/selenium-webdriver/selenium-webdriver.d.ts" />

function hasClass(element: protractor.ElementFinder, cls: string) {
  return element.getAttribute('class').then(function (classes) {
    return classes.split(' ').indexOf(cls) !== -1;
  });
};

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
  getTaskAssignment(taskObject: string) {
    return this.taskDistribution.element(by.className('icon-' + taskObject));
  }
  expectAssigned(taskObject: string, count: number) {
    expect(this.getTaskAssignment(taskObject).isPresent()).toBe(true);
    expect(this.taskDistribution.element(by.className('counter')).getText()).toBe('' + count);
  }

  buildPane = element(by.tagName('build-pane'));

  unitButtons = element.all(by.repeater('unit in ctrl.rulesService.units'));
  techButtons = element.all(by.repeater('tech in ctrl.rulesService.technologies'));
  
  // expectEnabledButtons(buttons: protractor.ElementArrayFinder, icons: string[]) {
  //   buttons.filter((button) => {
  //     return button.isDisplayed() && button.isEnabled();
  //   }).then((displayedEnabledButtons) => {
  //     var displayedEnabledIconPromises = displayedEnabledButtons.map((button: protractor.ElementFinder) => {
  //       return button.getAttribute('class').then((classesString: string) => {
  //         var classes = classesString.split(' ');
  //         var iconClasses = classes.filter((cls) => {
  //           return cls.indexOf('icon-') == 0;
  //         });
  //         expect(iconClasses.length).toBe(1);
  //         return iconClasses[0].substring('icon-'.length);
  //       });
  //     });
  //     webdriver.promise.fullyResolved(displayedEnabledIconPromises).then((displayedEnabledIcons) => {
  //       expect(displayedEnabledIcons).toEqual(icons);
  //     })
  //   });


  //   // icons.forEach((icon: string) => {
  //   //   buttons.filter(function(button) {
  //   //     return hasClass(button, 'icon-' + icon);
  //   //   }).then(function(buttons) {
  //   //     expect(buttons.length).toBe(1);
  //   //     expect(buttons[0].isEnabled()).toBe(true);
  //   //   })
  //   // });
  // }

  // expectDisabledButtons(buttons: protractor.ElementArrayFinder, icons: string[]) {
  //   icons.forEach((icon: string) => {
  //     expect(buttons.element(by.class('icon-' + icon))).not.isEnabled();
  //   });
  // }

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

