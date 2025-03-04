import React from "react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilWarning } from "@coreui/icons";

import { AppStateContext } from "../../contexts";

const Error = () => {
  const appStateCtx = React.useContext(AppStateContext);

  const handleCloseErrorModal = () => appStateCtx.setAppState(false, null);

  return (
    <CModal
      visible={true}
      fullscreen={true}
      onClose={handleCloseErrorModal}
      aria-labelledby="error"
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "rgba(255, 255, 255)",
        }}
      >
        <CModalHeader
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          <CModalTitle id="erro">Erro</CModalTitle>
          <CModalTitle>
            <CIcon icon={cilWarning} className="text-danger" size="xl" />
          </CModalTitle>
        </CModalHeader>
        <CModalBody>{appStateCtx.appState.error}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleCloseErrorModal}>
            Ok, entendi!
          </CButton>
        </CModalFooter>
      </div>
    </CModal>
  );
};

export default Error;
