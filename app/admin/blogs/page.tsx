"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Switch, FormControlLabel, IconButton, CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { createClient } from '@/lib/supabase/client';

// Định nghĩa kiểu dữ liệu cho Blog
interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail_url: string;
    is_published: boolean;
    created_at: string;
}

export default function BlogManagement() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Dùng useState để đảm bảo supabase client chỉ được tạo 1 lần duy nhất khi mount
    const [supabase] = useState(() => createClient());

    // State cho Dialog (Popup thêm/sửa)
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // State lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        thumbnail_url: '',
        is_published: false
    });
    const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    
    // Thử truy vấn đơn giản nhất có thể
    const { data, error } = await supabase
        .from('blogs')
        .select('*'); 

    console.log("Dữ liệu thô từ bảng blogs:", data); // Xem kỹ log này trong F12

    if (error) {
        console.error("Lỗi:", error);
    } else {
        setBlogs(data || []);
    }
    setIsLoading(false);
}, [supabase]);
    // 2. Mở Popup Thêm hoặc Sửa
    const handleOpenDialog = (blog?: Blog) => {
        if (blog) {
            setEditingId(blog.id);
            setFormData({
                title: blog.title,
                slug: blog.slug,
                content: blog.content,
                thumbnail_url: blog.thumbnail_url || '',
                is_published: blog.is_published
            });
        } else {
            setEditingId(null);
            setFormData({ title: '', slug: '', content: '', thumbnail_url: '', is_published: false });
        }
        setOpenDialog(true);
    };

    // 3. Hàm Lưu (Create hoặc Update)
    const handleSave = async () => {
        if (!formData.title || !formData.slug) {
            alert("Vui lòng nhập đủ Tiêu đề và Slug!");
            return;
        }

        if (editingId) {
            // Cập nhật (Update)
            const { error } = await supabase
                .from('blogs')
                .update(formData)
                .eq('id', editingId);
            if (error) alert("Lỗi khi cập nhật: " + error.message);
        } else {
            // Thêm mới (Create)
            const { error } = await supabase
                .from('blogs')
                .insert([formData]);
            if (error) alert("Lỗi khi thêm mới: " + error.message);
        }

        setOpenDialog(false);
        fetchBlogs(); // Tải lại danh sách sau khi lưu
    };

    // 4. Hàm Xóa (Delete)
    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (!error) {
                fetchBlogs(); // Tải lại danh sách sau khi xóa
            } else {
                alert("Lỗi khi xóa: " + error.message);
            }
        }
    };

    // Format ngày tháng hiển thị
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Quản lý Blog Du lịch</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ bgcolor: '#1976d2' }}>
                    Thêm bài viết mới
                </Button>
            </Box>

            {/* Bảng danh sách Blog */}
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tiêu đề</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Đường dẫn (Slug)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center"><CircularProgress sx={{ my: 3 }} /></TableCell>
                            </TableRow>
                        ) : blogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Chưa có bài viết nào.</TableCell>
                            </TableRow>
                        ) : (
                            blogs.map((blog) => (
                                <TableRow key={blog.id} hover>
                                    <TableCell>{blog.title}</TableCell>
                                    <TableCell>{blog.slug}</TableCell>
                                    <TableCell>
                                        {blog.is_published
                                            ? <Typography color="success.main" sx={{ fontWeight: 'bold' }}>Đã xuất bản</Typography>
                                            : <Typography color="text.secondary">Bản nháp</Typography>}
                                    </TableCell>
                                    <TableCell>{formatDate(blog.created_at)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleOpenDialog(blog)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(blog.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Popup Thêm/Sửa Blog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {editingId ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth label="Tiêu đề bài viết" margin="normal"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <TextField
                        fullWidth label="Đường dẫn (Slug - không dấu, gạch ngang, VD: top-5-diem-den)" margin="normal"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <TextField
                        fullWidth label="Link ảnh Thumbnail" margin="normal"
                        value={formData.thumbnail_url}
                        onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    />
                    <TextField
                        fullWidth label="Nội dung" margin="normal" multiline rows={6}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                    <FormControlLabel
                        control={<Switch checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} />}
                        label="Xuất bản (Hiển thị lên web)"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">Hủy bỏ</Button>
                    <Button variant="contained" onClick={handleSave}>Lưu bài viết</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}