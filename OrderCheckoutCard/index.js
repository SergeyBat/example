import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// utils
import useMobileStyle from './utils/useMobileStyle';
import bem from './utils/bem';

// actions
import {
  deleteExampleOneImageAction,
  deleteFromCart,
  orderChangefromCart,
} from 'src/redux/orders/actions';
import {getAllPricesAction} from "src/redux/prices/actions";
import {clearCoupon} from "src/redux/coupon/actions";

// selectors
import ordersTypeSelect from "src/redux/orders/selectors";
import {orderAllImagesSelector} from "src/redux/orderImages/selectors";
import {someProductProductListSelector} from "src/redux/shared/selectors";
import {isMobileDeviceSelector} from "src/redux/auth/selectors";
import {
  calculateOrderInfoSelector,
  calculateSpinnerFlagSelector
} from "src/redux/orderCreate/selectors";
import {productStatus} from "src/redux/productStatus/selectors";

//components
import OrderCheckoutExampleTwoCard from "./OrderCheckoutExampleTwoCard";
import OrderCheckoutExampleOneCard from "./OrderCheckoutExampleOneCard";
import OrderCheckoutExampleThreeCard from "./OrderCheckoutExampleThreeCard";

// constants
import spinner from "public/images/spinner.gif";
import {
  EXAMPLE_ONE_PRODUCTS,
  EXAMPLE_TWO_PRODUCTS,
  MAX_QT,
} from "./constants";

// styles
import styles from './index.module.scss';

const b = bem('checkout-card', styles);

