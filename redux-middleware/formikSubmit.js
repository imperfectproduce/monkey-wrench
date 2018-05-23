import { SUCCEEDED_SUFFIX, FAILED_SUFFIX } from '../actionTypes';

/*
 * Automatically call the onSuccess or onFailure callback with an optional message.
 * onSuccess:
 * The action.successMessage is returned if available,
 * otherwise the default formikConfig.successMessage
 *
 * onFailure:
 * The action.failureMessage is returned if available,
 * otherwise the default formikConfig.failureMessage
 */
const middleware = () => next => action => {
  const { formikConfig, type } = action;
  if (formikConfig) {
    if (formikConfig.onSuccess && type.endsWith(SUCCEEDED_SUFFIX)) {
      formikConfig.onSuccess(action.successMessage || formikConfig.successMessage);

    } else if (formikConfig.onFailure && type.endsWith(FAILED_SUFFIX)) {
      formikConfig.onFailure(action.failureMessage || formikConfig.failureMessage);
    }
  }

  return next(action);
};

export default middleware;
