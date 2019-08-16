import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const connected = (mapStateToProps, actions) => Component => {
  const mapDispatchToProps = (dispatch, ownProps) => {
    if (actions) {
      return {
        actions: {
          ...ownProps.actions,
          ...bindActionCreators(actions, dispatch)
        }
      };
    }
    return {};
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Component);
};

export default connected;
