import React, { useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

export default function AuthNavigator() {
  const [currentScreen, setCurrentScreen] = useState("Login");
  const [params, setParams] = useState({});

  const navigation = {
    navigate: (screenName, nextParams = {}) => {
      setParams(nextParams);
      setCurrentScreen(screenName);
    },
  };

  if (currentScreen === "Register") {
    return <RegisterScreen navigation={navigation} route={{ params }} />;
  }

  return <LoginScreen navigation={navigation} route={{ params }} />;
}
