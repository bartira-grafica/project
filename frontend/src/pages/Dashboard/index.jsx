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
} from "@coreui/react";

import { MachinesContext } from "../../contexts";

import { calculateTime } from "../../utils";

const Dashboard = () => {
  const [machinesFilter, setMachinesFilter] = React.useState("Todas"); // Todas, Ativas, Inativas
  const { machines } = React.useContext(MachinesContext);

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
            <br />
            <br />
            {machines.map((t) => {
              if (
                machinesFilter === "Todas" ||
                (machinesFilter === "Ativas" && t.no_detection === false) ||
                (machinesFilter === "Inativas" &&
                  (t.no_detection === true || t.no_detection === null))
              ) {
                const percentTotalCount =
                  (Number(t.total_count) /
                    machines
                      .map((m) => m.total_count)
                      .reduce((acc, v) => acc + Number(v))) *
                  100;
                const percentUptime =
                  (Number(t.uptime) /
                    machines
                      .map((m) => m.uptime)
                      .reduce((acc, v) => acc + Number(v))) *
                  100;

                return (
                  <CCard className="mb-4" key={t.machine_id}>
                    <CCardBody>
                      <CRow>
                        <CCol sm={5}>
                          <h4 id="traffic" className="card-title mb-0">
                            {t.machine_id} (
                            {t.no_detection === true || t.no_detection === null
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
                            {Number(t.total_count)} ({percentTotalCount}
                            %)
                          </div>
                          <CProgress
                            thin
                            className="mt-2"
                            color="success"
                            value={percentTotalCount}
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
                            {calculateTime(Number(t.uptime))} ({percentUptime}
                            %)
                          </div>
                          <CProgress
                            thin
                            className="mt-2"
                            color="info"
                            value={percentUptime}
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
