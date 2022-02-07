import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import "./App.css";

const GetData = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [token, setToken] = useState();

  const getToken = useCallback(async () => {
    const retreivedToken = await getAccessTokenSilently();
    console.log("first");
    setToken(retreivedToken);
  }, [getAccessTokenSilently]);

  useEffect(() => {
    getToken();
  }, [getToken]);

  console.log(token);

  const getData = () => {
    fetch("http://localhost:4000/authorized", {
      method: "GET",
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => console.log(r))
      .catch(console.log);
  };

  const callSecureApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`http://localhost:4000/authorized`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.text();
      console.log(responseData);
      alert(responseData);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <button onClick={callSecureApi}>Get data</button>
      <button onClick={getToken}>Get token</button>
    </>
  );
};

function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  console.log("user", user);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        Hello {user.name}{" "}
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
        <GetData />
      </div>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
}

export default App;
