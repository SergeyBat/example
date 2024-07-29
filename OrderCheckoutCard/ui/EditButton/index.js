import React from 'react';
import PropTypes from 'prop-types';

// utils
import bem from '../../utils/bem';

// styles
import styles from './index.module.scss';

const b = bem('edit-button', styles);

const defaultProps = {
	className: '',
	onClick: () => {},
};

const propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
};

const EditButton = (props) => {
	const {
		className,
		onClick,
	} = props;

	return (
	  <button
	    className={b('', {mix: className})}
	    type="button"
	    tabIndex={-1}
	    onClick={onClick}
			>
	    EDIT
	  </button>
	)
}

EditButton.propTypes = propTypes;
EditButton.defaultProps = defaultProps;

export default EditButton;
