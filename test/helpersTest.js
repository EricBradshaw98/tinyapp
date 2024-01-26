const chai = require('chai');
const chaiHttp = require('chai-http');

// Assume your app is started on port 8080
const appUrl = 'http://localhost:8080';

chai.use(chaiHttp);

const expect = chai.expect;
const agent = chai.request.agent(appUrl);

describe('Test Suite', () => {
  it('should redirect / to /login with status code 302', () => {
    return agent
      .get('/')
      .then((res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(`${appUrl}/login`);
        expect(res).to.have.status(200);
      });
  });

  it('should redirect /urls/new to /login with status code 302', () => {
    return agent
      .get('/urls/new')
      .then((res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(`${appUrl}/login`);
        expect(res).to.have.status(302);
      });
  });

  it('should return 404 for /urls/NOTEXISTS', () => {
    return agent
      .get('/urls/NOTEXISTS')
      .then((res) => {
        expect(res).to.have.status(404);
      });
  });

  it('should return 403 for /urls/b2xVn2', () => {
    return agent
      .get('/urls/b2xVn2')
      .then((res) => {
        expect(res).to.have.status(403);
      });
  });
});
