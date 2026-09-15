import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";

export default function ImageAvatars() {
  const user = useSelector((store) => store.auth.user);
  const initials = (user?.fullName || "User")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Stack direction="row" spacing={2}>
      {/* <Avatar alt={user?.fullName || "User profile"}>{initials}</Avatar> */}

      <Avatar alt={user?.fullName || "User profile"} src={user?.profile?.photo}>
        {!user?.profile?.photo && initials}
      </Avatar>
    </Stack>
  );
}
