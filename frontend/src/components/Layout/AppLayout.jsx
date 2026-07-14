import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MedicalServices as MedicalIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { logout } from "../../store/slices/authSlice";

const DRAWER_WIDTH = 260;

const patientNav = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/patient/dashboard" },
  { text: "Find Doctors", icon: <SearchIcon />, path: "/patient/doctors" },
  { text: "My Appointments", icon: <EventIcon />, path: "/patient/appointments" },
  { text: "Profile", icon: <PersonIcon />, path: "/patient/profile" },
];

const doctorNav = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/doctor/dashboard" },
  { text: "Availability", icon: <ScheduleIcon />, path: "/doctor/availability" },
  { text: "Appointments", icon: <EventIcon />, path: "/doctor/appointments" },
  { text: "Profile", icon: <PersonIcon />, path: "/doctor/profile" },
];

const adminNav = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
  { text: "Specialties", icon: <CategoryIcon />, path: "/admin/specialties" },
  { text: "Appointments", icon: <EventIcon />, path: "/admin/appointments" },
];

function getNavItems(role) {
  if (role === "ADMIN") return adminNav;
  if (role === "DOCTOR") return doctorNav;
  return patientNav;
}

function getRoleDashboard(role) {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "DOCTOR") return "/doctor/dashboard";
  return "/patient/dashboard";
}

export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = getNavItems(user?.role);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const drawer = (
    <Box>
      <Toolbar>
        <MedicalIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight={700} color="primary">
          MediSys
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path || location.pathname.startsWith(item.path + "/")}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{ mx: 1, borderRadius: 1 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} aria-label="Open navigation menu" sx={{ mr: 2, display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate(getRoleDashboard(user?.role))}
          >
            MediSys
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen} aria-label="User menu">
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
              {user?.first_name?.[0] || user?.username?.[0] || "U"}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(getRoleDashboard(user?.role));
              }}
            >
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          mt: "64px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
