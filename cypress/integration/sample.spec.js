/// <reference types="cypress" />//

import Chance from 'chance';
const chance = new Chance();

describe('Firestarter', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });
  it('my first testing', () => {
    cy.contains('Select Country');
  });
  it('correct number Russia', () => {
    cy.get('#selectCountry').select('Russia', {
      force: true
    });
    cy.get('#inputPhoneNumber').type('9787701395');
    cy.get('button[type=submit]').should('not.be.disabled');
  });
  it('correct number Ukraine', () => {
    cy.get('#selectCountry').select('Ukraine', {
      force: true
    });
    cy.get('#inputPhoneNumber').type('506410301');
    cy.get('button[type=submit]').should('not.be.disabled');
  });
  it('wrong number Ukraine', () => {
    cy.get('#selectCountry').select('Ukraine', {
      force: true
    });
    cy.get('#inputPhoneNumber').type('812');
    cy.get('button[type=submit]').should('be.disabled');
  });
  it('select country and type delete symbol', () => {
    cy.get('#selectCountry').select('Israel', {
      force: true
    });
    cy.get('#inputPhoneNumber').type('1234567813').type('{leftarrow}{backspace}').clear();
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('#selectCountry').select('Russia', {
      force: true
    });
    cy.get('#inputPhoneNumber').should('have.value', '')
      .type('9787701284')
      .type('{leftarrow}{leftarrow}{leftarrow}{leftarrow}{backspace}{backspace}')
      .type('1')
      .should('have.value', '(978) 770 12 84')
  });
});
