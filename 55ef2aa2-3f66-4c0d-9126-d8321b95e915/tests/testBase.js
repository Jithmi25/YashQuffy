import session from "supertest-session";

async function authenticateTestSession(testSession) {
  var username = "johnS@gmail.com";
  var pwd = "Test@123";
  var userId = "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9";
  try {
    const response = await testSession
        .post("/api/auth/login")
        .send({ email: username, password: pwd })
        .expect(200);
    
    // Assuming the token is returned in the response body under the key 'token'
    const token = response.body.token;
    return {userId,token};
} catch (err) {
    throw err;
}
}

async function authenticateAdminTestSession(testSession) {
  var username = "mattD@gmail.com";
  var pwd = "Test@123";
  var userId = "da9347a6-2a7f-4573-be27-15f05569fb0d";
  try {
    const response = await testSession
      .post("/api/auth/login")
      .send({ email: username, password: pwd })
      .expect(200);

    // Assuming the token is returned in the response body under the key 'token'
    const token = response.body.token;
    return { userId, token };
  } catch (err) {
    throw err;
  }
}


function resetDatabase(_db) {
  return new Promise(async (resolve, reject) => {
    try {
      await _db.migrate.latest().then(async () => await _db.seed.run());
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function createSuperTestSession(app) {
  return session(app);
}

function assertErrorPage(document) {
  expect(document.title).not.toBe("Error Page");
}

export default {
  authenticateTestSession,
  authenticateAdminTestSession,
  resetDatabase,
  createSuperTestSession,
  assertErrorPage,
};
