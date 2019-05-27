import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = props => {
  const { alerts } = props;
  return (
    <Fragment>
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map(alert => (
          <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
          </div>
        ))}
    </Fragment>
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

//making state be props
const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
