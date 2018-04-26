import setMomentTime from './setMomentTime';

/*
 * dateAsMoment is a moment object
 * day is 0-6
 * time is optional and formatted as HH:MM:SS - ex 15:30:10 for 3:30 and 10 seconds
 */
const getNextDate = (dateAsMoment, day, time) => {

  // set it to desired day of week
  const dateInCurrentWeek = dateAsMoment.clone().day(day);
  if (time) setMomentTime(dateInCurrentWeek, time);

  // is the current week's moment in the future, according to the boundary? if so, good to go, return it
  if (dateAsMoment.isBefore(dateInCurrentWeek)) return dateInCurrentWeek;

  // otherwise move it forward a week
  return dateInCurrentWeek.add(1, 'weeks');
};

export default getNextDate;
