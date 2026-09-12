import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import ImageAvatars from "./Avtar";
import MyButton from "./MyButton";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../api/api";
import { setLogout, setUser } from "../redux/authSlice";
import { api } from "../api/api";

export default function PopoverPopupState() {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      api
        .get("/api/verify", { withCredentials: true })
        .then((res) => {
          dispatch(setUser(res.data.user));
        })
        .catch(() => {
          dispatch(setLogout());
        });
    }
  }, [dispatch, user]);

  function handleLogout() {
    logout()
      .then((r) => {
        dispatch(setLogout());
        localStorage.removeItem("mytoken");
        navigate("/login");
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return !user ? (
    <div className="ml-2 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 shadow-sm sm:gap-3 sm:px-3">
      <Link to="/login">
        <button className="cursor-pointer rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900">
          Login
        </button>
      </Link>
      <Link to="/signup">
        <button className="cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700">
          Sign up
        </button>
      </Link>
    </div>
  ) : (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <div>
          <Button variant="" {...bindTrigger(popupState)}>
            <ImageAvatars />
          </Button>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Typography
              component="div"
              sx={{ p: 2, flex: 1, display: "flex", alignItems: "center" }}
            >
              <div>
                <ImageAvatars />
              </div>
              <div className="flex flex-col ml-4 text-center gap-2">
                <h2 className="font-bold">{user?.fullName || "User"}</h2>
                <p className="text-sm capitalize text-slate-500">
                  {user?.role}
                </p>
                <MyButton handleLogout={handleLogout} />
              </div>
            </Typography>
          </Popover>
        </div>
      )}
    </PopupState>
  );
}
