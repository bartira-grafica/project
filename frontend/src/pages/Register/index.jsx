import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilLockUnlocked, cilUser } from "@coreui/icons";

import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AppStateContext } from "../../contexts";

const Register = () => {
  const [isPwdVisible, setIsPwdVisible] = React.useState(false);
  const [isPwdRepeatVisible, setIsPwdRepeatVisible] = React.useState(false);
  const appStateCtx = React.useContext(AppStateContext);

  const changePasswordVisibility = () => setIsPwdVisible(!isPwdVisible);
  const changePasswordRepeatVisibility = () =>
    setIsPwdRepeatVisible(!isPwdRepeatVisible);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log(errors);

  const onSubmit = React.useCallback(
    async (values) => {
      appStateCtx.setAppState(true);

      navigate("/"); // Navega pro login
      appStateCtx.setAppState(false);

      return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1>Criar conta</h1>
                  <p className="text-body-secondary">Crie um novo usuário</p>
                  <Controller
                    control={control}
                    name="user"
                    rules={{
                      required: {
                        value: true,
                        message: "O usuário é obrigatório!",
                      },
                    }}
                    render={({ field }) => (
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          {...field}
                          placeholder="Usuário"
                          autoComplete="username"
                          invalid={Boolean(errors.user)}
                          feedbackInvalid={
                            errors.user ? errors.user.message : null
                          }
                        />
                      </CInputGroup>
                    )}
                  ></Controller>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <CInputGroup className="mb-4">
                        <CInputGroupText>@</CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Email"
                          autoComplete="email"
                          {...field}
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
                          autoComplete="new-password"
                          {...field}
                          invalid={Boolean(errors.password)}
                          feedbackInvalid={
                            errors.password ? errors.password.message : null
                          }
                        />
                      </CInputGroup>
                    )}
                  ></Controller>
                  <Controller
                    control={control}
                    name="password_repeat"
                    rules={{
                      required: {
                        value: true,
                        message: "A repetição da senha é obrigatória!",
                      },
                    }}
                    render={({ field }) => (
                      <CInputGroup className="mb-4">
                        <CButton
                          color="secondary"
                          onClick={changePasswordRepeatVisibility}
                        >
                          <CIcon
                            icon={
                              isPwdRepeatVisible
                                ? cilLockLocked
                                : cilLockUnlocked
                            }
                          />
                        </CButton>
                        <CFormInput
                          type={isPwdRepeatVisible ? "text" : "password"}
                          placeholder="Repita a senha"
                          autoComplete="new-password"
                          {...field}
                          invalid={Boolean(errors.password_repeat)}
                          feedbackInvalid={
                            errors.password_repeat
                              ? errors.password_repeat.message
                              : null
                          }
                        />
                      </CInputGroup>
                    )}
                  ></Controller>
                  <div className="d-grid">
                    <CButton
                      color="primary"
                      type="submit"
                      disabled={appStateCtx.appState.isLoading}
                    >
                      Criar conta
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

export default Register;
