import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useLocation } from "react-router-dom";
import PopoverPopupState from "./PopoverPopupState";
import { useState } from "react";
import { useSelector } from "react-redux";

const publicItems = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Jobs", to: "/job" },
  { label: "Browse", to: "/browse" },
  { label: "Companies", to: "/companies" },
];

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreAnchor, setMoreAnchor] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const roleItems =
    user?.role === "Recruiter"
      ? [
          { label: "My hiring", to: "/recruiter-dashboard" },
          { label: "Post a job", to: "/post-job" },
        ]
      : user?.role === "Student"
        ? [{ label: "Applied jobs", to: "/applied-jobs" }]
        : [];
  const navItems = [
    ...publicItems,
    ...(user ? [{ label: "Profile", to: "/profile" }] : []),
    ...roleItems,
  ];
  const primaryItems = navItems.slice(0, user ? 4 : 3);
  const secondaryItems = navItems.slice(user ? 4 : 3);

  const isActive = (to) =>
    to === "/"
      ? currentPath === "/"
      : currentPath === to || currentPath.startsWith(to + "/");

  const linkStyles = (active) => ({
    color: active ? "#2563eb" : "#334155",
    fontWeight: 700,
    textTransform: "none",
    borderRadius: "999px",
    px: { md: 1, lg: 1.35 },
    py: 0.85,
    minWidth: "auto",
    whiteSpace: "nowrap",
    backgroundColor: active ? "#dbeafe" : "transparent",
    boxShadow: active ? "inset 0 0 0 1px #bfdbfe" : "none",
    "&:hover": {
      backgroundColor: active ? "#bfdbfe" : "#eff6ff",
      color: "#2563eb",
    },
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        px: { xs: 1, sm: 2 },
        py: 0.5,
        backgroundColor: "rgba(255,255,255,0.92)",
        color: "#0f172a",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 68, sm: 80 },
          gap: { xs: 1, md: 1.25 },
          justifyContent: "space-between",
          px: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              fontSize: { xs: "1.35rem", sm: "1.55rem", lg: "2rem" },
            }}
          >
            Job<span style={{ color: "#ef4444" }}>Portal</span>
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.25,
            minWidth: 0,
            justifyContent: "center",
            flex: 1,
          }}
        >
          {primaryItems.map(({ label, to }) => (
            <Button
              key={label}
              component={Link}
              to={to}
              aria-current={isActive(to) ? "page" : undefined}
              sx={linkStyles(isActive(to))}
            >
              {label}
            </Button>
          ))}
          {secondaryItems.length > 0 && (
            <>
              {secondaryItems.map(({ label, to }) => (
                <Button
                  key={`wide-${label}`}
                  component={Link}
                  to={to}
                  aria-current={isActive(to) ? "page" : undefined}
                  sx={{
                    ...linkStyles(isActive(to)),
                    display: { xs: "none", md: "none", lg: "inline-flex" },
                  }}
                >
                  {label}
                </Button>
              ))}
              <Button
                onClick={(event) => setMoreAnchor(event.currentTarget)}
                endIcon={<MoreHorizIcon sx={{ fontSize: 18 }} />}
                sx={{
                  ...linkStyles(secondaryItems.some(({ to }) => isActive(to))),
                  display: { xs: "none", md: "inline-flex", lg: "none" },
                }}
              >
                More
              </Button>
              <Menu
                anchorEl={moreAnchor}
                open={Boolean(moreAnchor)}
                onClose={() => setMoreAnchor(null)}
                slotProps={{ root: { sx: { display: { lg: "none" } } } }}
              >
                {secondaryItems.map(({ label, to }) => (
                  <MenuItem
                    key={label}
                    component={Link}
                    to={to}
                    selected={isActive(to)}
                    onClick={() => setMoreAnchor(null)}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>

        <IconButton
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileOpen((open) => !open)}
          sx={{ display: { xs: "inline-flex", md: "none" }, color: "#122033" }}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {user && (
          <Typography
            sx={{
              display: { xs: "none", xl: "block" },
              color: "#64748b",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {user.role}
          </Typography>
        )}
        <PopoverPopupState />
      </Toolbar>
      {mobileOpen && (
        <Box
          sx={{ display: { xs: "grid", md: "none" }, gap: 0.5, px: 2, pb: 2 }}
        >
          {navItems.map(({ label, to }) => (
            <Button
              key={label}
              component={Link}
              to={to}
              onClick={() => setMobileOpen(false)}
              sx={{
                justifyContent: "flex-start",
                color: "#334155",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1.2,
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      )}
    </AppBar>
  );
}
