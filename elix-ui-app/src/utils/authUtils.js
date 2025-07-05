export const initializeAuth = async (globalStore, router) => {
  const token = localStorage.getItem("access_token");

  const currentPath = router.currentRoute.value.path;
  if (currentPath === "/login") {
    globalStore.authLoading(false);
    return;
  }

  if (!token) {
    authFailed(globalStore, router);
    return;
  }

  const url = "https://y1l8hkwkpd.execute-api.ap-south-1.amazonaws.com/dev/";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
  const data = await response.json();
  console.log("Data:", data);
  if (data.statusCode !== 200) {
    authFailed(globalStore, router);
    return;
  }
  globalStore.authLoading(false);
};

const authFailed = (globalStore, router) => {
  console.error("Authentication failed:", data);
  globalStore.authLoading(false);
  router.push("/login");
};
