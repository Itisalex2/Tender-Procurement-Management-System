jest.setTimeout(30000); // Increase timeout to 30 seconds

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Tender = require('../models/tender-model');


let mongoServer;

// Setup the in-memory MongoDB server
beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect(); // Disconnect from existing connections
  }

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Teardown the in-memory MongoDB server
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Unit test for creating a tender
describe('POST /api/tender/create', () => {
  it('should create a new tender successfully', async () => {
    // Mock authentication middleware (if required)
    const mockUser = {
      _id: 'user_id',
      token: 'mock_token',
      role: 'admin', // Ensure this user has the role to create a tender
    };

    const newTender = {
      title: 'Test Tender',
      description: 'Description of test tender',
      issueDate: new Date(),
      closingDate: new Date(),
      contactInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      },
      otherRequirements: 'Other requirements',
      targetedUsers: ['user1', 'user2'],
    };

    // Perform POST request to create a tender
    const response = await request(app)
      .post('/api/tender/create')
      .set('Authorization', `Bearer ${mockUser.token}`) // Simulate logged-in user
      .field('title', newTender.title)
      .field('description', newTender.description)
      .field('issueDate', newTender.issueDate.toISOString())
      .field('closingDate', newTender.closingDate.toISOString())
      .field('contactInfo', JSON.stringify(newTender.contactInfo))
      .field('otherRequirements', newTender.otherRequirements)
      .field('targetedUsers', JSON.stringify(newTender.targetedUsers));

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body.tender).toHaveProperty('_id');
    expect(response.body.tender.title).toBe(newTender.title);

    // Check if tender is actually saved in the DB
    const savedTender = await Tender.findOne({ title: newTender.title });
    expect(savedTender).toBeTruthy();
    expect(savedTender.title).toBe(newTender.title);
  });
});
