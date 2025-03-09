import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
  CInputGroupText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMagnifyingGlass, cilPen } from "@coreui/icons";

import { Controller, useForm } from "react-hook-form";
import { AppStateContext, MachinesContext } from "../../../contexts";

import { fetchMachines } from "../../../utils";
import endpoints from "../../../app/endpoints";

const SCREEN_STATES = {
  Add: 1,
  Search: 2,
  Edit: 3,
};

const GerenciarEsteiras = () => {
  const [screenState, setScreenState] = React.useState(SCREEN_STATES.Search);
  const appStateCtx = React.useContext(AppStateContext);
  const { machines, setMachines } = React.useContext(MachinesContext);

  const handleAskToEdit = (esteira) => {
    setValue("machine_id", esteira.machine_id);
    setScreenState(SCREEN_STATES.Edit);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useForm();

  const { search } = watch();
  console.log(screenState);
  const onSubmit = React.useCallback(
    async (values) => {
      appStateCtx.setAppState(true);
      const token = localStorage.getItem("token");

      const options = {
        method: screenState === SCREEN_STATES.Add ? "POST" : "PUT",
        headers: new Headers({
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        }),
        body: JSON.stringify({
          ...values,
        }),
      };

      try {
        const res = await fetch(
          screenState === SCREEN_STATES.Add ? endpoints.machines.register : "",
          options
        );
        const body = await res.json();

        if (res.ok) {
          setScreenState(SCREEN_STATES.Search);
          fetchMachines(token, setMachines, appStateCtx.setAppState);
        } else if (body.message) {
          appStateCtx.setAppState(false, body.message);
        } else {
          appStateCtx.setAppState(
            false,
            "Não foi possível salvar as alterações, tente novamente."
          );
        }
      } catch (err) {
        console.error(err);
        appStateCtx.setAppState(
          false,
          "Não foi possível salvar as alterações, tente novamente."
        );
      }

      return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenState]
  );

  React.useEffect(() => {
    if (screenState === SCREEN_STATES.Search) {
      clearErrors();
      setValue("machine_id", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenState]);

  if (screenState === SCREEN_STATES.Search) {
    return (
      <div className="bg-body-tertiary min-vh-100 d-flex flex-column px-5">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <div className="clearfix">
                <h1 className="float-start display-3 me-4">
                  Gerenciar Esteiras
                </h1>
              </div>
              <CInputGroup className="input-prepend">
                <Controller
                  control={control}
                  name="search"
                  render={({ field }) => (
                    <>
                      <CInputGroupText>
                        <CIcon icon={cilMagnifyingGlass} />
                      </CInputGroupText>
                      <CFormInput
                        {...field}
                        type="text"
                        placeholder="Pesquise pelo ID"
                        autoComplete="search"
                      />
                    </>
                  )}
                ></Controller>
                <CButton
                  color="secondary"
                  type="button"
                  onClick={() => setScreenState(SCREEN_STATES.Add)}
                >
                  Adicionar
                </CButton>
              </CInputGroup>
            </CCol>
          </CRow>
        </CContainer>
        <div className="w-100 mt-5 m-auto" style={{ maxWidth: "1200px" }}>
          {machines
            .filter((m) => !search || m.machine_id.includes(search))
            .map((e) => (
              <CCard className="mb-4" key={e.machine_id}>
                <CCardBody>
                  <CRow>
                    <CCol sm={11}>
                      <h4 className="card-title mb-0">
                        Esteira ID: {e.machine_id}
                      </h4>
                    </CCol>
                    <CCol sm={1}>
                      <CButton type="button" onClick={() => handleAskToEdit(e)}>
                        <CIcon icon={cilPen} />
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={12}>
                      Total páginas contadas {Number(e.total_count)}
                    </CCol>
                  </CRow>
                </CCardBody>
                <CCardFooter>
                  {e.no_detection ? "Inativa" : "Ativa"}
                </CCardFooter>
              </CCard>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1>Registrar esteira</h1>
                  <p className="text-body-secondary">
                    Cadastre aqui uma nova esteira!
                  </p>
                  <CCol xs={3} className="w-100 text-end">
                    <CButton
                      type="button"
                      color="link"
                      className="mb-2"
                      onClick={() => setScreenState(SCREEN_STATES.Search)}
                    >
                      Voltar a pesquisa
                    </CButton>
                  </CCol>
                  <Controller
                    control={control}
                    name="machine_id"
                    rules={{
                      required: {
                        value: true,
                        message: "A identificação é obrigatória!",
                      },
                    }}
                    render={({ field }) => (
                      <CInputGroup className="mb-3">
                        <CFormInput
                          {...field}
                          placeholder="Identificação"
                          autoComplete="machine_id"
                          invalid={Boolean(errors.machine_id)}
                          feedbackInvalid={
                            errors.machine_id ? errors.machine_id.message : null
                          }
                        />
                      </CInputGroup>
                    )}
                  ></Controller>
                  {/* <Controller
                    control={control}
                    name="name"
                    rules={{
                      required: {
                        value: true,
                        message: "O nome é obrigatório!",
                      },
                    }}
                    render={({ field }) => (
                      <CInputGroup className="mb-4">
                        <CFormInput
                          type="text"
                          placeholder="Nome"
                          autoComplete="name"
                          {...field}
                        />
                      </CInputGroup>
                    )}
                  ></Controller> */}
                  <div className="d-grid">
                    <CButton
                      color="primary"
                      type="submit"
                      disabled={appStateCtx.appState.isLoading}
                    >
                      Registrar
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default GerenciarEsteiras;
