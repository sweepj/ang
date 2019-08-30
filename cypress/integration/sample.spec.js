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
    cy.get('.text-danger').should('not.visible');
  });
  it('correct number Ukraine', () => {
    cy.get('#selectCountry').select('Ukraine', {
      force: true
    });
    cy.get('#inputPhoneNumber').type('50641030');
    cy.get('button[type=submit]').should('not.be.disabled');
    cy.get('.text-danger').should('not.visible');
  });
  it('wrong number Ukraine', () => {
    cy.get('#selectCountry').select('Ukraine', {
      force: true
    });
    cy.get('#inputPhoneNumber').type('812888');
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('.text-danger').should('visible');
  })


});
