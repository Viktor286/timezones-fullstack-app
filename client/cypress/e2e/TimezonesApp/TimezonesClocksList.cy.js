describe('Timezone clock list', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const timezonesInput = 'section.timezones-selector input';
  const clocksFilterInput = '#clocks-filter';
  const timezoneClockListItems = '.timezones-clocks ul li';
  const resetTimezonesSelectorDelayOnBlur = 200 + 100; // exact value + extra

  it('should contain local clock as default without ability to delete', () => {
    cy.get(timezoneClockListItems)
      .should('have.length', 1)
      .should('contain.text', 'New_York') // as it should be default;
      .should('not.contain.html', 'button'); // delete button
  });

  it('should change local clock after click on corresponding button', () => {
    cy.get(timezoneClockListItems).should('have.length', 1).should('contain.text', 'New_York'); // as it should be default;
    cy.get(timezonesInput).type(`Tokyo`).type('{enter}');
    cy.get('#clocks-list li[data-iana="Asia/Tokyo"] button.update-local-clock').click({ force: true });
    cy.get(timezoneClockListItems).should('have.length', 2).first().should('contain.text', 'Asia/Tokyo');
    cy.get(timezoneClockListItems).should('have.length', 2).last().should('contain.text', 'New_York');
  });

  it('should add time zones from TimezoneSelector and should be able to remove them', () => {
    cy.get(timezonesInput).type(`Tokyo`).type('{enter}');
    // await established resetTimezonesSelector delay on blur
    cy.wait(resetTimezonesSelectorDelayOnBlur);

    cy.get(timezonesInput).type(`Paris`).type('{enter}');
    // await established resetTimezonesSelector delay on blur
    cy.wait(resetTimezonesSelectorDelayOnBlur);

    cy.get(timezonesInput).type(`Berlin`).type('{enter}');
    // await established resetTimezonesSelector delay on blur
    cy.wait(resetTimezonesSelectorDelayOnBlur);

    cy.get(timezoneClockListItems)
      .should('have.length', 4)
      .should('contain.text', 'York') // as it should be default;
      .should('contain.text', 'Tokyo')
      .should('contain.text', 'Paris')
      .should('contain.text', 'Berlin');

    // Delete items
    cy.get(`.timezones-clocks ul li[data-iana="Asia/Tokyo"] button.remove`).click();
    cy.get(timezoneClockListItems).should('have.length', 3).should('not.contain.text', 'Tokyo');

    cy.get(`.timezones-clocks ul li[data-iana="Europe/Paris"] button.remove`).click();
    cy.get(timezoneClockListItems).should('have.length', 2).should('not.contain.text', 'Paris');

    cy.get(`.timezones-clocks ul li[data-iana="Europe/Berlin"] button.remove`).click();
    cy.get(timezoneClockListItems).should('have.length', 1).should('not.contain.text', 'Berlin');
  });

  it('should filter out the clocks and bring them back on empty filter while keeping add/remove functionality', () => {
    cy.get(timezonesInput).type(`Tokyo`).type('{enter}');
    // await established resetTimezonesSelector delay on blur
    cy.wait(resetTimezonesSelectorDelayOnBlur);

    cy.get(timezonesInput).type(`Paris`).type('{enter}');
    // await established resetTimezonesSelector delay on blur
    cy.wait(resetTimezonesSelectorDelayOnBlur);

    cy.get(timezonesInput).type(`Berlin`).type('{enter}');
    // await established resetTimezonesSelector delay on blur
    cy.wait(resetTimezonesSelectorDelayOnBlur);

    // It should filter out the clocks
    cy.get(clocksFilterInput).type('s');
    cy.get(timezoneClockListItems)
      .should('have.length', 2)
      .should('contain.text', 'Asia/Tokyo')
      .should('contain.text', 'Europe/Paris');

    // It should filter out all clocks
    cy.get(clocksFilterInput).type('a');
    cy.get(timezoneClockListItems).should('have.length', 1).should('contain.text', 'no clocks to show');

    // It should bring them all back
    cy.get(clocksFilterInput).type('{backspace}').type('{backspace}');
    cy.get(timezoneClockListItems)
      .should('have.length', 4)
      .should('contain.text', 'Asia/Tokyo')
      .should('contain.text', 'Europe/Paris')
      .should('contain.text', 'Europe/Berlin');

    // + remove should only remove one clock from filter list
    cy.get(clocksFilterInput).type('s');
    cy.get(`.timezones-clocks ul li[data-iana="Asia/Tokyo"] button.remove`).click();
    cy.get(timezoneClockListItems)
      .should('have.length', 1)
      .should('not.contain.text', 'Tokyo')
      .should('contain.text', 'Europe/Paris');

    // + add should add new clock to filtered list
    cy.get(timezonesInput).type(`seoul`).type('{enter}');
    cy.get(timezoneClockListItems)
      .should('have.length', 2)
      .should('contain.text', 'Europe/Paris')
      .should('contain.text', 'Asia/Seoul');

    // bring them all back: result should contain added clocks and not contain removed clock
    cy.get('.timezones-clocks .input-reset-filter').click();

    cy.get(timezoneClockListItems)
      .should('have.length', 4)
      .should('contain.text', 'Asia/Seoul')
      .should('contain.text', 'Europe/Paris')
      .should('contain.text', 'Europe/Berlin');
  });
});
