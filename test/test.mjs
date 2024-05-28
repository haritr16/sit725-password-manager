import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';

let mongoServer;

before(async function () {
  this.timeout(10000); 
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async function () {
  this.timeout(10000); 
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('API Tests', function () {
  beforeEach(async function () {
    await mongoose.connection.db.dropDatabase();
  });

  describe('POST /signup', function () {
    it('should create a new user', async function () {
      const response = await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('message', 'Account created successfully');
    });

    it('should not allow duplicate usernames', async function () {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'password123' });

      const response = await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'newpassword' });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message', 'Username already exists');
    });
  });

  describe('POST /login', function () {
    it('should login the user', async function () {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'password123' });

      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message', 'Login successful');
    });

    it('should not login with incorrect password', async function () {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'password123' });

      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message', 'Invalid credentials');
    });
  });

  describe('POST /add-record', function () {
    it('should add a new record', async function () {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'password123' });

      await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      const response = await request(app)
        .post('/add-record')
        .send({ platform: 'testPlatform', username_platform: 'user1', password: 'password123' });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message', 'Record added successfully');
    });

    it('should not add record with missing fields', async function () {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'password123' });

      await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      const response = await request(app)
        .post('/add-record')
        .send({ platform: 'testPlatform', username_platform: 'user1' }); 

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message', 'Missing fields');
    });
  });

  describe('GET /get-records/:username', function () {
    it('should retrieve records for the user', async function () {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'password123' });

      await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      await request(app)
        .post('/add-record')
        .send({ platform: 'testPlatform', username_platform: 'user1', password: 'password123' });

      const response = await request(app)
        .get('/get-records/testuser');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.equal(1);
      expect(response.body[0]).to.have.property('platform', 'testPlatform');
      expect(response.body[0]).to.have.property('username_platform', 'user1');
    });
  });

  describe('DELETE /delete-record', function () {
    it('should delete a record', async function () {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'password123' });

      await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      await request(app)
        .post('/add-record')
        .send({ platform: 'testPlatform', username_platform: 'user1', password: 'password123' });

      const response = await request(app)
        .delete('/delete-record')
        .send({ username: 'testuser', username_platform: 'user1' });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message', 'Record deleted successfully');
    });

    it('should not delete a record of another user', async function () {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'password123' });

      await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      await request(app)
        .post('/add-record')
        .send({ platform: 'testPlatform', username_platform: 'user1', password: 'password123' });

      const response = await request(app)
        .delete('/delete-record')
        .send({ username: 'anotheruser', username_platform: 'user1' });

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('message', 'You can only delete your own records.');
    });
  });
});
