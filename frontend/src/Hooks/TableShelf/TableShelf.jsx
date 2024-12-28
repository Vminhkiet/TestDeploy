import React, { useState, useEffect } from "react";
import {
  Paper,
  Modal,
  Fade,
  TextField,
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ApiService from "../../Service/ApiService";

const columns = [
  { id: "id", label: "ID", minWidth: 30 },
  { id: "shelfCode", label: "Tên kệ hàng", maxWidth: 140 },
  { id: "inventoryId", label: "Kho hàng", maxWidth: 140 },
  { id: "productId", label: "Loại sản phẩm", maxWidth: 140 },
  { id: "quantity", label: "Tổng sản phẩm", minWidth: 140 },
  { id: "capacity", label: "Sức chứa (sản phẩm)", maxWidth: 100 },
];

const style = {
  position: "absolute",
  top: "47%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const TableShelf = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [shelfs, setShelfs] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchShelfs = async () => {
    try {
      const response = await ApiService.getAllShelf();
      setShelfs(response);
    } catch (error) {
      console.error("Lỗi khi tải thông tin các Shelf", error.message);
    }
  };

  useEffect(() => {
    fetchShelfs();
  }, []);

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleUpdate = () => {
    if (selectedRow) {
      setEditData(selectedRow);
      setIsEditModalOpen(true);
    }
    handleCloseMenu();
  };

  const handleSaveUpdate = async () => {
    try {
      await ApiService.updateShelf(editData.id, editData);
      alert("Cập nhật thành công!");
      setShelfs((prev) =>
        prev.map((item) => (item.id === editData.id ? editData : item))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      alert("Lỗi khi cập nhật kệ hàng!");
    }
  };

  const handleDelete = async () => {
    if (selectedRow && selectedRow.id) {
      const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa kệ hàng "${selectedRow.shelfCode}"?`);
      if (confirmDelete) {
        try {
          await ApiService.deleteShelf(selectedRow.id);
          alert("Kệ hàng đã được xóa thành công!");
          setShelfs((prev) => prev.filter((item) => item.id !== selectedRow.id));
        } catch (error) {
          alert("Lỗi khi xóa kệ hàng. Vui lòng thử lại.");
        } finally {
          handleCloseMenu();
        }
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="center">Tùy chọn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shelfs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return <TableCell key={column.id}>{value}</TableCell>;
                  })}
                  <TableCell align="center">
                    <IconButton onClick={(event) => handleOpenMenu(event, row)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={shelfs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleUpdate}>Cập nhật</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Fade in={isEditModalOpen}>
          <Box sx={style}>
            <Typography sx={{ fontWeight: "bold", fontSize: "20px", marginBottom: "1rem" }}>
              Cập nhật kệ hàng
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Tên kệ hàng"
                value={editData.shelfCode || ""}
                onChange={(e) => setEditData({ ...editData, shelfCode: e.target.value })}
              />
              <TextField
                label="Kho hàng"
                value={editData.inventoryId || ""}
                onChange={(e) => setEditData({ ...editData, inventoryId: e.target.value })}
              />
              <TextField
                label="Loại sản phẩm"
                value={editData.productId || ""}
                onChange={(e) => setEditData({ ...editData, productId: e.target.value })}
              />
              <TextField
                label="Tổng sản phẩm"
                value={editData.quantity || ""}
                onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
              />
              <TextField
                label="Sức chứa (sản phẩm)"
                value={editData.capacity || ""}
                onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
              />
              <Button sx={{backgroundColor:"#243642"}} variant="contained" onClick={handleSaveUpdate}>
                Lưu
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};

export default TableShelf;