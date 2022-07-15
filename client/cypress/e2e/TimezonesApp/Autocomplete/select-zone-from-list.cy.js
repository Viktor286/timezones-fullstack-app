describe('Timezone autocomplete list', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should filter out list to 2 items keeping mouse functionality', () => {
    const timezonesInput = 'section.timezones-selector input';
    const timezoneListItem = 'ul.timezones-list li';

    // should display New_York and New_Salem after "New" filter applied
    cy.get(timezonesInput).type(`New `);
    cy.get(timezoneListItem)
      .should('have.length', 2)
      .should('contain.text', 'New York')
      .should('contain.text', 'New Salem')
      // first element should be selected
      .first()
      .should('have.class', 'active');

    // should support click to select timezone
    cy.get(timezoneListItem).last().click();
    cy.get(timezonesInput).should('contain.value', 'New_Salem');
  });

  it('should filter out list to 2 items keeping keyboard functionality', () => {
    const timezonesInput = 'section.timezones-selector input';
    const timezoneListItem = 'ul.timezones-list li';

    // should display New_York and New_Salem after "New" filter applied
    cy.get(timezonesInput).type(`New `);
    cy.get(timezoneListItem)
      .should('have.length', 2)
      .should('contain.text', 'New York')
      .should('contain.text', 'New Salem')
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
    cy.get(timezonesInput).type(`{enter}`).should('contain.value', 'New_Salem');
  });
});
