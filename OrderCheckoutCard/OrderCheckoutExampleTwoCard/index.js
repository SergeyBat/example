import React, {useState} from 'react';
import PropTypes from 'prop-types';
import bem from '../utils/bem';

// store
import {connect} from "react-redux";
import { changeOrder } from "src/redux/orders/actions";
import ordersTypeSelect from "src/redux/orders/selectors";

// ui components
import LeftCardSide from "../ui/LeftCardSide";
import CardTitleBlock from "../ui/CardTitleBlock";
import DeleteOrderItemBlock from "../ui/DeleteOrderItemBlock";
import MiddleBottomCardBlock from "../ui/MiddleBottomCardBlock";
import MiddleBlockOptionsInfo from "../ui/MiddleBlockOptionsInfo";
import MiddleBlockMainProductInfo from "../ui/MiddleBlockMainProductInfo";
import EditButton from "../ui/EditButton";

// styles
import styles from './index.module.scss';

const b = bem('order-checkout-example-two-card', styles);

const defaultProps = {
  item: {},
  isMobile: true,
  orderCreateCalculations: {},
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
};

const OrderCheckoutExampleTwoCard = (props) => {
  const {
    item,
    isMobile,
    orderCreateCalculations,
    arrayKey,
    deleteOrderItem,
  } = props;

  const [isShowPopUp, togglePopUp] = useState(false);

  // get calculate info from backend API for main product or for options in product
  const calculateInfo = (mainIndex, optionIndex, withOption, option) => {
    if (withOption && option) {
      return orderCreateCalculations
      && orderCreateCalculations?.details
      && orderCreateCalculations.details[mainIndex]
      && orderCreateCalculations.details[mainIndex].children
      && orderCreateCalculations.details[mainIndex].children[optionIndex]
        ? orderCreateCalculations.details[mainIndex].children.find(({ productId }) => productId === option.optionId)
        : {}
    };
    return orderCreateCalculations
    && orderCreateCalculations.details
    && orderCreateCalculations.details[mainIndex]
      ? orderCreateCalculations.details[mainIndex]
      : {}
  };

  // separate product options to main options and other options, filter options with 0 quantity and example-one for do not show them
  const getMainOptionsAndOptions = () => {
    if (item && item.options) {
      return item.options.filter(option => option.name !== 'example-one' && option.quantity !== 0).reduce((acc, itm, index) => {
        const optionCalculate = calculateInfo(item.index, index, true, itm);
        if (itm.isMainOption && optionCalculate) {
            return {
              ...acc,
              mainProducts: [...acc.mainProducts, {
                ...itm,
                productName: itm.displayName,
                index,
                ...optionCalculate,
                additionalDiscount: optionCalculate.personalDiscount / itm.quantity,
              }],
            }
        }
        if (optionCalculate) {
          return {
            ...acc,
            options: [...acc.options, {
              ...itm,
              productName: itm.displayName,
              index,
              ...optionCalculate,
              additionalDiscount: optionCalculate.personalDiscount / itm.quantity,
            }],
          };
        }
        return acc;
      }, {
        mainProducts: [],
        options: [],
      })
    }
    return {
      mainProducts: [],
      options: [],
    };
  }
  const {
    mainProducts,
    options,
  } = getMainOptionsAndOptions();

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
          title={item.productName}
          id={item.id}
          onEdit={() => {
            togglePopUp(true);
          }}
        />
        <div className={b('middle')}>
          {
            mainProducts.map(mainOption => (
              <div className={b('main-option')}>
                <MiddleBlockMainProductInfo product={mainOption} productInfo={calculateInfo(item.index, mainOption.index, true, mainOption)} />
              </div>
            ))
          }
          <MiddleBlockOptionsInfo options={options} blockedOptions={['some_product']} />
          <MiddleBottomCardBlock calculateInfo={calculateInfo(item.index)} />
        </div>
        <DeleteOrderItemBlock
          className={b('delete-order-item-block')}
          deleteItem={deleteOrderItem}
        />
        <EditButton
          className={b('btn-edit')}
          onClick={() => {
            togglePopUp(true);
          }}
        />
      </div>
    </div>
  )
}

OrderCheckoutExampleTwoCard.propTypes = propTypes;
OrderCheckoutExampleTwoCard.defaultProps = defaultProps;

const stateProps = state => ({
  order: ordersTypeSelect(state),
});

const actions = {
  changeOrdersCount: changeOrder,
};
export default connect(stateProps, actions)(OrderCheckoutExampleTwoCard);
