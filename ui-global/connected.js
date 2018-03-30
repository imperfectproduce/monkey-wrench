import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/*
 * Simplifies the connect & bindActionCreators for react components.
 */
export default (mapStateToProps, actions) => Component => {
  const mapDispatchToProps = actions ? (
    (dispatch) => {
      return {
        actions: bindActionCreators(actions, dispatch)
      };
    }
  ) : null;

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Component);
};
