import getNextWindowDeliveryDate from './getNextWindowDeliveryDate';
import assert from 'assert';
import moment from 'moment';

// https://deliveries-dev.imperfectfoods.co/windows
const windowData = {
  windowMondayPM: {
    startDay: 1,
    startTime: '13:00:00',
    customizationEndDay: 5,
    customizationEndTime: '21:59:00'
  },
  windowThursdayPM: {
    startDay: 4,
    startTime: '18:00:00',
    customizationEndDay: 2,
    customizationEndTime: '23:59:00',
  }
};

const dateTimes = {
  '2018-04-26 @ 3pm': {
    dateAsMoment: moment('2018-04-26').hours(15),
    windowMondayPM: moment('2018-04-30'),
    windowThursdayPM: moment('2018-05-03')
  }
}

describe('getNextWindowDeliveryDate', () => {
  const k = Object.keys(dateTimes).map(key => {
    it(key, () => {
      const expected = dateTimes[key];

      const windows = Object.keys(windowData);
      const { dateAsMoment } = expected;

      windows.map(w => {
        const nextDeliveryDate = getNextWindowDeliveryDate(dateAsMoment, windowData[w]);
        assert.strictEqual(nextDeliveryDate.format(), expected[w].format());
      })
    });
  })
});
