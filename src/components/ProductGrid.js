import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  CircularProgress,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductGrid = () => {
  const [pageState, setPageState] = useState({
    isLoading: false,
    products: [],
    total: 0,
    page: 0,
    pageSize: 20,
    search: "",
    category: "",
    sortModel: [{ field: "price", sort: "asc" }],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setPageState((prevState) => ({ ...prevState, isLoading: true }));
        const params = new URLSearchParams({
          page: pageState.page + 1,
        });
        const response = await fetch(
          `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products?${params.toString()}`
        );
        const result = await response.json();
        setPageState((prevState) => ({
          ...prevState,
          products: result?.products,
          total: result.totalResults,
          isLoading: false,
        }));
      } catch (error) {
        console.log("Error fetching products", error);
        setPageState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };
    fetchProducts();
  }, [
    pageState.page,
    pageState.pageSize,
    pageState.search,
    pageState.category,
    pageState.sortModel,
  ]);

  const formatPrice = (price, currency = "INR") => {
    const formatCurrency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    });

    return formatCurrency.format(price);
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 350,
      renderCell: (params) => (
        <img
          src={params?.row?.images?.front}
          alt={params?.row?.name}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Product Name",
      width: 300,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 150,
      renderCell: (params) => (
        <span>
          {formatPrice(params?.row?.mrp?.mrp, params?.row?.mrp?.currency)}
        </span>
      ),
    },
  ];

  const handleRowClick = (params) => {
    navigate(`/product/${params?.row?.sku_code}`);
  };

  const debouncedSearch = (e) => {
    setTimeout(() => {
      const result = pageState.products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setPageState((prevState) => ({
        ...prevState,
        products: result,
        page: 0,
      }));
    }, 500);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", mb: 4 }}>
        <TextField
          label="Search Product"
          onChange={debouncedSearch}
          variant="outlined"
          sx={{ mr: 2, width: "80%" }}
        />
      </Box>
      {pageState.isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rowHeight={350}
          rows={pageState?.products || []}
          columns={columns}
          paginationModel={pageState}
          onPaginationModelChange={setPageState}
          getRowId={(row) => row?.activation_date}
          rowCount={parseInt(pageState.total)}
          paginationMode="server"
          onRowClick={handleRowClick}
          loading={pageState.isLoading}
        />
      )}
    </Box>
  );
};

export default ProductGrid;
