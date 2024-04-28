import axios from "../../../middlewares/http-common";
import useAuth from "./useAuth";
import { REFRESH } from "../../../routes";
import { useSelector } from "react-redux";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  // const refreshToken = useSelector(
  //   (state) => state.setInitConf.initRefreshToken
  // );
  const refresh = async () => {
    const response = await axios.get(REFRESH, {
      withCredentials: true,
      // headers: { refreshToken: refreshToken },
    });
    setAuth((prev) => {
      console.log({ "from useRefreshToken prev ": JSON.stringify(prev) });
      console.log({ "from uRt ": response.data.accessToken });
      return {
        ...prev,
        sys_role: response.data.sys_role,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};
export default useRefreshToken;
