const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

// Assuming your app is running on http://localhost:3000
const appUrl = 'http://localhost:3000';

describe('Example Test Suite', () => {
  // Assuming you have a session cookie to store user id
  let agent = chai.request.agent(appUrl);

  // Login before running the tests
  before(async () => {
    // Replace this with your login route and credentials
    await agent.post('/login').send({ username: 'yourUsername', password: 'yourPassword' });
  });

  // Logout after running the tests
  after(async () => {
    await agent.get('/logout');
  });

  it('should redirect / to /login with status code 302', async () => {
    const res = await agent.get('/');
    expect(res).to.redirectTo(`${appUrl}/login`);
    expect(res).to.have.status(200);
  });

  it('should redirect /urls/new to /login with status code 302', async () => {
    const res = await agent.get('/urls/new');
    expect(res).to.redirectTo(`${appUrl}/login`);
    expect(res).to.have.status(200);
  });

  it('should return status code 404 for non-existent URL', async () => {
    const res = await agent.get('/urls/NOTEXISTS');
    expect(res).to.have.status(404);
  });

  it('should return status code 403 for /urls/b2xVn2', async () => {
    const res = await agent.get('/urls/b2xVn2');
    expect(res).to.have.status(403);
  });
});
