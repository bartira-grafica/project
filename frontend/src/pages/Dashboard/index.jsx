import React from "react";
import classNames from "classnames";

import {
  CContainer,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionItem,
  CAccordionHeader,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton,
} from "@coreui/react";

import { AppStateContext, MachinesContext } from "../../contexts";

import { calculateTime, fetchMachines } from "../../utils";

const Dashboard = () => {
  const [machinesFilter, setMachinesFilter] = React.useState("Todas"); // Todas, Ativas, Inativas
  const { machines, setMachines } = React.useContext(MachinesContext);
  const { setAppState } = React.useContext(AppStateContext);

  const handleRefresh = () => {
    const token = localStorage.getItem("token");

    fetchMachines(token, setMachines, setAppState);
  };

  return (
    <CContainer style={{ padding: "0 20px" }}>
      <CAccordion activeItemKey={1}>
        <CAccordionItem itemKey={1}>
          <CAccordionHeader>
            <h2 style={{ fontSize: "2rem", fontWeight: 500, lineHeight: 1.2 }}>
              Visualizar esteiras
            </h2>
          </CAccordionHeader>
          <CAccordionBody>
            <CDropdown>
              <CDropdownToggle color="secondary">
                {machinesFilter}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  style={{ cursor: "pointer" }}
                  onClick={() => setMachinesFilter("Todas")}
                >
                  Todas
                </CDropdownItem>
                <CDropdownItem
                  style={{ cursor: "pointer" }}
                  onClick={() => setMachinesFilter("Ativas")}
                >
                  Ativas
                </CDropdownItem>
                <CDropdownItem
                  style={{ cursor: "pointer" }}
                  onClick={() => setMachinesFilter("Inativas")}
                >
                  Inativas
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <CButton
              color="info"
              style={{ color: "#fff", marginLeft: 10 }}
              type="button"
              onClick={handleRefresh}
            >
              Atualizar
            </CButton>
            <br />
            <br />
            {machines.map((t) => {
              debugger;
              if (
                machinesFilter === "Todas" ||
                (machinesFilter === "Ativas" && (Boolean(t.no_detection) === false && t.no_detection !== null)) ||
                (machinesFilter === "Inativas" &&
                  (Boolean(t.no_detection) === true || t.no_detection === null))
              ) {
                const percentTotalCount =
                  (Number(t.total_count) /
                    machines
                      .map((m) => Number(m.total_count))
                      .reduce((acc, v) => acc + v)) *
                  100;
                const percentUptime =
                  (Number(t.uptime) /
                    machines
                      .map((m) => Number(m.uptime))
                      .reduce((acc, v) => acc + v)) *
                  100;
                const percentPagesLastHour =
                  (Number(t.pages_last_hour) /
                    machines
                      .map((m) => Number(m.pages_last_hour))
                      .reduce((acc, v) => acc + v)) *
                  100;

                return (
                  <CCard className="mb-4" key={t.machine_id}>
                    <CCardBody>
                      <CRow>
                        <CCol sm={5}>
                          <h4 id="traffic" className="card-title mb-0">
                            {t.machine_id} (
                            {Boolean(t.no_detection) === true || t.no_detection === null
                              ? "Inativa"
                              : "Ativa"}
                            )
                          </h4>
                        </CCol>
                      </CRow>
                    </CCardBody>
                    <CCardFooter>
                      <CRow
                        xs={{ cols: 1, gutter: 4 }}
                        sm={{ cols: 2 }}
                        lg={{ cols: 4 }}
                        xl={{ cols: 5 }}
                        className="mb-2 text-center"
                      >
                        <CCol
                          className={classNames({
                            "d-none d-xl-block": false,
                          })}
                        >
                          <div className="text-body-secondary">
                            Páginas feitas
                          </div>
                          <div className="fw-semibold text-truncate">
                            {Number(t.total_count)} (
                            {isNaN(percentTotalCount) ? 0 : percentTotalCount.toFixed(2)}
                            %)
                          </div>
                          <CProgress
                            thin
                            className="mt-2"
                            color="success"
                            value={
                              isNaN(percentTotalCount) ? 0 : percentTotalCount
                            }
                          />
                        </CCol>
                        <CCol
                          className={classNames({
                            "d-none d-xl-block": false,
                          })}
                        >
                          <div className="text-body-secondary">
                            Tempo em funcionamento
                          </div>
                          <div className="fw-semibold text-truncate">
                            {calculateTime(Number(t.uptime))} (
                            {isNaN(percentUptime) ? 0 : percentUptime.toFixed(2)}
                            %)
                          </div>
                          <CProgress
                            thin
                            className="mt-2"
                            color="info"
                            value={isNaN(percentUptime) ? 0 : percentUptime}
                          />
                        </CCol>
                        <CCol
                          className={classNames({
                            "d-none d-xl-block": false,
                          })}
                        >
                          <div className="text-body-secondary">
                            Páginas Ultima Hora
                          </div>
                          <div className="fw-semibold text-truncate">
                            {Number(t.pages_last_hour)} (
                            {isNaN(percentPagesLastHour) ? 0 : percentPagesLastHour.toFixed(2)}
                            %)
                          </div>
                          <CProgress
                            thin
                            className="mt-2"
                            color="primary"
                            value={isNaN(percentPagesLastHour) ? 0 : percentPagesLastHour}
                          />
                        </CCol>
                        <CCol></CCol>
                      </CRow>
                    </CCardFooter>
                  </CCard>
                );
              }

              return null;
            })}
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </CContainer>
  );
};

export default Dashboard;
