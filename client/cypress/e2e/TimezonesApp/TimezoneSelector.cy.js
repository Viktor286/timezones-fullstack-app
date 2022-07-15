describe('Timezone autocomplete list', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const timezonesInput = 'section.timezones-selector input';
  const timezoneListItem = 'ul.timezones-list li';
  const timezoneListItemActive = 'ul.timezones-list li.active';
  const pageHeader = 'header';
  const defaultTimezonesLength = 592;
  const resetTimezonesSelectorDelayOnBlur = 200 + 100; // exact value + extra

  it('should filter out list to 2 items keeping mouse functionality', () => {
    // should display Newfoundland and New_Salem but not New_York after "New" filter applied
    cy.get(timezonesInput).type(`New`);
    cy.get(timezoneListItem)
      .should('have.length', 2)
      .should('contain.text', 'New Salem')
      .should('contain.text', 'Newfoundland')
      .should('not.contain.text', 'New York') // as it should be default
      // first element should be selected
      .first()
      .should('have.class', 'active');

    // should support click to select timezone
    cy.get(timezoneListItem).first().click();
    cy.get(timezonesInput).should('contain.value', ''); // input should reset
  });

  it('should filter out list to 2 items keeping keyboard functionality', () => {
    // should display New_York and New_Salem after "New" filter applied
    cy.get(timezonesInput).type(`New`);
    cy.get(timezoneListItem)
      .should('have.length', 2)
      .should('contain.text', 'New Salem')
      .should('contain.text', 'Newfoundland')
      .should('not.contain.text', 'New York') // as it should be default
      // first element should be selected
      .first()
      .should('have.class', 'active');

    // should support ArrowDown/ArrowUp loop selection functionality
    cy.get(timezonesInput).type(`{downarrow}`);
    cy.get(timezoneListItem).last().should('have.class', 'active');

    // Check the Down Arrow works in cycle (jumps to the first item)
    cy.get(timezonesInput).type(`{downarrow}`);
    cy.get(timezoneListItem).first().should('have.class', 'active');

    // Check the Up Arrow works in cycle (jumps to the last item)
    cy.get(timezonesInput).type(`{uparrow}`);
    cy.get(timezoneListItem).last().should('have.class', 'active');

    // should support Enter to select timezone
    cy.get(timezonesInput).type(`{enter}`).should('contain.value', ''); // input should reset
  });

  it('should show full list on focus and hide it on blur or on escape', () => {
    cy.get(timezonesInput).click();
    cy.focused().should('have.id', 'timezones-search');
    cy.get(timezoneListItem).should('have.length', defaultTimezonesLength);

    cy.get(pageHeader).click();
    cy.focused().should('not.exist');
    cy.get(timezoneListItem).should('not.exist');

    // await established resetTimezonesSelector delay on blur
    cy.wait(resetTimezonesSelectorDelayOnBlur);

    // should blur on escape
    cy.get(timezonesInput).click();
    cy.focused().should('have.id', 'timezones-search');
    cy.get(timezoneListItem).should('have.length', defaultTimezonesLength);
    cy.get(timezonesInput).type(`{esc}`);
  });

  it('should not show already selected clocks', () => {
    cy.get(timezonesInput).type(`Tokyo`).type('{enter}');
    // await established resetTimezonesSelector delay on blur
    cy.wait(resetTimezonesSelectorDelayOnBlur);
    cy.get(timezonesInput).type(`Tok`);
    cy.get(timezoneListItem).should('not.contain.text', 'Tokyo');
  });

  it('should scroll-into-center-view an active element on the list', () => {
    // Try down direction
    const inputDown = cy.get(timezonesInput);
    inputDown.click();
    for (let i = 0; i < 20; i++) {
      inputDown.type(`{downarrow}`);
    }
    cy.get(timezoneListItemActive).should('be.visible');
    cy.get(pageHeader).click();

    // await established resetTimezonesSelector delay on blur
    cy.wait(resetTimezonesSelectorDelayOnBlur);

    // Try up direction
    const inputUp = cy.get(timezonesInput);
    inputUp.click();
    for (let i = 0; i < 20; i++) {
      inputUp.type(`{uparrow}`);
    }
    cy.get(timezoneListItemActive).should('be.visible');
    cy.get(pageHeader).click();
  });
});
