import React from "react";
import { infoPanelStyles } from "../../globalStyles";


const Container = ({selectedDeme, panelDims, children, t}) => {
   const xOffset = 10;
   const yOffset = 10;
 
   let width = 200;
   if (panelDims.width < 420) {
     width = 200;
   } else if (panelDims.width < 460) {
     width = 220;
   } else if (panelDims.width < 500) {
     width = 240;
   } else if (panelDims.width < 540) {
     width = 260;
   } else {
      width = 280;
   }

   const styles = {
     container: {
       position: "absolute",
       width,
       padding: "10px",
       borderRadius: 10,
       zIndex: 1000,
       pointerEvents: "none",
       fontFamily: infoPanelStyles.panel.fontFamily,
       fontSize: 14,
       lineHeight: 1,
       fontWeight: infoPanelStyles.panel.fontWeight,
       color: infoPanelStyles.panel.color,
       backgroundColor: infoPanelStyles.panel.backgroundColor,
       wordWrap: "break-word",
       wordBreak: "break-word"
     }
   };
   if (xPos < panelDims.width * 0.5) {
     styles.container.left = xPos + xOffset;
   } else {
     styles.container.right = panelDims.width - xPos + xOffset;
   }
   if (yPos < panelDims.height * 0.55) {
     styles.container.top = yPos + 4 * yOffset;
   } else {
     styles.container.bottom = panelDims.height - yPos + yOffset;
   }
 
 
   return (
     <div style={styles.container}>
       <div className={"tooltip"} style={infoPanelStyles.tooltip}>
         {children}
       </div>
     </div>
   );
 };

 const Comment = ({children}) => (
  <div style={infoPanelStyles.comment}>
    {children}
  </div>
);
//some more stuff needed here???? - look at hover.js to work it out
// Get the location name of the deme
//const getGeoLocationfromDeme = demeData[d.demeDataIdx].name;

const MapInfoPanel = ({
  selectedDeme,
  panelDims,
  t
}) => {
  if (selectedDeme.event !== "hover") return null;
  const deme = selectedDeme.deme.n;
  const idxOfGeoLocation = demeData[d.demeDataIdx].name;

  return (
    <Container deme={deme} panelDims={panelDims}>
       <>
         {/*<Location name={idxOfGeoLocation}/>*/}
         {/*<VaccineInfo node={node} t={t}/>
         <TipMutations node={node} t={t}/>
         <BranchLength node={node} t={t}/>
         <ColorBy node={node} colorBy={colorBy} colorByConfidence={colorByConfidence} colorScale={colorScale} colorings={colorings}/>*/}
         {/*<AttributionInfo deme={deme}/>*/}
         <Comment>{t("Blah")}</Comment>
       </>
    </Container>
  );
};

export default MapInfoPanel;