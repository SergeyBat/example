import React from 'react';
import PropTypes from 'prop-types';

// utils
import bem from '../../utils/bem';
import convertToPrice from "src/utils/convertToPrice";

// components
import BeforeAfterPrice from "src/elements/BeforeAfterPrice";

// styles
import styles from './index.module.scss';

const b = bem('middle-block-main-product-info', styles);

const defaultProps = {
	product: {},
	productInfo: {},
};

const propTypes = {
	product: PropTypes.shape({
		productName: PropTypes.string,
		quantity: PropTypes.number,
	}),
	productInfo: PropTypes.shape({
		price: PropTypes.number,
		personalDiscount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	}),
};

const MiddleBlockMainProductInfo = (props) => {
	const {
		product,
		productInfo,
	} = props;
	
	// middle block main product info (displayName, quantity, price, discount)
	return (
  <div className={b('')}>
    <div className={b('product-name')}>{`${product.productName}${product.quantity > 1 ? ` x ${product.quantity}` : ''}`}</div>
    <div className={b('product-prices')}>
      <div className={b('product-left-price')}>
        <BeforeAfterPrice
          priceValuesClassName={b('price-values')}
          priceClassName={b('price')}
          priceAfterClassName={b('discount')}
          price={productInfo.price}
          additionalDiscount={productInfo.personalDiscount / product.quantity}
          isRow
        />
      </div>
      <div className={b('product-right-price')}>{convertToPrice((productInfo.price * product.quantity) - productInfo.personalDiscount)}</div>
    </div>
  </div>
	)
}

MiddleBlockMainProductInfo.propTypes = propTypes;
MiddleBlockMainProductInfo.defaultProps = defaultProps;

export default MiddleBlockMainProductInfo;
