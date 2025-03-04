import React from "react";
import { CModal, CModalContent, CSpinner } from "@coreui/react";

const Loader = () => {
  return (
    <CModal
      visible={true}
      fullscreen={true}
      backdrop="static"
      aria-labelledby="Carregando..."
    >
      <CModalContent
        style={{
          display: "grid",
          placeItems: "center",
          backgroundColor: "unset",
          background: "rgba(255, 255, 255, 0.4)",
        }}
      >
        <CSpinner
          color="primary"
          variant="grow"
          style={{ width: "6rem", height: "6rem" }}
        />
      </CModalContent>
    </CModal>
  );
};

export default Loader;
