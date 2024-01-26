const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('express_server'); // Replace with the actual path to your app

chai.use(chaiHttp);
const expect = chai.expect;

describe('Your Test Suite', () => {
  let agent = chai.request.agent(app);

  it('should redirect GET / to /login with status code 302', () => {
    return agent
      .get('http://localhost:3000/')
      .then((res) => {
        expect(res).to.redirect;
        expect(res).to.have.status(302);
        expect(res.redirects[0]).to.equal('http://localhost:3000/login');
      });
  });

  it('should redirect GET /urls/b2xVn2 to /login with status code 302', () => {
    return agent
      .get('http://localhost:3000/urls/b2xVn2')
      .then((res) => {
        expect(res).to.redirect;
        expect(res).to.have.status(302);
        expect(res.redirects[0]).to.equal('http://localhost:3000/login');
      });
  });

  it('should respond with status code 200 after successful login and GET /urls/b2xVn2', () => {
    return agent
      .post('http://localhost:3000/login')
      .send({ email: 'user@example.com', password: 'purple-monkey-dinosaur' })
      .then((loginRes) => {
        expect(loginRes).to.have.status(200);

        return agent.get('http://localhost:3000/urls/b2xVn2');
      })
      .then((res) => {
        expect(res).to.have.status(200);
      });
  });

  it('should respond with status code 403 after successful login with wrong credentials and GET /urls/b2xVn2', () => {
    return agent
      .post('http://localhost:3000/login')
      .send({ email: 'user2@example.com', password: 'dishwasher-funk' })
      .then((loginRes) => {
        expect(loginRes).to.have.status(200);

        return agent.get('http://localhost:3000/urls/b2xVn2');
      })
      .then((res) => {
        expect(res).to.have.status(403);
      });
  });

  // Add more test cases as needed

  after(() => {
    // Perform cleanup or logout logic if necessary
    agent.close();
  });
});
