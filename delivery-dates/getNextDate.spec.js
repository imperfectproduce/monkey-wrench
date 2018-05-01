import getNextDate from './getNextDate';
import assert from 'assert';
import moment from 'moment';

const windowData = {
  windowMondayPM: {
    day: 1,
    time: '13:00:00'
  },
  windowThursdayPM: {
    day: 4,
    time: '18:00:00'
  },
  windowSaturdayAM: {
    day: 6,
    time: '07:00:00'
  }
};

const dateTimes = {
  '2018-04-26 @ 3pm': {
    dateAsMoment: moment('2018-04-26').hours(15),
    windowMondayPM: moment('2018-04-30').hours(13),
    windowThursdayPM: moment('2018-04-26').hours(18),
    windowSaturdayAM: moment('2018-04-28').hours(7)
  },
  '2018-04-26 @ 6:45pm': {
    dateAsMoment: moment('2018-04-26').hours(18).minutes(45),
    windowMondayPM: moment('2018-04-30').hours(13),
    windowThursdayPM: moment('2018-05-03').hours(18),
    windowSaturdayAM: moment('2018-04-28').hours(7)
  }
}

describe('getNextDate', () => {
  const k = Object.keys(dateTimes).map(key => {
    it(key, () => {
      const expected = dateTimes[key];

      const windows = Object.keys(windowData);
      const { dateAsMoment } = expected;

      windows.map(w => {
        const { day, time } = windowData[w];
        const nextDate = getNextDate(dateAsMoment, day, time);
        assert.strictEqual(nextDate.format(), expected[w].format());
      })
    });
  })
});
