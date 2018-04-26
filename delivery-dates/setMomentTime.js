import moment from 'moment';
import 'moment-timezone';

/*
 * Mutates momentInstance!
 */
const setMomentTime = (momentInstance, time) => {
  const [
    hour,
    minute,
    second
  ] = time.split(':');

  return momentInstance.hour(hour)
    .minute(minute)
    .second(second);
};

export default setMomentTime;
