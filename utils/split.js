const { SplitFactory } = require('@splitsoftware/splitio');

// eslint-disable-next-line new-cap
const factory = SplitFactory({
  core: {
    authorizationKey: process.env.SPLIT_KEY
  }
});

const client = factory.client();

const getTreatment = (experiment, identifier, params) => {
  return client.getTreatment(identifier, experiment, params);
};

module.exports = {
  getTreatment
};
