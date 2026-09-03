import {
  Link,
} from "react-router-dom";

function RelatedProducts({
  products,
  getImageUrl,
}) {
  if (
    products.length === 0
  ) {
    return null;
  }

  return (
    <section className="related-products-section">

      <div className="related-products-header">

        <p className="section-small-title">
          YOU MAY ALSO LIKE
        </p>

        <h2>
          Related Products
        </h2>

      </div>

      <div className="related-products-grid">

        {products.map(
          (relatedProduct) => (

            <Link
              key={
                relatedProduct._id
              }
              to={`/product/${relatedProduct._id}`}
              className="related-product-card"
            >

              <div className="related-product-image">

                <img
                  src={getImageUrl(
                    relatedProduct.image
                  )}
                  alt={
                    relatedProduct.name
                  }
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>

              <div className="related-product-info">

                <p>
                  {relatedProduct.category}
                </p>

                <h3>
                  {relatedProduct.name}
                </h3>

                <strong>
                  ₹
                  {Number(
                    relatedProduct.price || 0
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            </Link>

          )
        )}

      </div>

    </section>
  );
}

export default RelatedProducts;