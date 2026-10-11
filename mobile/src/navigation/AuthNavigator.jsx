import React, { useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyRecoveryScreen from "../screens/VerifyRecoveryScreen";
import NewPasswordScreen from "../screens/NewPasswordScreen";

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

  if (currentScreen === "ForgotPassword") {
    return <ForgotPasswordScreen navigation={navigation} route={{ params }} />;
  }

  if (currentScreen === "VerifyRecovery") {
    return <VerifyRecoveryScreen navigation={navigation} route={{ params }} />;
  }

  if (currentScreen === "NewPassword") {
    return <NewPasswordScreen navigation={navigation} route={{ params }} />;
  }

  return <LoginScreen navigation={navigation} route={{ params }} />;
}
