import React from "react";
import { useTranslation } from 'react-i18next';

import ColorBy, {ColorByInfo} from "./color-by";
import ChooseBranchLabelling from "./choose-branch-labelling";
import ChooseDataset from "./choose-dataset";
import ChooseTipLabel from "./choose-tip-label";
import PanelLayout from "./panel-layout";
import GeoResolution from "./geo-resolution";
import PanelToggles from "./panel-toggles";
import Language from "./language";
import { ControlsContainer } from "./styles";
import FilterData, {FilterInfo} from "./filter";
import { AnnotatedHeader } from "./annotatedHeader";
import {TreeOptionsInfo, MapOptionsInfo, PanelOptionsInfo} from "./miscInfoText";
/*, FrequencyInfo, AnimationOptionsInfo, 
ExplodeTreeInfo,, MeasurementsOptionsInfo*/

//import DateRangeInputs, {DateRangeInfo} from "./date-range-inputs";
//import AnimationControls from "./animation-controls";
//import ChooseExplodeAttr from "./choose-explode-attr";
//import ChooseLayout from "./choose-layout";
//import ChooseSecondTree from "./choose-second-tree";
//import ChooseMetric from "./choose-metric";
//import TransmissionLines from './transmission-lines';
//import NormalizeFrequencies from "./frequency-normalization";
//import AnimationOptions from "./animation-options";
//import ToggleTangle from "./toggle-tangle";
//import MeasurementsOptions from "./measurementsOptions";

function Controls({mapOn, frequenciesOn, measurementsOn, mobileDisplay}) {
  const { t } = useTranslation();

  return (
    <ControlsContainer>
      <ChooseDataset />

      <AnnotatedHeader title={t("sidebar:Filter Data")} tooltip={FilterInfo} mobile={mobileDisplay}/>
      <FilterData measurementsOn={measurementsOn} />

      <AnnotatedHeader title={t("sidebar:Color By")} tooltip={ColorByInfo} mobile={mobileDisplay}/>
      <ColorBy />

      <AnnotatedHeader title={t("sidebar:Tree Options")} tooltip={TreeOptionsInfo} mobile={mobileDisplay}/>
      <ChooseTipLabel />
      <ChooseBranchLabelling />
      
      {mapOn ? (
        <span style={{ marginTop: "10px" }}>
          <AnnotatedHeader title={t("sidebar:Map Options")} tooltip={MapOptionsInfo} mobile={mobileDisplay}/>
          <GeoResolution />
          {/*<TransmissionLines />*/}
        </span>
      ) : null}

      {/*{frequenciesOn ? (
        <span style={{ marginTop: "10px" }}>
          <AnnotatedHeader title={t("sidebar:Frequency Options")} tooltip={FrequencyInfo} mobile={mobileDisplay}/>
          <NormalizeFrequencies />
        </span>
      ) : null}*/}
      
      <span style={{ paddingTop: "10px" }} />
      <AnnotatedHeader title={t("sidebar:Panel Options")} tooltip={PanelOptionsInfo} mobile={mobileDisplay}/>
      <PanelLayout />
      <PanelToggles />
      <Language />

{/*   <AnnotatedHeader title={t("sidebar:Date Range")} tooltip={DateRangeInfo} mobile={mobileDisplay}/>
      <DateRangeInputs />
      <AnimationControls />*/}

{/*   <ChooseLayout />
      <ChooseMetric />
      <ChooseSecondTree />
      <ChooseExplodeAttr tooltip={ExplodeTreeInfo} mobile={mobileDisplay} />
      <ToggleTangle />*/}

{/*   {measurementsOn ? (
        <span style={{ marginTop: "10px" }}>
          <AnnotatedHeader title={t("sidebar:Measurements Options")} tooltip={MeasurementsOptionsInfo} mobile={mobileDisplay}/>
          <MeasurementsOptions />
        </span>
      ) : null}*/}

{/*   <span style={{ marginTop: "10px" }}>
        <AnnotatedHeader title={t("sidebar:Animation Options")} tooltip={AnimationOptionsInfo} mobile={mobileDisplay}/>
        <AnimationOptions />
      </span>*/}

    </ControlsContainer>
  );
}

export default Controls;
