import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

export default function MyButtons({ handleLogout }) {
  return (
    <div className="flex gap-4">
      {/* Profile Button */}
      <Button
        component={Link}
        to="/profile"
        variant="contained"
        startIcon={<AccountCircleIcon />}
        sx={{ textTransform: "none" }}
      >
        Profile
      </Button>

      {/* Logout Button */}

      {/* <Link to="/logout"> */}
      <Button
        onClick={() => handleLogout()}
        variant="outlined"
        startIcon={<LogoutIcon />}
        sx={{ textTransform: "none" }}
      >
        Logout
      </Button>
      {/* </Link> */}
    </div>
  );
}
