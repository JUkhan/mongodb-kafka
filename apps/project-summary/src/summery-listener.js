const Listener = require('./listener');
const Summary = require('./models/Summary');

class SummaryListener extends Listener {
  topics = ['add', 'update'];

  /* eslint-disable */
  constructor() {
    super();
  }

  /**
   *
   * @param {*} obj
   */
  async eachMessageHandler({ topic, message }) {
    console.log(topic);
    try {
      const participation = JSON.parse(message.value?.toString() ?? '{}');
      let acTotal = participation.state === 'ACTIVE' ? 1 : 0;
      let inacTotal = participation.state === 'INACTIVE' ? 1 : 0;

      if (topic === 'update') {
        if (acTotal) inacTotal = -1;
        else acTotal = -1;
      }
      const summary = await Summary.findByIdAndUpdate(
        participation.projectId,
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

      if (!summary) {
        await Summary.create({
          _id: participation.projectId,
          participations: [
            { state: 'ACTIVE', total: acTotal },
            { state: 'INACTIVE', total: inacTotal },
          ],
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = SummaryListener;
