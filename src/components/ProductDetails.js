import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Box, Typography } from "@mui/material";

const ProductDetails = () => {
  const { sku_code } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products/${sku_code}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku_code]);

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        product && (
          <Box>
            <Typography variant="h4">{product.name}</Typography>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%" }}
            />
            <Typography variant="body1">
              Category: {product.category}
            </Typography>
            <Typography variant="body1">Price: ${product.price}</Typography>
          </Box>
        )
      )}
    </Box>
  );
};

export default ProductDetails;
