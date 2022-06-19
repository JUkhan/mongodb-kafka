const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');

const Summary = require('./models/Summary');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

async function run() {
  const consumer = kafka.consumer({
    groupId: 'project-summary',
  });
  await consumer.connect();
  await consumer.subscribe({
    topics: ['add', 'update'],
  });

  await mongoose.connect('mongodb://localhost:27017/develop');
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const participation = JSON.parse(message.value?.toString() ?? '{}');
        let acTotal = participation.state === 'ACTIVE' ? 1 : 0;
        let inacTotal = participation.state === 'INACTIVE' ? 1 : 0;

        const summary = await Summary.findOne({
          projectId: participation.projectId,
        });
        if (!summary) {
          const newSummary = new Summary({
            projectId: participation.projectId,
            participations: [
              { state: 'ACTIVE', total: acTotal },
              { state: 'INACTIVE', total: inacTotal },
            ],
          });
          await newSummary.save();
          return;
        }
        if (topic === 'update') {
          if (acTotal) inacTotal = -1;
          else acTotal = -1;
        }
        await Summary.updateOne(
          { projectId: participation.projectId },
          {
            $inc: {
              'participations.$[a].total': acTotal,
              'participations.$[b].total': inacTotal,
            },
          },
          {
            arrayFilters: [{ 'a.state': 'ACTIVE' }, { 'b.state': 'INACTIVE' }],
          },
        );
      } catch (err) {
        console.log(err);
      }
    },
  });
}

run();
