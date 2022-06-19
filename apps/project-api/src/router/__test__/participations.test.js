const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

const publisher = require('../../publisher');

it('returns a 404 if the participation is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/participations/${id}`).send().expect(404);
});

it('returns the participation if the participation is found', async () => {
  const projectId = new mongoose.Types.ObjectId().toHexString();
  const par = await request(app)
    .post(`/participations`)
    .send({ projectId, state: 'ACTIVE' })
    .expect(201);
  await request(app).get(`/participations/${par.body.id}`).send().expect(200);
});

it('returns an error if an invalid state is provided', async () => {
  const projectId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post(`/participations`)
    .send({ projectId, state: 'asd' })
    .expect(400);
});

it('returns an error if an invalid projectId is provided', async () => {
  await request(app)
    .post(`/participations`)
    .send({ projectId: 'as', state: 'ACTIVE' })
    .expect(400);
});

it('creates a paticipation with valid inputs', async () => {
  const projectId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post(`/participations`)
    .send({ projectId, state: 'ACTIVE' })
    .expect(201);
});

it('updates the participation provided valid inputs', async () => {
  const projectId = new mongoose.Types.ObjectId().toHexString();
  const par = await request(app)
    .post(`/participations`)
    .send({ projectId, state: 'ACTIVE' })
    .expect(201);

  const updatedPar = await request(app)
    .patch(`/participations/${par.body.id}`)
    .send({ state: 'INACTIVE' })
    .expect(200);
  expect(updatedPar.body.state).toEqual('INACTIVE');
});

it('returns an error if provided same state to update', async () => {
  const projectId = new mongoose.Types.ObjectId().toHexString();
  const par = await request(app)
    .post(`/participations`)
    .send({ projectId, state: 'ACTIVE' })
    .expect(201);

  await request(app)
    .patch(`/participations/${par.body.id}`)
    .send({ state: 'ACTIVE' })
    .expect(400);
});

it('publishes an event', async () => {
  const projectId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post(`/participations`)
    .send({ projectId, state: 'ACTIVE' })
    .expect(201);

  expect(publisher.publish).toHaveBeenCalled();
});
