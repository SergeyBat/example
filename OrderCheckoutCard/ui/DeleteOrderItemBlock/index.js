import React from 'react';
import PropTypes from 'prop-types';

// utils
import bem from '../../utils/bem';

// styles
import styles from './index.module.scss';

const b = bem('delete-order-item-block', styles);

const defaultProps = {
	className: '',
	deleteItem: () => {},
};

const propTypes = {
	className: PropTypes.string,
	deleteItem: PropTypes.func,
};

const DeleteOrderItemBlock = (props) => {
	const {
		className,
		deleteItem,
	} = props;

	// right block side with close btn
	return (
	  <button
	      className={b('', {mix: className})}
	      type="button"
		    onClick={deleteItem}
			/>
		)
}

DeleteOrderItemBlock.propTypes = propTypes;
DeleteOrderItemBlock.defaultProps = defaultProps;

export default DeleteOrderItemBlock;
