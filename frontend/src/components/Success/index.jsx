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
import { cilCheck } from "@coreui/icons";

import { AppStateContext } from "../../contexts";

const Success = () => {
  const appStateCtx = React.useContext(AppStateContext);

  const handleCloseSuccessModal = () =>
    appStateCtx.setAppState(false, null, null);

  return (
    <CModal
      visible={true}
      fullscreen={true}
      onClose={handleCloseSuccessModal}
      aria-labelledby="success"
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
          <CModalTitle id="success">Sucesso</CModalTitle>
          <CModalTitle>
            <CIcon icon={cilCheck} className="text-success" size="xl" />
          </CModalTitle>
        </CModalHeader>
        <CModalBody>{appStateCtx.appState.success}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleCloseSuccessModal}>
            Ok, entendi!
          </CButton>
        </CModalFooter>
      </div>
    </CModal>
  );
};

export default Success;