const defaultProps = {
  data: [],
  isMobileDevice: true,
  orderCreateCalculations: {},
  productStatusDays: 0,
  getOrderPaymentInfo: () => {},
  getOrderCalculate: () => {},
  orderChange: () => {},
  getAllPrices: () => {},
  order: {},
  clearPromo: () => {},
  deleteOrder: () => {},
  deleteExampleOneImage: () => {},
  allOrderImages: {},
	calculateSpinnerFlag: false,
};

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  isMobileDevice: PropTypes.bool,
  orderCreateCalculations: PropTypes.shape({
    details: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  productStatusDays: PropTypes.number,
  getOrderPaymentInfo: PropTypes.func,
  getOrderCalculate: PropTypes.func,
  orderChange: PropTypes.func,
  getAllPrices: PropTypes.func,
  order: PropTypes.shape({}),
  clearPromo: PropTypes.func,
  deleteOrder: PropTypes.func,
  deleteExampleOneImage: PropTypes.func,
  allOrderImages: PropTypes.shape({}),
	calculateSpinnerFlag: PropTypes.bool,
};

const OrderCheckoutCard = (props) => {
  const {
    data = [],
    isMobileDevice = true,
    orderCreateCalculations = {},
    productStatusDays,
    getOrderPaymentInfo,
    orderChange,
    getAllPrices,
    order,
    clearPromo,
    deleteOrder,
    allOrderImages,
	  calculateSpinnerFlag,
    deleteExampleOneImage,
    getOrderCalculate,
  } = props;
  const { details } = orderCreateCalculations;


  useEffect(() => {
    getAllPrices();
    getOrderCalculate();
  }, []);

  // hook for understand is it mobile width;
  const isMobile = useMobileStyle(1024, isMobileDevice);

  // convert all order items and take price, discounts, promo, tax from backend API calculations
  const newData = data.map((product, productIndex) => {
    const productDetails = details ? details.find((detail, index) => detail.productId === product.productId && index === productIndex) : null;
    if (productDetails) {
      // lots of code
    }
    return {
      ...product,
      index: productIndex,
    };
  });

  // convert order items for binds, where binds is art products for example-one items, founded and combined by images
  const dataPackage = newData.map((item, index) => {
    const someProductExampleOneSumm = newData.reduce((acc, orderItem, indexItem) => {
      const {imagesExampleOneChildrens} = orderItem;
      if (imagesExampleOneChildrens && imagesExampleOneChildrens.length) {
        return acc;
      }
      if (item.images && item.images.some(image => image === orderItem.exampleOneImageId || index === indexItem)) {
        return acc + Number(orderItem.summ) - Number(orderItem.discount);
      }
      return acc;
    }, 0);

    const someProductExampleOne = newData.reduce((acc, orderItem, idx) => {
      //some code was here
      // default return;
      return acc;
    }, {});

    if (someProductExampleOne && Object.keys(someProductExampleOne).length) {
      return {
        ...item,
        index,
        binds: someProductExampleOne,
      }
    }
    return item;
  });

  // filter order items to show only items without binds
  const orderItemsList = dataPackage.filter((item => !item.exampleOneImageId));

  // validation for input max and min count available
  const validateInputCount = (value, inc, key) => {
    if ((value >= MAX_QT && inc > 0)
      || (value <= 1 && inc < 1 && key === 'quantity')
      || (value < 1 && inc <= 0)) {
      return 0;
    }
    return inc ? 1 : -1;
  }

  // set in local storage order status to edit
  const setEditStatus = () => {
    localStorage.setItem('editOrder', JSON.stringify(true));
  }

  // get card for each order item
  const getCard = (item) => {
    if (EXAMPLE_ONE_PRODUCTS.includes(item.typeProduct)) {
      return (
        <OrderCheckoutExampleOneCard
          item={item}
          arrayKey={`${item.typeProduct}${item.id}`}
          isMobile={isMobile}
          orderCreateCalculations={orderCreateCalculations}
          newData={newData}
          getOrderPaymentInfo={getOrderPaymentInfo}
          setEditStatus={setEditStatus}
          clearPromo={clearPromo}
          deleteOrder={deleteOrder}
          allOrderImages={allOrderImages}
          deleteExampleOneImage={deleteExampleOneImage}
        />
      )
    }

    if (EXAMPLE_TWO_PRODUCTS.includes(item.typeProduct)) {
      return (
        <OrderCheckoutExampleTwoCard
          item={item}
          arrayKey={`${item.typeProduct}${item.id}`}
          isMobile={isMobile}
          orderCreateCalculations={orderCreateCalculations}
          getOrderPaymentInfo={getOrderPaymentInfo}
          setEditStatus={setEditStatus}
          deleteOrderItem={() => deleteOrder(item)}
        />
      )
    }

		if (item.typeProduct === 'example-three') {
      return (
        <OrderCheckoutExampleThreeCard
          item={item}
          arrayKey={`${item.typeProduct}${item.id}`}
          isMobile={isMobile}
          orderCreateCalculations={orderCreateCalculations}
          deleteOrderItem={() => deleteOrder(item)}
        />
      )
		}
    return null;
  }

  return (
    <article className={b('')}>
      {calculateSpinnerFlag ? (
        <div className={b('spinner-block')}>
          <img
            className={b('spinner')}
            src={spinner.src}
            alt="spinner"
          />
        </div>
		    ) : (<>{orderItemsList.map((item) => (getCard(item)))}</>
      )}
    </article>
  )
}

OrderCheckoutCard.propTypes = propTypes;
OrderCheckoutCard.defaultProps = defaultProps;

const stateProps = state => ({
  order: ordersTypeSelect(state),
  allOrderImages: orderAllImagesSelector(state),
  someProductProducts: someProductProductListSelector(state),
  orderCreateCalculations: calculateOrderInfoSelector(state),
  productStatusDays: productStatus(state),
  isMobileDevice: isMobileDeviceSelector(state),
	calculateSpinnerFlag: calculateSpinnerFlagSelector(state),
});

const actions = {
  deleteOrder: deleteFromCart,
  orderChange: orderChangefromCart,
  clearPromo: clearCoupon,
  getAllPrices: getAllPricesAction,
  deleteExampleOneImage: deleteExampleOneImageAction,
};

export default connect(stateProps, actions)(OrderCheckoutCard);
