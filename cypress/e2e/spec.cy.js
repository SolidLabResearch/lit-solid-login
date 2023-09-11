describe('Web app', () => {
  it('Successfully loads', () => {
    cy.visit('/');
  })

  it('Execute query on public data', () => {
    cy.visit('/');
    cy.contains('Show book wish list').click();
    cy.contains('Too Late'); // Check if it has one of the correct books.
  });

  it('Log in and execute query on private data', () => {
    cy.visit('/');
    cy
      .get('solid-login')
      .shadow()
      .find('input#webid')
      .type('http://localhost:3000/example/profile/card#me');

    cy
      .get('solid-login')
      .shadow()
      .contains('Log in')
      .click();

    // Log in
    cy.get('input#email').type('hello@example.com');
    cy.get('input#password').type('abc123');
    cy.contains('button', 'Log in').click();
    cy.contains('button', 'Authorize').click();

    cy
      .get('solid-login')
      .shadow()
      .contains('Logged in')
      .then(() => {
        // Query private data
        cy.contains('Show favourite books').click();
        cy.contains('It Ends With Us'); // Check if it has one of the correct books.
      });
  });
})
