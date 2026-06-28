"use client";

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PeopleIcon from '@mui/icons-material/People';
import { useRouter, usePathname } from 'next/navigation';
import ArticleIcon from '@mui/icons-material/Article';

const drawerWidth = 260;

const menuItems = [
  { text: 'Revenue Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Booking Management', icon: <BookOnlineIcon />, path: '/admin/bookings' },
  { text: 'Menu Management', icon: <RestaurantMenuIcon />, path: '/admin/menu' },
  { text: 'Customer Management', icon: <PeopleIcon />, path: '/admin/customers' },
  { text: 'Blog Management', icon: <ArticleIcon />, path: '/admin/blogs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Thanh Header (AppBar) */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Da Nang Coastal Retreat - Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Thanh Menu bên trái (Sidebar/Drawer) */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f5f5f5',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Coastal Retreat
          </Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={pathname === item.path}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon sx={{ color: pathname === item.path ? '#1976d2' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ color: pathname === item.path ? '#1976d2' : 'inherit', fontWeight: pathname === item.path ? 'bold' : 'normal' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Nội dung chính của các trang */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar /> {/* Thẻ này dùng để đẩy nội dung xuống dưới Header */}
        {children}
      </Box>
    </Box>
  );
}