/** @format */

import React, { useContext, useLayoutEffect } from "react";
import { Box, SimpleBox } from "../components/Boxes";
import { ValidateCookieCtx } from "../context/manager";

interface IProps {
  children: React.ReactChild;
}
function Auth(props: IProps) {
  const { children } = props;
  const cookieCtx = useContext(ValidateCookieCtx);
  const {
    location: { pathname },
  } = window;
  const isLoginPath = /manager\/login/gi.test(pathname);
  useLayoutEffect(() => {
    cookieCtx.refresh();
  }, [isLoginPath, cookieCtx]);
  return (
    <SimpleBox>
      {!cookieCtx.isMngrCookieValid && !isLoginPath && <Box>Loading....</Box>}
      {(cookieCtx.isMngrCookieValid || isLoginPath) && children}
    </SimpleBox>
  );
}

export default Auth;
