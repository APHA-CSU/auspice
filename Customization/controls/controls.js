import React from "react";

function Controls({mapOn, frequenciesOn, measurementsOn, mobileDisplay}) {
  const { t } = useTranslation();

  return (
    <ControlsContainer>
      
      <AnnotatedHeader title={t("sidebar:Color By")} tooltip={ColorByInfo} mobile={mobileDisplay}/>
      <ColorBy />

      <AnnotatedHeader title={t("sidebar:Filter Data")} tooltip={FilterInfo} mobile={mobileDisplay}/>
      <FilterData measurementsOn={measurementsOn} />

      <AnnotatedHeader title={t("sidebar:Tree Options")} tooltip={TreeOptionsInfo} mobile={mobileDisplay}/>
      <ChooseTipLabel />
      
      {mapOn ? (
        <span style={{ marginTop: "10px" }}>
        </span>
      ) : null}

      
      <span style={{ paddingTop: "10px" }} />
      <AnnotatedHeader title={t("sidebar:Panel Options")} tooltip={PanelOptionsInfo} mobile={mobileDisplay}/>
      <PanelLayout />
      <PanelToggles />
      <Language />
    </ControlsContainer>
  );
}

export default Controls;
