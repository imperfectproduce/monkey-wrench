export default (values, actions, config = {}) => {
  const {
    resetUponSuccess,
    onSuccess,
    onFailure,
    ...restConfig
  } = config;
  return {
    formikConfig: {
      ...restConfig,
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
  };
};
