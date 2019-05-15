
import { SplitFactory } from '@splitsoftware/splitio';

// eslint-disable-next-line new-cap
const factory = SplitFactory({
  core: {
    authorizationKey: process.env.SPLIT_KEY
  }
});

const client = factory.client();

export const getTreatment = (identifier, experiment, params) => {
  return client.getTreatment(identifier, experiment, params);
};
