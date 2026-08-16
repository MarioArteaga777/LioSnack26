import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS } from "../utils/theme";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle continuous pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [fadeAnim, scaleAnim, pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Background ambient glow circles */}
      <View style={styles.glowCircleTop} />
      <View style={styles.glowCircleBottom} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Container with animated pulse */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.logoBorder}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Brand Tag */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✦ COSMIC PANTRY ✦</Text>
        </View>

        {/* Brand Name & Tagline */}
        <Text style={styles.brandTitle}>LioSnack</Text>
        <Text style={styles.brandSubtitle}>
          Snacks liofilizados del futuro
        </Text>

        {/* Loading / Waiting indicator dots */}
        <View style={styles.loaderContainer}>
          <View style={[styles.loaderDot, styles.dot1]} />
          <View style={[styles.loaderDot, styles.dot2]} />
          <View style={[styles.loaderDot, styles.dot3]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.void,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  glowCircleTop: {
    position: "absolute",
    top: -80,
    right: -80,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: "rgba(245, 168, 202, 0.08)",
  },
  glowCircleBottom: {
    position: "absolute",
    bottom: -100,
    left: -100,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: "rgba(99, 217, 196, 0.06)",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoWrapper: {
    marginBottom: 26,
    shadowColor: COLORS.bloom,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  logoBorder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.voidSoft,
    borderWidth: 2,
    borderColor: COLORS.nebulaBorder,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: "rgba(245, 168, 202, 0.12)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245, 168, 202, 0.3)",
    marginBottom: 14,
  },
  badgeText: {
    color: COLORS.bloom,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  brandTitle: {
    color: COLORS.stardust,
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: "center",
  },
  brandSubtitle: {
    color: COLORS.mist,
    fontSize: 15,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 22,
  },
  loaderContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 38,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.bloom,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.8 },
  dot3: { opacity: 1 },
});
