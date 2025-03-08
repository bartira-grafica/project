import endpoints from "../app/endpoints";

const fetchMachines = async (
  token,
  setMachines,
  setAppState,
  navigate = null
) => {
  const options = {
    method: "GET",
    headers: new Headers({
      authorization: "Bearer " + token,
    }),
  };

  const handleError = (err) => {
    setAppState(
      false,
      "Não foi possível carregar os dados do usuário, tente novamente!"
    );
    console.error(err);
    if (navigate) {
      localStorage.clear();
      navigate("/");
    }
  };

  try {
    setAppState(true);

    const res = await fetch(endpoints.machines.list, options);
    const body = await res.json();

    if (res.ok) {
      setAppState(false);
      setMachines(body);
    } else {
      handleError(body);
    }
  } catch (err) {
    handleError(err);
  }
};

export default fetchMachines;
