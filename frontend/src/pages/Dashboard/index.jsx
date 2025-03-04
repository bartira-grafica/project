import React from "react";
import classNames from "classnames";

import {
  CContainer,
  CButton,
  CButtonGroup,
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

import dataList from "../../dashboard.json";

//#region Gerencia a alteração do período de uma esteira
const handleTrdmPeriodChange = (setData, selectedPeriod, id) => {
  setData((d) => ({
    ...d,
    treadmills: d.treadmills.map((t) =>
      t.id === id ? { ...t, selectedPeriod } : t
    ),
  }));
};
//#endregion

const Dashboard = () => {
  const [data, setData] = React.useState(dataList);

  const [treadmillsFilter, setTreadmillsFilter] = React.useState("Todas"); // Todas, Ativas, Inativas

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
                {treadmillsFilter}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setTreadmillsFilter("Todas")}>
                  Todas
                </CDropdownItem>
                <CDropdownItem onClick={() => setTreadmillsFilter("Ativas")}>
                  Ativas
                </CDropdownItem>
                <CDropdownItem onClick={() => setTreadmillsFilter("Inativas")}>
                  Inativas
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <br />
            <br />
            {data.treadmills.map((t) => {
              if (
                treadmillsFilter === "Todas" ||
                t.status === treadmillsFilter.substring(0, treadmillsFilter.length - 1)
              ) {
                return (
                  <CCard className="mb-4" key={t.id}>
                    <CCardBody>
                      <CRow>
                        <CCol sm={5}>
                          <h4 id="traffic" className="card-title mb-0">
                            {t.name}
                          </h4>
                        </CCol>
                        <CCol sm={7} className="d-none d-md-block">
                          <CButtonGroup className="float-end me-3">
                            {["Dia", "Mes", "Ano"].map((value) => (
                              <CButton
                                color="outline-secondary"
                                key={value}
                                className="mx-0"
                                active={value === t.selectedPeriod}
                                onClick={() =>
                                  handleTrdmPeriodChange(setData, value, t.id)
                                }
                              >
                                {value}
                              </CButton>
                            ))}
                          </CButtonGroup>
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
                        {t.data[t.selectedPeriod].map((item, index, items) => (
                          <CCol
                            className={classNames({
                              "d-none d-xl-block": index + 1 === items.length,
                            })}
                            key={index}
                          >
                            <div className="text-body-secondary">
                              {item.title}
                            </div>
                            <div className="fw-semibold text-truncate">
                              {item.value} ({item.percent}%)
                            </div>
                            <CProgress
                              thin
                              className="mt-2"
                              color={item.color}
                              value={item.percent}
                            />
                          </CCol>
                        ))}
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
