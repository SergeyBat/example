import React from 'react';
import PropTypes from 'prop-types';
import bem from '../../utils/bem';
import convertToPrice from "src/utils/convertToPrice";

import styles from './index.module.scss';

const b = bem('middle-block-options-info', styles);

const defaultProps = {
	options: [],
	blockedOptions: [],
};

const propTypes = {
	options: PropTypes.arrayOf(PropTypes.shape({})),
	blockedOptions: PropTypes.arrayOf(PropTypes.string),
};

const MiddleBlockOptionsInfo = (props) => {
	const {
		options,
		blockedOptions,
	} = props;
	
	// filter options by product name
	const filteredOptionList = options.filter(({ name, quantity }) => !blockedOptions.includes(name) && quantity)
	
	// middle block product options main info (displayName, quantity, price, discount)
	return (
  <div className={b('')}>
    {
	    filteredOptionList.map(option => (
		    <div className={b('option-wrap')} key={option.id}>
			    <div className={b('option-name')}>
				    {`${option.displayName}${option.quantity > 1 ? ` x ${option.quantity}` : ''}`}
			    </div>
			    <div className={b('option-price')}>
				    {convertToPrice((option.price - option.additionalDiscount) * option.quantity)}
			    </div>
		    </div>
	    ))
    }
  </div>
	)
}

MiddleBlockOptionsInfo.propTypes = propTypes;
MiddleBlockOptionsInfo.defaultProps = defaultProps;

export default MiddleBlockOptionsInfo;
