import React from 'react';
import PropTypes from 'prop-types';
import bem from '../utils/bem';

// store
import {connect} from "react-redux";
import ordersTypeSelect from "src/redux/orders/selectors";

// ui components
import LeftCardSide from "../ui/LeftCardSide";
import CardTitleBlock from "../ui/CardTitleBlock";
import DeleteOrderItemBlock from "../ui/DeleteOrderItemBlock";
import MiddleBottomCardBlock from "../ui/MiddleBottomCardBlock";
import MiddleBlockMainProductInfo from "../ui/MiddleBlockMainProductInfo";

// styles
import styles from './index.module.scss';

const b = bem('order-checkout-example-three-card', styles);

const defaultProps = {
  item: {},
  isMobile: true,
  orderCreateCalculations: {},
  deleteOrderItem: () => {},
};

const propTypes = {
  item: PropTypes.shape({
    index: PropTypes.number,
    typeProduct: PropTypes.string,
    id: PropTypes.id,
    productName: PropTypes.string,
    quantity: PropTypes.number,
    options: PropTypes.arrayOf(PropTypes.shape({})),
    name: PropTypes.string,
  }),
  isMobile: PropTypes.bool,
  orderCreateCalculations: PropTypes.shape({
    details: PropTypes.arrayOf(PropTypes.shape({
      price: PropTypes.number,
      personalDiscount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      quantity: PropTypes.number,
      children: PropTypes.arrayOf(PropTypes.shape({
        price: PropTypes.number,
        quantity: PropTypes.number,
        personalDiscount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })),
    }))
  }),
  arrayKey: PropTypes.string.isRequired,
  deleteOrderItem: PropTypes.func,
};

const OrderCheckoutExampleThreeCard = (props) => {
  const {
    item,
    isMobile,
    orderCreateCalculations,
    arrayKey,
    deleteOrderItem,
  } = props;

  // get calculate info from backend API for main product or for options in product
  const calculateInfo = (mainIndex, optionIndex, withOption) => {
    if (withOption) {
      return orderCreateCalculations && orderCreateCalculations.details ? orderCreateCalculations.details[mainIndex].children[optionIndex] : {}
    };
    return orderCreateCalculations && orderCreateCalculations.details ? orderCreateCalculations.details[mainIndex] : {}
  };

  return (
    <div className={b('')} key={arrayKey}>
      <div className={b('wrap')}>
        <LeftCardSide
          className={b('left-card-side')}
          isMobile={isMobile}
          item={item}
        />
        <CardTitleBlock
          className={b('card-title-block')}
          typeProduct={item.typeProduct}
          title='product name'
          id={item.id}
          noEdit
        />
        <div className={b('middle')}>
          <MiddleBlockMainProductInfo product={{...item, productName: 'product_name'}} productInfo={calculateInfo(item.index)} />
          <MiddleBottomCardBlock calculateInfo={calculateInfo(item.index)} />
        </div>
        <DeleteOrderItemBlock
          className={b('delete-order-item-block')}
          deleteItem={deleteOrderItem}
        />
      </div>
    </div>
  )
}

OrderCheckoutExampleThreeCard.propTypes = propTypes;
OrderCheckoutExampleThreeCard.defaultProps = defaultProps;

const stateProps = state => ({
  order: ordersTypeSelect(state),
});

export default connect(stateProps, null)(OrderCheckoutExampleThreeCard);
