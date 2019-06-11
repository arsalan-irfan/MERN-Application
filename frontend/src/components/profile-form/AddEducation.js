import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { addEducation } from '../../actions/profile';

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const {
    school,
    from,
    to,
    degree,
    fieldofstudy,
    current,
    description
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-code-branch' /> Add any school or bootcamp you have
        attended that you have had in the past
      </p>
      <small>* = required field</small>
      <form
        className='form'
        onSubmit={e => {
          e.preventDefault();
          addEducation(formData, history);
        }}
      >
        <div className='form-group'>
          <input
            type='text'
            placeholder='* School or Bootcamp'
            name='school'
            required
            value={school}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Degree or Certificate'
            name='degree'
            required
            value={degree}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Field Of Study'
            name='fieldofstudy'
            value={fieldofstudy}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input
            type='date'
            name='from'
            value={from}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              name='current'
              value={current}
              onChange={e => {
                setFormData({ ...formData, current: !current });
              }}
            />{' '}
            Current School
          </p>
        </div>
        <div className='form-group'>
          <h4>To Date</h4>
          <input
            type='date'
            name='to'
            value={to}
            onChange={e => onChange(e)}
            disabled={current}
            required={!current}
          />
        </div>
        <div className='form-group'>
          <textarea
            name='description'
            cols='30'
            rows='5'
            placeholder='Education Description'
            value={description}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {};

export default connect(
  null,
  { addEducation }
)(withRouter(AddEducation));
