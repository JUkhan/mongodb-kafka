const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

it('returns a 404 if the project is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/projects/${id}`).send().expect(404);
});

it('return the project if the project is found', async () => {
  const project = await request(app)
    .post(`/projects`)
    .send({ name: 'pro1' })
    .expect(201);
  await request(app).get(`/projects/${project.body.id}`).send().expect(200);
});

it('returns an error if an invalid name is provided', async () => {
  await request(app).post('/projects').send({ name: '' }).expect(400);
});

it('creates a project with valid inputs', async () => {
  await request(app).post(`/projects`).send({ name: 'pro1' }).expect(201);
});
