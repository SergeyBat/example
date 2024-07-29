import React from 'react';
import PropTypes from 'prop-types';
import bem from '../../utils/bem';
import BeforeAfterPrice from "src/elements/BeforeAfterPrice";
import styles from './index.module.scss';

const b = bem('middle-bottom-card-block', styles);

const defaultProps = {
	calculateInfo: {},
};

const propTypes = {
	calculateInfo: PropTypes.shape({
		price: PropTypes.number,
		personalDiscount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		quantity: PropTypes.number,
		children: PropTypes.arrayOf(PropTypes.shape({})),
	}),
};

const MiddleBottomCardBlock = ({ calculateInfo }) => {
	// get product price without any discount
	const totalPrice = () => {
		let optionsTotalPrice = 0;
		let productTotalPrice = 0;
		if (calculateInfo) {
			productTotalPrice += (calculateInfo.price * calculateInfo.quantity)
		}
		if (calculateInfo && calculateInfo.children) {
			calculateInfo.children.forEach(option => {
				optionsTotalPrice += (option.price * option.quantity)
			})
		}
		return productTotalPrice + optionsTotalPrice;
	}
	
	// get product discount without example-three discount, without promo discount
	const totalDiscount = () => {
		let optionsTotalDiscount = 0;
		let productTotalDiscount = 0;
		if (calculateInfo) {
			productTotalDiscount += Number(calculateInfo.personalDiscount);
		}
		if (calculateInfo && calculateInfo.children) {
			calculateInfo.children.forEach(option => {
				optionsTotalDiscount += Number(option.personalDiscount);
			})
		}
		return productTotalDiscount + optionsTotalDiscount;
	}

	// middle block bottom with underline and total prices
	return (
  <div className={b('')}>
    <div className={b('bottom-line')} />
    <div className={b('bottom-info')}>
      <div className={b('bottom-title')}>Total</div>
      <div className={b('bottom-price')}>
        <BeforeAfterPrice
          priceValuesClassName={b('price-values')}
          priceClassName={b('bottom-price')}
          priceAfterClassName={b('bottom-discount')}
          price={totalPrice()}
          additionalDiscount={totalDiscount()}
          isRow
        />
      </div>
    </div>
  </div>
	)
}

MiddleBottomCardBlock.propTypes = propTypes;
MiddleBottomCardBlock.defaultProps = defaultProps;

export default MiddleBottomCardBlock;
