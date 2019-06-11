import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map(exp => {
    return (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format='YY/MM/DD'>{exp.from}</Moment>-
          {exp.to === null ? (
            'Now'
          ) : (
            <Moment format='YY/MM/DD'>{exp.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={() => {
              console.log('Delete Pressed');
              deleteExperience(exp._id);
            }}
            className='btn btn-danger'
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th className='hide-sm'>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);
