//const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const kafkaWrapper = require('./kafka-wrapper');
//const Summary = require('./models/Summary');
const SummaryListener = require('./summery-listener');
// const kafka = new Kafka({
//   clientId: 'my-app',
//   brokers: ['localhost:9092'],
// });

async function run() {
  // const consumer = kafka.consumer({
  //   groupId: 'project-summary',
  // });

  // await consumer.connect();
  // await consumer.subscribe({
  //   //topic: 'db.develop.participations.change_event',
  //   topics: ['add', 'update'],
  // });
  await mongoose.connect('mongodb://localhost:27017/develop');
  kafkaWrapper.init('summary-app', ['localhost:9092'], 'summery-group');
  new SummaryListener();

  // await consumer.run({
  //   eachMessage: async ({ topic, message }) => {
  //     try {
  //       const participation = JSON.parse(message.value?.toString() ?? '{}');
  //       let acTotal = participation.state === 'ACTIVE' ? 1 : 0;
  //       let inacTotal = participation.state === 'INACTIVE' ? 1 : 0;

  //       if (topic === 'update') {
  //         if (acTotal) inacTotal = -1;
  //         else acTotal = -1;
  //       }
  //       const summary = await Summary.findByIdAndUpdate(
  //         participation.projectId,
  //         {
  //           $inc: {
  //             'participations.$[a].total': acTotal,
  //             'participations.$[b].total': inacTotal,
  //           },
  //         },
  //         {
  //           arrayFilters: [{ 'a.state': 'ACTIVE' }, { 'b.state': 'INACTIVE' }],
  //         },
  //       );

  //       if (!summary) {
  //         const newSummary = new Summary({
  //           _id: participation.projectId,
  //           participations: [
  //             { state: 'ACTIVE', total: acTotal },
  //             { state: 'INACTIVE', total: inacTotal },
  //           ],
  //         });
  //         await newSummary.save();
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  // });
}

run();
