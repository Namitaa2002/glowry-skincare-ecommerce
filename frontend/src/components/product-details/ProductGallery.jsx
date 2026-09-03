function ProductGallery({
  image,
  productName,
  getImageUrl,
}) {
  const productImage =
    getImageUrl(image);

  return (
    <div className="product-details-image">

      <img
        src={productImage}
        alt={productName}
        onError={(e) => {
          e.currentTarget.style.display =
            "none";
        }}
      />

    </div>
  );
}

export default ProductGallery;