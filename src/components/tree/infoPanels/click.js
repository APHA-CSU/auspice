import React from "react";
import { isValueValid } from "../../../util/globals";
import { infoPanelStyles } from "../../../globalStyles";
import { numericToCalendar } from "../../../util/dateHelpers";
import { getTraitFromNode, getFullAuthorInfoFromNode, getVaccineFromNode,
getAccessionFromNode, getUrlFromNode } from "../../../util/treeMiscHelpers";
//import { MutationTable } from "./MutationTable";

export const styles = {
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "all",
    top: 0,
    left: 0,
    zIndex: 2000,
    backgroundColor: "rgba(80, 80, 80, .20)",
    /* FLEXBOX */
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    wordWrap: "break-word",
    wordBreak: "break-word"
  }
};

export const stopProp = (e) => {
  if (!e) {e = window.event;} // eslint-disable-line no-param-reassign
  e.cancelBubble = true;
  if (e.stopPropagation) {e.stopPropagation();}
};

/* min width to get "collection date" on 1 line: 120 */
const item = (key, value, href) => (
  <tr key={key}>
    <th style={infoPanelStyles.item}>{key}</th>
    <td style={infoPanelStyles.item}>{href ? (
      <a href={href} target="_blank" rel="noopener noreferrer">{value}</a>
    ) :
      value
    }</td>
  </tr>
);

const Link = ({url, title, value}) => (
  <tr>
    <th style={infoPanelStyles.item}>{title}</th>
    <td style={infoPanelStyles.item}>
      <a href={url} target="_blank" rel="noopener noreferrer">{value}</a>
    </td>
  </tr>
);

const AccessionAndUrl = ({node}) => {
  /* If `gisaid_epi_isl` or `genbank_accession` exist as node attrs, these preempt normal use of `accession` and `url`.
  These special values were introduced during the SARS-CoV-2 pandemic. */
  const gisaid_epi_isl = getTraitFromNode(node, "gisaid_epi_isl");
  const genbank_accession = getTraitFromNode(node, "genbank_accession");
  let gisaid_epi_isl_url = null;
  let genbank_accession_url = null;
  if (isValueValid(gisaid_epi_isl)) {
    const gisaid_accession_regex = new RegExp('EPI_ISL_[0-9]{5,}');
    if (gisaid_accession_regex.test(gisaid_epi_isl)) {
      const gisaid_epi_isl_number = gisaid_epi_isl.split("_")[2];
      // slice has to count from the end of the string rather than the beginning to deal with EPI ISLs of different lengths, eg
      // https://www.epicov.org/acknowledgement/67/98/EPI_ISL_406798.json
      // https://www.epicov.org/acknowledgement/99/98/EPI_ISL_2839998.json
      gisaid_epi_isl_url = "https://www.epicov.org/acknowledgement/" + gisaid_epi_isl_number.slice(-4, -2) + "/" + gisaid_epi_isl_number.slice(-2) + "/" + gisaid_epi_isl + ".json";
    } else {
      gisaid_epi_isl_url = "https://gisaid.org";
    }
  }
  if (isValueValid(genbank_accession)) {
    genbank_accession_url = "https://www.ncbi.nlm.nih.gov/nuccore/" + genbank_accession;
  }
  if (isValueValid(gisaid_epi_isl) && isValueValid(genbank_accession)) {
    return (
      <>
        <Link title={"GISAID EPI ISL"} value={gisaid_epi_isl} url={gisaid_epi_isl_url}/>
        <Link title={"Genbank accession"} value={genbank_accession} url={genbank_accession_url}/>
      </>
    );
  } else if (isValueValid(gisaid_epi_isl)) {
    return (
      <Link title={"GISAID EPI ISL"} value={gisaid_epi_isl} url={gisaid_epi_isl_url}/>
    );
  } else if (isValueValid(genbank_accession)) {
    return (
      <Link title={"Genbank accession"} value={genbank_accession} url={genbank_accession_url}/>
    );
  }

  const {accession, url} = getAccessionFromNode(node);
  if (accession && url) {
    return (
      <Link url={url} value={accession} title={"Accession"}/>
    );
  } else if (accession) {
    return (
      item("Accession", accession)
    );
  } else if (url) {
    return (
      <Link title={"Strain URL"} url={url} value={"click here"}/>
    );
  }
  return null;
};


const VaccineInfo = ({node, t}) => {
  const vaccineInfo = getVaccineFromNode(node);
  if (!vaccineInfo) return null;
  const renderElements = [];
  if (vaccineInfo.selection_date) {
    renderElements.push(
      <tr key={"seldate"}>
        <th>{t("Vaccine selected")}</th>
        <td>{vaccineInfo.selection_date}</td>
      </tr>
    );
  }
  if (vaccineInfo.start_date) {
    renderElements.push(
      <tr key={"startdate"}>
        <th>{t("Vaccine start date")}</th>
        <td>{vaccineInfo.start_date}</td>
      </tr>
    );
  }
  if (vaccineInfo.end_date) {
    renderElements.push(
      <tr key={"enddate"}>
        <th>{t("Vaccine end date")}</th>
        <td>{vaccineInfo.end_date}</td>
      </tr>
    );
  }
  if (vaccineInfo.serum) {
    renderElements.push(
      <tr key={"serum"}>
        <th>{t("Serum strain")}</th>
        <td/>
      </tr>
    );
  }
  return renderElements;
};

