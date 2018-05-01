import getNextDate from './getNextDate';

/*
 * dateAsMoment
 * deliveryWindow
 */
const getNextWindowDeliveryDate = (dateAsMoment, deliveryWindow) => {
  const {
    startDay,
    startTime,
    customizationEndDay,
    customizationEndTime
  } = deliveryWindow;

  const weekBoundaryMoment = getNextDate(dateAsMoment, customizationEndDay, customizationEndTime);
  return getNextDate(weekBoundaryMoment, startDay, startTime)
    .startOf('day'); // chop off time

};

export default getNextWindowDeliveryDate;
