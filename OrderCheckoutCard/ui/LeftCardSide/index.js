import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { connect } from 'react-redux';

// utils
import bem from '../../utils/bem';
import generateRotateStyle from 'src/utils/generateRotateStyle';

// selectors
import { exmapleProductProductListSelector } from 'src/redux/shared/selectors';
import { orderAllImagesSelector } from 'src/redux/orderImages/selectors';
import { cartCollagesSelector } from 'src/redux/exmapleProduct/selectors';

// images
import productImg from 'public/images/example.jpg';
import productImageMob from 'public/images/exampleMob.jpg';

// styles
import styles from './index.module.scss';

const b = bem('left-side-card', styles);

const defaultProps = {
  className: '',
  isMobile: true,
  exmapleProductProducts: [],
  allOrderImages: {},
  item: {},
  cartCollages: [],
};

const propTypes = {
  className: PropTypes.string,
  isMobile: PropTypes.bool,
  allOrderImages: PropTypes.shape({}),
  item: PropTypes.shape({
    typeProduct: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      quantity: PropTypes.number,
    })),
    images: PropTypes.arrayOf(PropTypes.shape({})),
    productId: PropTypes.number,
  }),
};

// get placeholder product image for desktop and mobile
const LeftCardSide = (props) => {
  const {
    className,
    isMobile,
    allOrderImages,
    item,
  } = props;

  const getDefaultImage = (typeProduct) => {
    switch (typeProduct) {
      case 'product':
        return { imageUri: isMobile ? productImg : productImageMob };
      case 'another-product':
        return { imageUri: isMobile ? productImg : productImageMob };
      case 'another-example-product':
        return { imageUri: isMobile ? productImg : productImageMob };
      default:
        return { imageUri: '' };
    }
  };

  const selectProductImage = () => {
    const { images, typeProduct } = item || {};
    const defaultImageObject = { imageUri: getDefaultImage(typeProduct).imageUri.src };
    return images
      ? allImages.find(({ id }) => id === images[0]) || defaultImageObject
      : defaultImageObject;
  };

  const getSpecialTypePhoto = () => {
    const {
      productId,
      options = [],
      display,
      productData,
      images = [],
    } = item || {};

    const allImages = Object.values(allOrderImages)
      .reduce((acc, arr) => [...acc, ...(arr && arr.length ? arr : [])], [])
      .filter(({ isCropped, groupId }) => isCropped && !groupId || groupId);

    const { optionId } = options[0] || {};
    const selectedProduct = products.find(({ id }) => id === productId || (productData && productData.id === id));

    const {
      options: productOptions,
    } = selectedProduct || {};

    const selectedOption = productOptions && productOptions.find(({ id }) => id === optionId || (productData && productData.optionId === id)) || {};

    const selectedDisplay = selectedOption.productDataDisplays && selectedOption.productDataDisplays.find(({ id }) => display && id === display.id)
      || selectedOption.productDataDisplays && selectedOption.productDataDisplays[0] || null;

    const {
      minDisplay = {},
      productDataImageOptions,
      productDataImageUri,
      baseImageUri,
    } = selectedDisplay || {};

    const {
      productDataScale,
      productDataScaleX,
      productDataLeft,
      productDataTop,
      productDataRotateX,
      productDataRotateY,
      productDataRotateZ,
      productDataPerspective,
      productDataPerspectiveOrigin,
      backgroundLeft,
      backgroundScale,
      backgroundTop,
    } = minDisplay;

    const top = 0;
    const left = 0;

    const productDataBlockStyle = {
      height: `${productDataScale}%`,
      width: `${productDataScaleX}%`,
      left: `${productDataLeft}%`,
      top: `${productDataTop}%`,
      perspective: `${productDataPerspective}px`,
      perspectiveOrigin: productDataPerspectiveOrigin,
    };

    const imageStyle = {
      height: `${100 - top * 2}%`,
      width: `${100 - left * 2}%`,
      top: `${top}%`,
      left: `${left}%`,
    };

    return (
      <div className={b('art-photo-block')}>
        <div
          className={b('art-wrap')}
        >
          <img
            className={b('display')}
            src={baseImageUri}
            alt="display"
            style={
              {
                width: `${backgroundScale}%`,
                left: `-${backgroundLeft}%`,
                top: `-${backgroundTop}%`,
              }
            }
          />
          <div className={b('productData-wrap')} style={productDataBlockStyle}>
            {(productDataImageOptions || []).map((itm) => {
              const {
                height,
                width,
                x,
                y,
                id: positionId,
              } = itm || {};

              const posId = positionId || 'default';

              const blockStyle = {
                height: `${height}%`,
                width: `${width}%`,
                left: `${x}%`,
                top: `${y}%`,
                transform: generateRotateStyle(productDataRotateX, productDataRotateY, productDataRotateZ),
              };

              const image = allImages.find(({
                position,
                id,
                groupId,
                images: imagesList
              }) => (
                (position === posId && images.includes(id) && !groupId)
                || (groupId && imagesList?.length && images.every((img) => imagesList.includes(img)))
              )) || allImages[0];

              return (
                <div className={b('image-wrap')} style={blockStyle} key={`zone_${posId}`}>
                  <img
                    className={b('art-photo')}
                    style={imageStyle}
                    src={(image && image.imageUri) ? image.imageUri : ''}
                    alt="art"
                  />
                  <div className={b('shadow-block')} style={imageStyle} />
                </div>
              );
            })}
            <img
              className={b('productData-image')}
              src={productDataImageUri}
              alt="productData"
            />
          </div>
        </div>
      </div>
    );
  };
  
  
  // left block side with image
  return (
    <div className={b('', { mix: className })}>
      {(item.typeProduct === 'special type') ? (
        getSpecialTypePhoto()
      ) : (
        <Image
          className={b('image')}
          src={selectProductImage().imageUri}
          alt="product image"
          width="100%"
          height="100%"
          layout="fill"
          objectFit="cover"
        />
      )}
    </div>
  );
};

LeftCardSide.propTypes = propTypes;
LeftCardSide.defaultProps = defaultProps;

const stateProps = state => ({
  allOrderImages: orderAllImagesSelector(state),
  exmapleProductProducts: exmapleProductProductListSelector(state),
  cartCollages: cartCollagesSelector(state),
});
export default connect(stateProps, null)(LeftCardSide);
