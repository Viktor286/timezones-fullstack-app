describe('Timezone clock list', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const timezonesInput = 'section.timezones-selector input';
  const timezoneClockListItems = '.timezones-clocks ul li';
  const resetTimezonesSelectorDelayOnBlur = 200 + 100; // exact value + extra

  it('should contain local clock as default without ability to delete', () => {
    cy.get(timezoneClockListItems)
      .should('have.length', 1)
      .should('not.contain.text', 'New York') // as it should be default;
      .should('not.contain.html', 'button');
  });

  it('should receive time zones from TimezoneSelector and should be able to remove them', () => {
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
});
