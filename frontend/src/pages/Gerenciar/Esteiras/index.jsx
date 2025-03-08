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

const SCREEN_STATES = {
  Add: 1,
  Search: 2,
  Edit: 3,
};

const GerenciarEsteiras = () => {
  const [screenState, setScreenState] = React.useState(SCREEN_STATES.Search);
  const appStateCtx = React.useContext(AppStateContext);
  const { machines } = React.useContext(MachinesContext);

  const handleAskToEdit = (esteira) => {
    setValue("id", esteira.machine_id);
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

  const onSubmit = React.useCallback(
    async (values) => {
      appStateCtx.setAppState(true);
      setScreenState(SCREEN_STATES.Search);
      appStateCtx.setAppState(false);

      return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  React.useEffect(() => {
    if (screenState === SCREEN_STATES.Search) {
      clearErrors();
      setValue("id", null);
      setValue("name", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenState]);

  if (screenState === SCREEN_STATES.Search) {
    return (
      <div className="bg-body-tertiary min-vh-100 d-flex flex-column">
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
                        placeholder="Pesquise pelo ID da esteira..."
                        autoComplete="search"
                      />
                    </>
                  )}
                ></Controller>
                <CButton
                  color="secondary"
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
                      <CButton onClick={() => handleAskToEdit(e)}>
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
                      color="link"
                      className="mb-2"
                      onClick={() => setScreenState(SCREEN_STATES.Search)}
                    >
                      Voltar a pesquisa
                    </CButton>
                  </CCol>
                  <Controller
                    control={control}
                    name="id"
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
                          autoComplete="id"
                          invalid={Boolean(errors.id)}
                          feedbackInvalid={errors.id ? errors.id.message : null}
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
