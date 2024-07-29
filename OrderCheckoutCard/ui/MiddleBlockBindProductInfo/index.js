import React from 'react';
import PropTypes from 'prop-types';

// components
import LeftCardSide from "../LeftCardSide";
import CardTitleBlock from "../CardTitleBlock";
import DeleteOrderItemBlock from "../DeleteOrderItemBlock";
import MiddleBlockMainProductInfo from "../MiddleBlockMainProductInfo";
import MiddleBlockMainProductArtInfo from "../MiddleBlockMainProductArtInfo";
import EditButton from "../EditButton";

// utils
import bem from '../../utils/bem';

// styles
import styles from './index.module.scss';

const b = bem('middle-block-bind-product-info', styles);

const defaultProps = {
	bind: [],
	isMobile: true,
	onEdit: () => {},
	deleteItem: () => {},
	orderCreateCalculations: {},
	indexKey: 0,
	allOrderImages: {},
};

const propTypes = {
	bind: PropTypes.arrayOf(PropTypes.shape({
		imageId: PropTypes.number,
	})),
	isMobile: PropTypes.bool,
	onEdit: PropTypes.func,
	deleteItem: PropTypes.func,
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
	indexKey: PropTypes.number,
	allOrderImages: PropTypes.shape({}),
};

const MiddleBlockBindProductInfo = (props) => {
	const {
		bind,
		isMobile,
		onEdit,
		orderCreateCalculations,
		indexKey,
		allOrderImages,
		deleteItem,
	} = props;

	// convert binds product data for main product info component
	const bindProducts = bind.map(item => ({
		productName: item.title,
		quantity: item.options[0].quantity,
		index: item.index,
		color: item.color,
		customText: item.customText,
		size: item.size,
		display: item.display,
	}))

	// get calculate info for each bind product
	const bindCalculateInfo = (index) => {
		const calculate = orderCreateCalculations && orderCreateCalculations.details ? orderCreateCalculations.details[index] : {};
		return calculate && calculate.children ? calculate.children[0] : {};
	};

	// get image from all image what connected with binded art
	const getImageById = () => {
		const id = bind[0].imageId;
		const allImages = Object.values(allOrderImages)
			.reduce((acc, arr) => [...acc, ...(arr && arr.length ? arr : [])]);
		const image = allImages.find(({id: imageId}) => imageId === Number(id)) || {};
		onEdit(image);
	}

	// middle block main product info (displayName, quantity, price, discount)
	return (
  <div className={b('')} key={indexKey}>
    <div className={b('image-wrap')}>
      <LeftCardSide isMobile={isMobile} item={bind[0]} />
      <div className={b('photo-number')}>{`Photo ${indexKey + 1}`}</div>
    </div>
    <CardTitleBlock
      className={b('card-title-block')}
      typeProduct={bind.typeProduct}
      title='PRODUCT NAME'
      id={bind.id}
      onEdit={getImageById}
    />
    <div className={b('middle')}>
      {bindProducts.map(item => (
        <div className={b('bind-wrap')}>
          <MiddleBlockMainProductInfo productInfo={bindCalculateInfo(item.index)} product={item} />
          <MiddleBlockMainProductArtInfo product={item} />
        </div>
				))}
    </div>
    <DeleteOrderItemBlock
      className={b('delete-order-item-block')}
      deleteItem={deleteItem}
    />
    <EditButton
      className={b('btn-edit')}
      onClick={getImageById}
    />
  </div>
	)
}

MiddleBlockBindProductInfo.propTypes = propTypes;
MiddleBlockBindProductInfo.defaultProps = defaultProps;

export default MiddleBlockBindProductInfo;
