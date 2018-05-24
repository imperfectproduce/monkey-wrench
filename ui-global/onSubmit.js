export default (values, actions, config = {}) => {
  const {
    resetUponSuccess,
    onSuccess,
    onFailure
  } = config;
  return {
    formikConfig: Object.assign(
      config,
      {
        onSuccess: (successMessage) => {
          actions.setSubmitting(false);
          if (resetUponSuccess) actions.resetForm(values);
          actions.setStatus({ successMessage });
          if (onSuccess) onSuccess();
        },
        onFailure: (failureMessage) => {
          actions.setSubmitting(false);
          actions.setStatus({ failureMessage });
          if (onFailure) onFailure();
        }
      }
    )
  };
};
