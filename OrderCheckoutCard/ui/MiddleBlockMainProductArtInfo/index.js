import React from 'react';
import PropTypes from 'prop-types';
import bem from '../../utils/bem';
import styles from './index.module.scss';

const b = bem('middle-block-main-product-art-info', styles);

const defaultProps = {
	product: {},
};

const propTypes = {
	product: PropTypes.shape({
		color: PropTypes.string,
		customText: PropTypes.string,
		size: PropTypes.string,
		display: PropTypes.shape({
			name: PropTypes.string,
		}),
	}),
};

const MiddleBlockMainProductArtInfo = (props) => {
	const {
		product,
	} = props;
	
	const {
		color = '',
		customText = '',
		size = '',
		display = { name: '' },
	} = product || {}
	
	// middle block main product art info (size, color, personalize, display option)
	return (
  <div className={b('')}>
    <div className={b('size')}>{`Size: ${size}`}</div>
    {color && color.toLowerCase() !== 'n/a' ? (
      <div className={b('color')}>{`Color: ${color}`}</div>
    ) : null}
    <div className={b('personalize')}>{`Personalize: ${customText ? 'Yes' : 'No'}`}</div>
    <div className={b('display')}>{`Display option: ${display.name || ''}`}</div>
  </div>
	)
}

MiddleBlockMainProductArtInfo.propTypes = propTypes;
MiddleBlockMainProductArtInfo.defaultProps = defaultProps;

export default MiddleBlockMainProductArtInfo;
