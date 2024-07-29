import React from 'react';
import PropTypes from 'prop-types';

// utils
import bem from '../../utils/bem';

//components
import EditButton from "../EditButton";

// styles
import styles from './index.module.scss';

const b = bem('top-bar', styles);

const defaultProps = {
	className: '',
	title: '',
	onEdit: () => {},
	noEdit: false,
};

const propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	onEdit: PropTypes.func,
	noEdit: PropTypes.bool,
};

const CardTitleBlock = (props) => {
	const {
		className,
		title,
		onEdit,
		noEdit,
	} = props;

	// middle block top bar with product types and edit button
	return (
  <div className={b('', { mix: className })}>
    <div className={b('title')}>{title}</div>
    {
			!noEdit && (
		    <EditButton
			    className={b('btn-edit')}
			    onClick={onEdit}
		    />
	    )
	  }
  </div>
	)
}

CardTitleBlock.propTypes = propTypes;
CardTitleBlock.defaultProps = defaultProps;

export default CardTitleBlock;
