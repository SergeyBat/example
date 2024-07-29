import React, { useState } from 'react';
import PropTypes from 'prop-types';
import bem from '../utils/bem';

// ui components
import LeftCardSide from "../ui/LeftCardSide";
import CardTitleBlock from "../ui/CardTitleBlock";
import DeleteOrderItemBlock from "../ui/DeleteOrderItemBlock";
import MiddleBottomCardBlock from "../ui/MiddleBottomCardBlock";
import MiddleBlockOptionsInfo from "../ui/MiddleBlockOptionsInfo";
import MiddleBlockMainProductInfo from "../ui/MiddleBlockMainProductInfo";
import MiddleBlockBindProductInfo from "../ui/MiddleBlockBindProductInfo";
import EditButton from "../ui/EditButton";

// styles
import styles from './index.module.scss';

const b = bem('order-checkout-example-one-card', styles);

const defaultProps = {
  item: {},
  isMobile: true,
  orderCreateCalculations: {},
  setEditStatus: () => {},
  clearPromo: () => {},
  deleteOrder: () => {},
  deleteExampleOneImage: () => {},
  allOrderImages: {},
};

const propTypes = {
  item: PropTypes.shape({
    index: PropTypes.number,
    typeProduct: PropTypes.string,
    id: PropTypes.id,
    productName: PropTypes.string,
    quantity: PropTypes.number,
    options: PropTypes.arrayOf(PropTypes.shape({})),
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
  setEditStatus: PropTypes.func,
  clearPromo: PropTypes.func,
  deleteOrder: PropTypes.func,
  deleteExampleOneImage: PropTypes.func,
  allOrderImages: PropTypes.shape({}),
};

const OrderCheckoutExampleOneCard = (props) => {
  const {
    item,
    isMobile,
    orderCreateCalculations,
    arrayKey,
    setEditStatus,
    clearPromo,
    deleteOrder,
    allOrderImages,
    deleteExampleOneImage,
  } = props;

  const {
    binds = [],
    isTrial,
    exampleOneImageId,
    id,
    images,
    typeProduct,
  } = item || {};

  // get calculate info from backend API
  const calculateInfo = (index) => {
    return orderCreateCalculations
    && orderCreateCalculations.details
    && orderCreateCalculations.details[index]
      ? orderCreateCalculations.details[index]
      : { children: [] }
  };

  // get all binds calculate info
  const allBindsCalculateInfo = () => {
    if (binds && Object.values(binds).length && orderCreateCalculations && orderCreateCalculations.details) {
      return Object.values(binds).reduce((acc, itm) => {
        let childrens = [];
        itm.forEach(bind => {
          const bindCalculate = calculateInfo(bind.index);
          childrens = [...childrens, ...bindCalculate.children];
        })
        return {
          ...acc,
          children: [...acc.children, ...childrens],
        }
      }, {
        price: 0,
        personalDiscount: 0,
        quantity: 0,
        children: [],
      })
    }
    return {
      price: 0,
      personalDiscount: 0,
      quantity: 0,
      children: [],
    }
  }

  const setOrderImagesExampleOne = (newImages) => {
    localStorage.setItem('example-one/Option', JSON.stringify(newImages));
  }

  const deleteItem = (imageId) => {
    if (isTrial) {
      clearPromo();
    }
    setEditStatus();
    if (binds && Object.keys(binds).length) {
      Object.values(binds).forEach(itmBinds => itmBinds.forEach(itemBind => deleteOrder(itemBind)));
    }
    if (exampleOneImageId || imageId) {
      const exampleOneImages = (JSON.parse(localStorage.getItem('exampleOne/Option') || '[]') || []);
      const newExampleOneImages = exampleOneImages.map(image => {
        if (image.id === exampleOneImageId || id === imageId) {
          const newChildrenProducts = image.childrenProducts.filter(children => JSON.stringify(children.images) !== JSON.stringify(images));
          return {
            ...image,
            childrenProducts: newChildrenProducts,
          }
        }
        return image;
      })
      setOrderImagesExampleOne(newExampleOneImages);
    }
    deleteOrder(item);
    if (images && images.length) {
      const photos = (JSON.parse(localStorage.getItem('example-one/Option') || '[]') || []);
      const newPhotos = photos.filter(image => images.some(imageOrder => imageOrder === image.id));
      setOrderImagesExampleOne(newPhotos);
    }
  }


  const deleteItemBinds = (deletedBinds) => {
    if (isTrial) {
      clearPromo();
    }
    setEditStatus();
    if (deletedBinds.length) {
      const exampleOneImages = (JSON.parse(localStorage.getItem('exampleOne/Option') || '[]') || []);
      const newExampleOneImages = exampleOneImages.map(image => {
        if (deletedBinds.some(bind => bind.exampleOneImageId === image.id)) {
          return {
            ...image,
            childrenProducts: [],
            images: [],
          }
        }
        return image;
      })
      setOrderImagesExampleOne(newExampleOneImages);
      deletedBinds.forEach(itemBind => deleteOrder(itemBind));
    }
  }

  const deleteItemImage = (image) => {
    const {id: imageId} = image;
    if (isTrial) {
      clearPromo();
    }
    setEditStatus();
    deleteExampleOneImage({
      typeProduct,
      itemId: id,
      imageId,
      binds: binds || [],
    })
    if (binds[imageId]) {
      deleteOrder(binds[imageId])
    }
  }

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
          title='EXMAPLE ONE PRODUCT'
          id={item.id}
        />
        <div className={b('middle')}>
          <MiddleBlockMainProductInfo product={item} productInfo={calculateInfo(item.index)} />
          <MiddleBlockOptionsInfo options={item.options} blockedOptions={['some_product']} />
          <MiddleBottomCardBlock calculateInfo={calculateInfo(item.index)} />
        </div>
        <DeleteOrderItemBlock
          className={b('delete-order-item-block')}
          deleteItem={deleteItem}
        />
        <EditButton
          className={b('btn-edit')}
          onClick={() => {}}
        />
      </div>
      {
        binds && Object.values(binds).length ? (
          <div className={b('wrap-binds')}>
            {
              Object.values(binds).map((bind, index) => (
                <MiddleBlockBindProductInfo
                  indexKey={index}
                  orderCreateCalculations={orderCreateCalculations}
                  bind={bind}
                  isMobile={isMobile}
                  allOrderImages={allOrderImages}
                  deleteItem={() => deleteItemBinds(bind)}
                />
              ))
            }
            <div className={b('binds-calculate')}>
              <MiddleBottomCardBlock calculateInfo={allBindsCalculateInfo()} />
            </div>
          </div>
        ) : null
      }
    </div>
  )
}

OrderCheckoutExampleOneCard.propTypes = propTypes;
OrderCheckoutExampleOneCard.defaultProps = defaultProps;

export default OrderCheckoutExampleOneCard;
