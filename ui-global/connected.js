import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/*
 * Simplifies the connect & bindActionCreators for react components.
 */
export default (mapStateToProps, actions) => Component => {
  const mapDispatchToProps = (dispatch, ownProps) => {
    if (actions) {
      return {
        ...ownProps,
        actions: {
          ...ownProps.actions,
          ...bindActionCreators(actions, dispatch)
        }
      };
    }
    return ownProps;
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Component);
};
