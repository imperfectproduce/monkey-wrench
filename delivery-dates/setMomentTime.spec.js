import setMomentTime from './setMomentTime';
import assert from 'assert';
import moment from 'moment';

const dateTimes = {
  '2017-01-01 @ 3pm': {
    time: '15:00:00',
    hours: 15,
    minutes: 0,
    seconds: 0,
    date: '2017-01-01'
  },
  '2018-11-11 @ 12:15:22am': {
    time: '00:15:22',
    hours: 0,
    minutes: 15,
    seconds: 22,
    date: '2018-11-11'
  }
}

describe('setMomentTime', () => {
  const k = Object.keys(dateTimes).map(key => {
      it(key, () => {
        const { date, hours, minutes, seconds, time } = dateTimes[key];

        const m = setMomentTime(moment(date), time);

        assert.strictEqual(m.hours(), hours, 'hours');
        assert.strictEqual(m.minutes(), minutes, 'minutes');
        assert.strictEqual(m.seconds(), seconds, 'seconds');
      });
  })
});