const PublicationInfo = ({node, t}) => {
  const info = getFullAuthorInfoFromNode(node);
  if (!info) return null;

  const itemsToRender = [];
  itemsToRender.push(item(t("Authors"), info.value));
  if (info.title && info.title !== "?") {
    if (info.paper_url && info.paper_url !== "?") {
      itemsToRender.push(item(t("Title"), info.title, info.paper_url));
    } else {
      itemsToRender.push(item(t("Title"), info.title));
    }
  }
  if (info.journal && info.journal !== "?") {
    itemsToRender.push(item(t("Journal"), info.journal));
  }
  return (itemsToRender.length === 1 ? itemsToRender[0] : itemsToRender);
};

const StrainName = ({children}) => (
  <p style={infoPanelStyles.modalHeading}>{children}</p>
);

const SampleDate = ({isTerminal, node, t}) => {
  const date = getTraitFromNode(node, "num_date");
  if (!date) return null;

  const dateUncertainty = getTraitFromNode(node, "num_date", {confidence: true});
  if (date && dateUncertainty && dateUncertainty[0] !== dateUncertainty[1]) {
    return (
      <>
        {item(t(isTerminal ? "Inferred collection date" : "Inferred date"), numericToCalendar(date))}
        {item(t("Date Confidence Interval"), `(${numericToCalendar(dateUncertainty[0])}, ${numericToCalendar(dateUncertainty[1])})`)}
      </>
    );
  }
  /* internal nodes are always inferred, regardless of whether uncertainty bounds are present */
  return item(t(isTerminal ? "Collection date" : "Inferred date"), numericToCalendar(date));
};

var traitOrder = {"PreciseLocation":4, "CPH_Type":5, "County":6, "Host":3, "Identifier":1,
                  "MoveCount":10, "OutsideHomeRange":8, "PreviousMovement":9,
                  "RiskArea":7, "Submission":2}

const getTraitsToDisplay = (node) => {
  // TODO -- this should be centralised somewhere
  if (!node.node_attrs) return [];
  const ignore = ["author", "div", "num_date", "gisaid_epi_isl", "genbank_accession", "accession", "url"];
  return Object.keys(node.node_attrs).sort(function(a,b) { return traitOrder[a] - traitOrder[b]; })
              .filter((k) => !ignore.includes(k));
};

const Trait = ({node, trait, colorings, isTerminal}) => {
  let value = getTraitFromNode(node, trait);
  const confidence = getTraitFromNode(node, trait, {confidence: true});
  const isTemporal = colorings[trait]?.type==="temporal";

  if (typeof value === "number" && !isTemporal) {
    if (!Number.isInteger(value)) {
      value = Number.parseFloat(value).toPrecision(3);
    }
  }
  if (!isValueValid(value)) return null;

  if (confidence && value in confidence) {
    /* if it's a tip with one confidence value > 0.99 then we interpret this as a known (i.e. not inferred) state */
    if (!isTerminal || confidence[value]<0.99) {
      value = `${value} (${(100 * confidence[value]).toFixed(0)}%)`;
    }
  }

  const name = (colorings && colorings[trait] && colorings[trait].title) ?
    colorings[trait].title :
    trait;

  /* case where the colorScale is temporal */
  if (isTemporal && typeof value === "number") {
    return item(name, numericToCalendar(value));
  }

  const url = getUrlFromNode(node, trait);
  if (url) {
    return <Link title={name} url={url} value={value}/>;
  }
  return item(name, value);
};

/**
 * A React component to display information about a tree tip in a modal-overlay style
 * @param  {Object}   props
 * @param  {Object}   props.tip              tip node selected
 * @param  {function} props.goAwayCallback
 * @param  {object}   props.colorings
 */
const NodeClickedPanel = ({selectedNode, clearSelectedNode, colorings, observedMutations, geneSortFn, t}) => {
  if (selectedNode.event!=="click") {return null;}
  const panelStyle = { ...infoPanelStyles.panel};
  panelStyle.maxHeight = "70%";
  const node = selectedNode.node.n;
  const isTip = selectedNode.type === "tip";
  const isTerminal = node.fullTipCount===1;

  const title = isTip ?
    node.name :
    isTerminal ?
      `Branch leading to ${node.name}` :
      "Internal branch";

  return (
    <div style={infoPanelStyles.modalContainer} onClick={() => clearSelectedNode(selectedNode)}>
      <div className={"panel"} style={panelStyle} onClick={(e) => stopProp(e)}>
        <StrainName>{title}</StrainName>
        <table>
          <tbody>
            {!isTip && item(t("Number of terminal tips"), node.fullTipCount)}
            {isTip && <VaccineInfo node={node} t={t}/>}
            <SampleDate isTerminal={isTerminal} node={node} t={t}/>
            {!isTip && item("Node name", node.name)}
            {isTip && <PublicationInfo node={node} t={t}/>}
            {getTraitsToDisplay(node).map((trait) => (
              <Trait node={node} trait={trait} colorings={colorings} key={trait} isTerminal={isTerminal}/>
            ))}
            {isTip && <AccessionAndUrl node={node}/>}
            {item("", "")}
          </tbody>
        </table>
        <p style={infoPanelStyles.comment}>
          {t("Click outside this box to go back to the tree")}
        </p>
      </div>
    </div>
  );
};

export default NodeClickedPanel;
