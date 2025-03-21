import React from "react";
// import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilLockUnlocked } from "@coreui/icons";

import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AppStateContext } from "../../contexts";

import endpoints from "../../app/endpoints";

const Login = () => {
  const [isPwdVisible, setIsPwdVisible] = React.useState(false);
  const appStateCtx = React.useContext(AppStateContext);

  const changePasswordVisibility = () => setIsPwdVisible(!isPwdVisible);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = React.useCallback(
    async (values) => {
      if (Object.values(values).every((d) => d)) {
        appStateCtx.setAppState(true);
        const options = {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        };

        try {
          const res = await fetch(endpoints.users.login, options);
          const body = await res.json();

          if (res.ok) {
            //#region Armazenar dados da sessão
            localStorage.setItem("user", JSON.stringify(body.user));
            localStorage.setItem("token", body.token);
            //#endregion
            appStateCtx.setAppState(false);
            navigate("/dashboard");
          } else if (body) {
            appStateCtx.setAppState(false, body.message);
          } else {
            appStateCtx.setAppState(
              false,
              "Não foi possível realizar o login, tente novamente!"
            );
          }
        } catch (err) {
          appStateCtx.setAppState(
            false,
            "Não foi possível realizar o login, tente novamente!"
          );
        }

        return;
      }

      return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Bem vindo...</h1>
                    <p className="text-body-secondary">
                      Faça login com usuário e senha!
                    </p>
                    <Controller
                      control={control}
                      name="email"
                      rules={{
                        required: {
                          value: true,
                          message: "O usuário é obrigatório!",
                        },
                      }}
                      render={({ field }) => (
                        <CInputGroup className="mb-3">
                          <CInputGroupText>@</CInputGroupText>
                          <CFormInput
                            {...field}
                            placeholder="Email"
                            autoComplete="email"
                            type="email"
                            invalid={Boolean(errors.email)}
                            feedbackInvalid={
                              errors.email ? errors.email.message : null
                            }
                          />
                        </CInputGroup>
                      )}
                    ></Controller>
                    <Controller
                      control={control}
                      name="password"
                      rules={{
                        required: {
                          value: true,
                          message: "A senha é obrigatória!",
                        },
                      }}
                      render={({ field }) => (
                        <CInputGroup className="mb-4">
                          <CButton
                            color="secondary"
                            onClick={changePasswordVisibility}
                          >
                            <CIcon
                              icon={
                                isPwdVisible ? cilLockLocked : cilLockUnlocked
                              }
                            />
                          </CButton>
                          <CFormInput
                            type={isPwdVisible ? "text" : "password"}
                            placeholder="Senha"
                            autoComplete="current-password"
                            {...field}
                            invalid={Boolean(errors.password)}
                            feedbackInvalid={
                              errors.password ? errors.password.message : null
                            }
                          />
                        </CInputGroup>
                      )}
                    ></Controller>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          type="submit"
                          disabled={appStateCtx.appState.isLoading}
                        >
                          Entrar
                        </CButton>
                      </CCol>
                      <CCol xs={3} className="text-right">
                        <CButton
                          color="link"
                          href="/registrar"
                          className="px-0"
                        >
                          Criar usuário
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard
                className="text-white bg-primary py-5"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <Link to="/register">
                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
